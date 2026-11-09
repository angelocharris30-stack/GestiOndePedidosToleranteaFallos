import { useEffect } from "react";

export default function ConfirmDialog({ pedido, onCancelar, onConfirmar }) {
  useEffect(() => {
    const alTeclear = (e) => e.key === "Escape" && onCancelar();
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [onCancelar]);

  return (
    <div className="overlay" onClick={onCancelar}>
      <div className="dialogo" role="alertdialog" aria-modal="true" aria-labelledby="dlg-titulo"
        aria-describedby="dlg-texto" onClick={(e) => e.stopPropagation()}>
        <h3 id="dlg-titulo">¿Eliminar el pedido #{pedido.numero}?</h3>
        <p id="dlg-texto">
          Pedido de {pedido.cliente} ({pedido.producto}). Se quitará de la lista y los pedidos
          siguientes se renumerarán.
        </p>
        <div className="botones">
          <button type="button" className="btn" autoFocus onClick={onCancelar}>Cancelar</button>
          <button type="button" className="btn peligro-solido" onClick={onConfirmar}>Eliminar pedido</button>
        </div>
      </div>
    </div>
  );
}
