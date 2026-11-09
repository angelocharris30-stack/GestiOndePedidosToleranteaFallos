import { ETIQUETA } from "../estados.js";
import { colorAvatar, fechaCorta, iniciales, moneda } from "../utils.js";
import { Icon } from "./Icons.jsx";

function Esqueleto() {
  return (
    <div className="tabla-wrap" aria-busy="true" aria-label="Cargando pedidos">
      <table>
        <tbody>
          {[0, 1, 2].map((i) => (
            <tr key={i}>
              <td className="n"><div className="sk" style={{ width: 18 }} /></td>
              <td><div className="sk" style={{ width: 130 }} /></td>
              <td><div className="sk" style={{ width: 160 }} /></td>
              <td className="num"><div className="sk" style={{ width: 24, marginLeft: "auto" }} /></td>
              <td className="num"><div className="sk" style={{ width: 70, marginLeft: "auto" }} /></td>
              <td><div className="sk" style={{ width: 86 }} /></td>
              <td><div className="sk" style={{ width: 90 }} /></td>
              <td />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PedidoTable({ pedidos, total, cargando, editandoId, onEditar, onEliminar, onLimpiar }) {
  if (cargando) return <Esqueleto />;

  if (total === 0) {
    return (
      <div className="vacio">
        <span className="ico"><Icon.Inbox size={22} /></span>
        <strong>Aún no hay pedidos</strong>
        <p>Crea el primero con el formulario de arriba.</p>
      </div>
    );
  }
  if (pedidos.length === 0) {
    return (
      <div className="vacio">
        <span className="ico"><Icon.Search size={22} /></span>
        <strong>Ningún pedido coincide</strong>
        <p>Prueba con otra búsqueda o quita el filtro de estado.</p>
        <button type="button" className="btn chico" onClick={onLimpiar}>Quitar filtros</button>
      </div>
    );
  }

  return (
    <div className="tabla-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Producto</th>
            <th className="num">Cant.</th>
            <th className="num">Total</th>
            <th>Estado</th>
            <th>Creado</th>
            <th><span className="sr-only">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => {
            const [bg, fg] = colorAvatar(p.cliente);
            return (
              <tr key={p.id} className={p.id === editandoId ? "fila-editando" : ""}>
                <td className="n">{p.numero}</td>
                <td>
                  <div className="cliente">
                    <span className="avatar" style={{ "--av-bg": bg, "--av-fg": fg }}>{iniciales(p.cliente)}</span>
                    {p.cliente}
                  </div>
                </td>
                <td>{p.producto}</td>
                <td className="num">{p.cantidad}</td>
                <td className="num">{moneda(p.total)}</td>
                <td><span className="chip" data-estado={p.estado}>{ETIQUETA[p.estado]}</span></td>
                <td className="fecha">{fechaCorta(p.created_at)}</td>
                <td>
                  <div className="acciones-fila">
                    <button type="button" className="btn chico fantasma" onClick={() => onEditar(p)}
                      aria-label={`Editar pedido ${p.numero}`}>
                      <Icon.Edit size={15} /> Editar
                    </button>
                    <button type="button" className="btn chico fantasma peligro" onClick={() => onEliminar(p)}
                      aria-label={`Eliminar pedido ${p.numero}`}>
                      <Icon.Trash size={15} /> Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
