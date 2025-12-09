interface MeanModalProps {
  show: boolean;
  onClose: () => void;
}
export function MeanModal({ show, onClose }: MeanModalProps) {
  if (!show) return null;
  return (
    <>
      {/* Backdrop */}
      <div 
        className="modal-backdrop fade show" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="modal fade show d-block" 
        tabIndex={-1}
        role="dialog"
        aria-labelledby="meanModalLabel"
        aria-hidden={!show}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="meanModalLabel">
                Metodología
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Cerrar"
              />
            </div>
            <div className="modal-body">
              <p>
                Para calcular el promedio, se toman todos los vuelos que aterrizaron 
                y se calcula la diferencia entre la hora programada y la hora real de despegue.
              </p>
              <p>Solo se incluyen vuelos que:</p>
              <ul>
                <li>Ya despegaron (tienen hora real de despegue)</li>
                <li>Vuelan entre aeropuertos donde también opera Flybondi</li>
              </ul>
              <p className="mb-0">
                Los vuelos cancelados no se incluyen en este cálculo.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
