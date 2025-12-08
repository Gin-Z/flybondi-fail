// src/context/FlightsContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getFlights } from '../services/Flight.service';
import type { Flight } from '../types/Flight.interface';

interface FlightsContextType {
    flights: Flight[];
    date: Date;
    setDate: (date: Date) => void;
    loading: boolean;
    error: string | null;
}

const FlightsContext = createContext<FlightsContextType | undefined>(undefined);

export const useFlights = () => {
    const context = useContext(FlightsContext);
    if (!context) {
        throw new Error('useFlights debe usarse dentro de FlightsProvider');
    }
    return context;
};

interface FlightsProviderProps {
    children: ReactNode;
}

export const FlightsProvider = ({ children }: FlightsProviderProps) => {
    const [date, setDate] = useState(new Date());
    const [flights, setFlights] = useState<Flight[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFlights = async () => {
            setLoading(true);
            setError(null);
            try {
                const displayedDate = new Date(date);
                displayedDate.setDate(displayedDate.getDate() - 1);
                
                const data = await getFlights(displayedDate);
                setFlights(data);
            } catch (err) {
                setError('Error al cargar los vuelos');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFlights();
    }, [date]);

    return (
        <FlightsContext.Provider value={{ flights, date, setDate, loading, error }}>
            {children}
        </FlightsContext.Provider>
    );
};