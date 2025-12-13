interface WastedTimeModalProps {
  show: boolean;
  onClose: () => void;
}

const WastedTimeModal =({ show, onClose }: WastedTimeModalProps)=>{
    if (!show)
    return (<>
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
                                        Para calcular el tiempo total desperdiciado, se:
                                    </p>
                                    <ul>
                                        <li>Toma cada vuelo que ya despegó</li>
                                        <li>Multiplica el retraso por la cantidad de asientos del avión</li>
                                        <li>Asume una ocupación del 75% en cada vuelo</li>
                                    </ul>
                                    <p>
                                        Por ejemplo, si un avión de 189 asientos se atrasa 1 hora, se calcula:
                                        60 minutos × 189 asientos × 0.75 = 8.505 minutos-persona desperdiciados.
                                    </p>
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
    </>)
}
export default WastedTimeModal;