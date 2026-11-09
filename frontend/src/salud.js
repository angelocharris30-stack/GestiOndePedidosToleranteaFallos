// Resumen del estado del sistema a partir de /api/cluster
export function resumenSalud(data, caido) {
  if (caido) {
    return { nivel: "down", corto: "Sin conexión", titulo: "Sin conexión con el sistema",
      detalle: "El balanceador no responde. Se reintenta automáticamente." };
  }
  if (!data) {
    return { nivel: "carga", corto: "Comprobando", titulo: "Comprobando el estado…", detalle: "" };
  }
  const nodos = [...data.api_nodes, ...data.db_nodes];
  const total = nodos.length + 1; // + balanceador (responde, si no, no habría datos)
  const activos = 1 + nodos.filter((n) => n.up).length;
  const caidos = total - activos;
  const hayEscritor = data.db_nodes.some((d) => d.up && d.role === "primary");
  if (!hayEscritor) {
    return { nivel: "warn", corto: "Solo lectura", titulo: "Solo lectura: no hay base de datos primaria",
      detalle: "Las escrituras se restablecen al promover la réplica (scripts/promote.sh).", activos, total };
  }
  if (caidos > 0) {
    return { nivel: "warn", corto: "Degradado", titulo: "Funcionando con nodos caídos",
      detalle: `${activos} de ${total} nodos activos. El sistema sigue atendiendo peticiones.`, activos, total };
  }
  return { nivel: "ok", corto: "Operativo", titulo: "Todos los nodos operativos",
    detalle: `${activos} de ${total} nodos activos.`, activos, total };
}
