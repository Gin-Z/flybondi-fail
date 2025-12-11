// Mapeo de códigos IATA a nombres de aeropuertos
export const airportNames: Record<string, string> = {
    // Argentina - Aeropuertos principales
    'EZE': 'Ezeiza',
    'AEP': 'Aeroparque',
    
    // Argentina - Interior
    'COR': 'Córdoba',
    'MDZ': 'Mendoza',
    'BRC': 'Bariloche',
    'USH': 'Ushuaia',
    'FTE': 'El Calafate',
    'IGR': 'Iguazú',
    'SLA': 'Salta',
    'TUC': 'Tucumán',
    'JUJ': 'Jujuy',
    'NQN': 'Neuquén',
    'PSS': 'Posadas',
    'RES': 'Resistencia',
    'CNQ': 'Corrientes',
    'SDE': 'Santiago del Estero',
    'PMY': 'Puerto Madryn',
    'UAQ': 'San Juan',
    'RGL': 'Río Gallegos',
    'CTC': 'Catamarca',
    'RCU': 'Río Cuarto',
    'VDM': 'Viedma',
    'REL': 'Trelew',
    'FMA': 'Formosa',
    'LGS': 'Comodoro Rivadavia',
    'CRD': 'Comodoro Rivadavia',
    
    // Brasil - Principales
    'GRU': 'São Paulo (Guarulhos)',
    'CGH': 'São Paulo (Congonhas)',
    'GIG': 'Río de Janeiro (Galeão)',
    'SDU': 'Río de Janeiro (Santos Dumont)',
    'BSB': 'Brasilia',
    'SSA': 'Salvador',
    'FOR': 'Fortaleza',
    'REC': 'Recife',
    'POA': 'Porto Alegre',
    'CWB': 'Curitiba',
    'FLN': 'Florianópolis',
    'BEL': 'Belém',
    'MAO': 'Manaos',
    'NAT': 'Natal',
    'VCP': 'Campinas',
    
    // Chile
    'SCL': 'Santiago de Chile',
    'IPC': 'Isla de Pascua',
    'ANF': 'Antofagasta',
    
    // Paraguay
    'ASU': 'Asunción',
    
    // Uruguay
    'MVD': 'Montevideo',
    'PDP': 'Punta del Este',
    
    // Perú
    'LIM': 'Lima',
    'CUZ': 'Cusco',
    
    // Bolivia
    'VVI': 'Santa Cruz',
    'LPB': 'La Paz',
    
    // Miami
    'MIA': 'Miami',
};

// Función auxiliar para obtener el nombre del aeropuerto
export const getAirportName = (code: string): string => {
    return airportNames[code.toUpperCase()] || code;
};
