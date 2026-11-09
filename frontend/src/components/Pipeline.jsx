import { ETIQUETA, ORDEN } from "../estados.js";

// Barra de flujo: muestra cuántos pedidos hay en cada estado y sirve de filtro.
export default function Pipeline({ pedidos, filtro, onFiltro }) {
  const total = pedidos.length;
  const cuenta = (e) => pedidos.filter((p) => p.estado === e).length;

  return (
    <section className="pipeline" aria-label="Pedidos por estado">
      <button
        type="button"
        className={`etapa todos${filtro === "" ? " activa" : ""}`}
        aria-pressed={filtro === ""}
        onClick={() => onFiltro("")}
      >
        <span className="etapa-nombre">Todos los pedidos</span>
        <span className="etapa-num">{total}</span>
      </button>
      {ORDEN.map((e) => {
        const n = cuenta(e);
        return (
          <button
            key={e}
            type="button"
            data-estado={e}
            className={`etapa${filtro === e ? " activa" : ""}`}
            aria-pressed={filtro === e}
            onClick={() => onFiltro(filtro === e ? "" : e)}
          >
            <span className="etapa-nombre">
              <span className="punto" />
              {ETIQUETA[e]}
            </span>
            <span className="etapa-num">{n}</span>
            <span className="barra">
              <span style={{ width: total ? `${(n / total) * 100}%` : "0%" }} />
            </span>
          </button>
        );
      })}
    </section>
  );
}
