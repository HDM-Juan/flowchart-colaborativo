// Configuration for diagram element types - extensible for future additions
export const NODE_TYPES = {
  START_END: {
    id: 'start-end',
    label: 'Inicio/Fin',
    className: 'start-end',
    defaultText: 'Inicio',
    description: 'Nodo de inicio o fin del proceso'
  },
  PROCESS: {
    id: 'process',
    label: 'Proceso',
    className: 'process',
    defaultText: 'Proceso',
    description: 'Actividad o tarea del proceso'
  },
  DECISION: {
    id: 'decision',
    label: 'Decisión',
    className: 'decision',
    defaultText: '¿Decisión?',
    description: 'Punto de decisión con múltiples salidas'
  },
  INPUT_OUTPUT: {
    id: 'input-output',
    label: 'Entrada/Salida',
    className: 'entity-administrativo', // Using existing style for input/output
    defaultText: 'Entrada/Salida',
    description: 'Entrada o salida de datos'
  },
  CONNECTOR: {
    id: 'connector',
    label: 'Conector',
    className: 'entity-tecnico', // Using existing style for connectors
    defaultText: 'Conector',
    description: 'Conector entre procesos'
  }
};

// Function to get all available node types - makes it easy to extend
export const getAvailableNodeTypes = () => {
  return Object.values(NODE_TYPES);
};

// Function to get a specific node type by ID
export const getNodeTypeById = (id) => {
  return Object.values(NODE_TYPES).find(type => type.id === id);
};