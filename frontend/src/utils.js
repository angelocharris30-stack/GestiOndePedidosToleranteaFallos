export const moneda = (n) =>
  n.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });

export const fechaCorta = (iso) =>
  new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

export const normalizar = (s) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export const iniciales = (nombre) =>
  nombre.trim().split(/\s+/).slice(0, 2).map((w) => (w[0] || "").toUpperCase()).join("") || "?";

// Paleta suave [fondo, texto] para los avatares; el color depende del nombre
const PALETA = [
  ["#E3EEF9", "#1B5A9E"],
  ["#E3F0F1", "#0B5058"],
  ["#EBE8F8", "#5B47A8"],
  ["#FBEFD9", "#8F5309"],
  ["#FBE7EE", "#A12B55"],
  ["#E7F1DC", "#4B6A1F"],
];
export const colorAvatar = (nombre) => {
  let h = 0;
  for (const c of nombre) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETA[h % PALETA.length];
};
