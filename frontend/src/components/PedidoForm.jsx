import { useState } from "react";
import { ETIQUETA, ORDEN } from "../estados.js";
import { Icon } from "./Icons.jsx";

const VACIO = { cliente: "", producto: "", cantidad: 1, precio_unitario: "" };

export default function PedidoForm({ editando, onGuardar, onCancelar, onCambiarEstado }) {
  const [form, setForm] = useState(
    editando
      ? {
          cliente: editando.cliente,
          producto: editando.producto,
          cantidad: editando.cantidad,
          precio_unitario: editando.precio_unitario,
        }
      : VACIO
  );
  const [enviando, setEnviando] = useState(false);
  const [cambiando, setCambiando] = useState(false);

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    const ok = await onGuardar({
      ...form,
      cantidad: Number(form.cantidad),
      precio_unitario: Number(form.precio_unitario),
    });
    setEnviando(false);
    if (ok && !editando) setForm(VACIO);
  };

  const moverEstado = async (nuevo) => {
    setCambiando(true);
    await onCambiarEstado(nuevo);
    setCambiando(false);
  };

  const idx = editando ? ORDEN.indexOf(editando.estado) : -1;
  const ant = ORDEN[idx - 1];
  const sig = ORDEN[idx + 1];

  return (
    <section className="panel form-panel">
      <div className="form-cab">
        <h2>{editando ? `Editar pedido #${editando.numero}` : "Nuevo pedido"}</h2>
        {editando && (
          <button type="button" className="btn chico fantasma" onClick={onCancelar}>
            <Icon.Close size={15} /> Cerrar edición
          </button>
        )}
      </div>

      {editando && (
        <div className="flujo">
          <div className="flujo-cab">
            <div>
              <div className="flujo-titulo">Estado del pedido</div>
              <p className="sub">Se mueve de un paso en un paso. Usa «Volver» si te equivocaste.</p>
            </div>
            <div className="botones">
              <button type="button" className="btn" disabled={!ant || cambiando} onClick={() => moverEstado(ant)}>
                <Icon.ArrowLeft size={16} /> {ant ? `Volver a ${ETIQUETA[ant]}` : "Sin estado anterior"}
              </button>
              <button type="button" className="btn primario" disabled={!sig || cambiando} onClick={() => moverEstado(sig)}>
                {sig ? `Avanzar a ${ETIQUETA[sig]}` : "Sin estado siguiente"} <Icon.ArrowRight size={16} />
              </button>
            </div>
          </div>
          <ol className="pasos">
            {ORDEN.map((e, i) => (
              <li key={e} className={i === idx ? "actual" : i < idx ? "hecho" : ""} aria-current={i === idx ? "step" : undefined}>
                <span className="marca-paso">{i < idx ? <Icon.Check size={13} strokeWidth={2.6} /> : i + 1}</span>
                {ETIQUETA[e]}
              </li>
            ))}
          </ol>
        </div>
      )}

      <form onSubmit={enviar} className="form">
        <label>
          Cliente
          <input name="cliente" value={form.cliente} onChange={cambiar} required maxLength={120} placeholder="Nombre del cliente" />
        </label>
        <label>
          Producto
          <input name="producto" value={form.producto} onChange={cambiar} required maxLength={120} placeholder="Producto" />
        </label>
        <label>
          Cantidad
          <input name="cantidad" type="number" min="1" value={form.cantidad} onChange={cambiar} required />
        </label>
        <label>
          Precio unitario
          <input name="precio_unitario" type="number" min="0.01" step="0.01" value={form.precio_unitario}
            onChange={cambiar} required placeholder="0" />
        </label>
        <div className="acciones">
          <button type="submit" className="btn primario" disabled={enviando}>
            {enviando ? "Guardando…" : editando ? "Guardar cambios" : "Crear pedido"}
          </button>
        </div>
      </form>
    </section>
  );
}
