import { resumenSalud } from "../salud.js";
import { Icon } from "./Icons.jsx";

function Nodo({ icono, nombre, detalle, up, rol }) {
  return (
    <div className={`nodo ${up ? "up" : "down"}`}>
      <span className="nodo-icono">{icono}</span>
      <div className="nodo-txt">
        <div className="nodo-nombre">
          {nombre}
          {rol && <span className={`rol ${rol.tipo}`}>{rol.texto}</span>}
        </div>
        <div className="nodo-det">{detalle}</div>
      </div>
      <span className="nodo-estado" title={up ? "Operativo" : "Sin respuesta"}>
        <span className="punto" />
        {!up && "Sin respuesta"}
      </span>
    </div>
  );
}

export default function ClusterPanel({ data, caido, hora }) {
  const s = resumenSalud(data, caido);
  const dbs = data?.db_nodes ?? [];
  const replicando = dbs.length === 2 && dbs.every((d) => d.up) && dbs.some((d) => d.role === "primary") && dbs.some((d) => d.role === "replica");

  return (
    <section className="panel">
      <div className={`estado-sist ${s.nivel}`}>
        <span className="ico">{s.nivel === "ok" || s.nivel === "carga" ? <Icon.Pulse size={22} /> : <Icon.Alert size={22} />}</span>
        <div>
          <h2>{s.titulo}</h2>
          <p>
            {s.detalle}
            {hora && ` Actualizado a las ${hora.toLocaleTimeString("es-CO", { hour12: false })}.`}
            {data && ` Consulta atendida por ${data.answered_by}.`}
          </p>
        </div>
      </div>

      <div className="topo">
        <div className="topo-col">
          <h3>Entrada</h3>
          <Nodo icono={<Icon.Globe size={18} />} nombre="Balanceador NGINX" detalle="Puerto 8080 · reparte la carga" up={!caido} />
        </div>

        <div className="topo-col">
          <h3>Aplicación</h3>
          {data?.api_nodes.map((n) => (
            <Nodo key={n.node} icono={<Icon.Server size={18} />} nombre={n.node} detalle={n.url} up={n.up} />
          ))}
        </div>

        <div className="topo-col">
          <h3>Datos</h3>
          {dbs.map((d, i) => (
            <div key={d.host} className="topo-item">
              {i === 1 && replicando && (
                <div className="repl"><Icon.ArrowDown size={14} /> replicación en tiempo real</div>
              )}
              <Nodo
                icono={<Icon.Database size={18} />}
                nombre={d.host}
                detalle={d.detail || (d.up ? "" : "no responde")}
                up={d.up}
                rol={d.up ? (d.role === "primary" ? { tipo: "primario", texto: "Primario" } : { tipo: "replica", texto: "Réplica" }) : null}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
