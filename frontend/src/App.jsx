import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./api.js";
import { ETIQUETA } from "./estados.js";
import { normalizar } from "./utils.js";
import { resumenSalud } from "./salud.js";
import { Icon } from "./components/Icons.jsx";
import Pipeline from "./components/Pipeline.jsx";
import PedidoForm from "./components/PedidoForm.jsx";
import PedidoTable from "./components/PedidoTable.jsx";
import ClusterPanel from "./components/ClusterPanel.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";

export default function App() {
  const [tab, setTab] = useState("pedidos");
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);
  const [aEliminar, setAEliminar] = useState(null);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState(null); // { id, texto } -> notificación flotante de 1,5 s
  const avisoTimer = useRef(null);
  const [meta, setMeta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cluster, setCluster] = useState(null);
  const [clusterCaido, setClusterCaido] = useState(false);
  const [clusterHora, setClusterHora] = useState(null);

  const cargar = useCallback(async (consistente = false) => {
    try {
      const { data, meta } = await api.listar("", consistente === true);
      setPedidos(data);
      setMeta(meta);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
    const t = setInterval(() => cargar(), 5000); // refresco periódico: se ve la conmutación en vivo
    return () => clearInterval(t);
  }, [cargar]);

  // Estado del clúster (alimenta el indicador de la cabecera y la pestaña de monitoreo)
  useEffect(() => {
    let vivo = true;
    const consultar = async () => {
      try {
        const { data } = await api.cluster();
        if (vivo) {
          setCluster(data);
          setClusterCaido(false);
          setClusterHora(new Date());
        }
      } catch {
        if (vivo) setClusterCaido(true);
      }
    };
    consultar();
    const t = setInterval(consultar, 3000);
    return () => {
      vivo = false;
      clearInterval(t);
    };
  }, []);

  const mostrarAviso = (texto) => {
    clearTimeout(avisoTimer.current);
    setAviso({ id: Date.now(), texto }); // el id reinicia la animación si llega otro aviso
    avisoTimer.current = setTimeout(() => setAviso(null), 1500);
  };

  // Ejecuta una acción de escritura mostrando errores y refrescando la lista.
  // Devuelve { data } si salió bien o null si falló.
  const ejecutar = async (fn, mensajeOk) => {
    try {
      const { data, meta } = await fn();
      setMeta(meta);
      setError("");
      mostrarAviso(mensajeOk);
      await cargar(true); // tras escribir, leer del primario
      return { data };
    } catch (e) {
      setError(e.message);
      if (e.status === 409) cargar(true); // conflicto: traer la versión actual
      return null;
    }
  };

  const guardar = async (form) => {
    if (editando) {
      const r = await ejecutar(
        () => api.actualizar(editando.id, { ...form, version: editando.version }),
        `Pedido #${editando.numero} actualizado`
      );
      if (r) setEditando(null);
      return !!r;
    }
    return !!(await ejecutar(() => api.crear(form), "Pedido creado"));
  };

  // Cambio de estado desde el formulario de edición (avanzar o retroceder un paso)
  const cambiarEstado = async (nuevo) => {
    const r = await ejecutar(
      () => api.cambiarEstado(editando.id, nuevo, editando.version),
      `Pedido #${editando.numero}: ${ETIQUETA[editando.estado]} → ${ETIQUETA[nuevo]}`
    );
    if (r) setEditando({ ...editando, estado: r.data.estado, version: r.data.version });
  };

  // El número visible puede cambiar si se elimina otro pedido: se toma siempre de la lista actual
  const editandoVista = editando
    ? { ...editando, numero: pedidos.find((x) => x.id === editando.id)?.numero ?? editando.numero }
    : null;

  const iniciarEdicion = (p) => {
    setEditando(p);
    window.scrollTo({ top: 0, behavior: "smooth" }); // llevar al formulario de arriba
  };

  const confirmarEliminar = async () => {
    const p = aEliminar;
    setAEliminar(null);
    if (editando && editando.id === p.id) setEditando(null);
    await ejecutar(() => api.eliminar(p.id), `Pedido #${p.numero} eliminado`);
  };

  const q = normalizar(busqueda.trim());
  const visibles = pedidos.filter(
    (p) => (!filtro || p.estado === filtro) && (!q || normalizar(`${p.cliente} ${p.producto}`).includes(q))
  );
  const limpiarFiltros = () => {
    setFiltro("");
    setBusqueda("");
  };

  const salud = resumenSalud(cluster, clusterCaido);

  return (
    <>
      <header className="topbar">
        <div className="topbar-in">
          <div className="marca">
            <span className="logo"><Icon.Logo size={18} /></span>
            Gestión Distribuida de Pedidos
          </div>
          <nav className="tabs" aria-label="Secciones">
            <button type="button" className="tab" aria-current={tab === "pedidos" ? "page" : undefined} onClick={() => setTab("pedidos")}>
              Pedidos
            </button>
            <button type="button" className="tab" aria-current={tab === "monitor" ? "page" : undefined} onClick={() => setTab("monitor")}>
              Monitoreo del clúster
            </button>
          </nav>
          <div className="topbar-der">
            <span className={`salud ${salud.nivel}`} role="status" title={salud.titulo}>
              <span className="punto" />
              {salud.corto}
            </span>
            {meta && (
              <span className="nodo-badge" title="Nodo que atendió la última petición">
                <b>{meta.node}</b>
                <span className="sep" />
                {meta.ms} ms
                {meta.intentos > 1 && <> · {meta.intentos} intentos</>}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Notificaciones flotantes: no desplazan el contenido de la página */}
      <div className="toasts" aria-live="polite">
        {error && (
          <div className="toast error">
            <Icon.Alert size={17} />
            <span>{error}</span>
          </div>
        )}
        {aviso && (
          <div key={aviso.id} className="toast ok">
            <Icon.Check size={17} strokeWidth={2.4} />
            <span>{aviso.texto}</span>
          </div>
        )}
      </div>

      <main className="contenido">
        {tab === "pedidos" ? (
          <>
            <Pipeline pedidos={pedidos} filtro={filtro} onFiltro={setFiltro} />

            <PedidoForm
              key={editando ? editando.id : "nuevo"}
              editando={editandoVista}
              onGuardar={guardar}
              onCancelar={() => setEditando(null)}
              onCambiarEstado={cambiarEstado}
            />

            <section className="panel">
              <div className="panel-cab">
                <h2>
                  Pedidos
                  <span className="cuenta">
                    {visibles.length === pedidos.length ? pedidos.length : `${visibles.length} de ${pedidos.length}`}
                  </span>
                </h2>
                <div className="herr">
                  {filtro && (
                    <button type="button" className="chip-filtro" onClick={() => setFiltro("")}>
                      Estado: {ETIQUETA[filtro]} <Icon.Close size={14} />
                    </button>
                  )}
                  <label className="buscar">
                    <span className="sr-only">Buscar pedidos</span>
                    <Icon.Search size={16} />
                    <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                      placeholder="Buscar por cliente o producto" />
                  </label>
                </div>
              </div>
              <PedidoTable
                pedidos={visibles}
                total={pedidos.length}
                cargando={cargando}
                editandoId={editando ? editando.id : null}
                onEditar={iniciarEdicion}
                onEliminar={setAEliminar}
                onLimpiar={limpiarFiltros}
              />
            </section>
          </>
        ) : (
          <ClusterPanel data={cluster} caido={clusterCaido} hora={clusterHora} />
        )}
      </main>

      {aEliminar && (
        <ConfirmDialog pedido={aEliminar} onCancelar={() => setAEliminar(null)} onConfirmar={confirmarEliminar} />
      )}
    </>
  );
}
