// src/components/Header.tsx
import { useFlights } from "../context/FlightsContext";

const Header = () => {
    const { date, setDate, loading, error, flights } = useFlights();

    function formatDate() {
        const d = new Date(date);
        d.setDate(d.getDate() - 1);

        const day = d.getDate();
        const month = d.getMonth() + 1;
        const year = d.getFullYear();

        return `${day}-${month}-${year}`;
    }

    function isSameDay(d1: Date, d2: Date) {
        return (
            d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate()
        );
    }

    const handlePrevious = () => {
        setDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            return d;
        });
    };

    const handleNext = () => {
        setDate(next => {
            const d = new Date(next);
            d.setDate(d.getDate() + 1);
            return d;
        });
    };

    const displayedDate = new Date(date);
    displayedDate.setDate(displayedDate.getDate() - 1);

    const today = new Date();
    const limit = new Date(today);
    limit.setDate(limit.getDate() - 1);

    return (
        <div className="card content-center">
            <div className="card-header text-center">Información de Flybondi</div>
            <div className="card-body text-center">
                <h5 className="card-title">Viendo datos de</h5>
                <div className="d-flex justify-content-center align-items-center gap-3">
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handlePrevious}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-left" />
                    </button>
                    <p className="card-text m-0">
                        {formatDate()}
                        {loading && " (Cargando...)"}
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleNext}
                        disabled={isSameDay(displayedDate, limit) || loading}
                    >
                        <i className="bi bi-arrow-right" />
                    </button>
                </div>
                {error && (
                    <div className="alert alert-danger mt-2" role="alert">
                        {error}
                    </div>
                )}
                {!loading && !error && (
                    <p className="text-muted mt-2">
                        {flights.length} vuelos encontrados
                    </p>
                )}
            </div>
        </div>
    );
};

export default Header;