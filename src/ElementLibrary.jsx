import React from 'react';
import { getAvailableNodeTypes } from './nodeTypes';

const ElementLibrary = ({ onElementDragStart }) => {
  const nodeTypes = getAvailableNodeTypes();

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('application/json', JSON.stringify(nodeType));
    e.dataTransfer.effectAllowed = 'copy';
    if (onElementDragStart) {
      onElementDragStart(nodeType);
    }
  };

  return (
    <div className="sidebar">
      <h3>Biblioteca de Elementos</h3>
      <div className="node-palette">
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType.id}
            className="palette-item"
            draggable
            onDragStart={(e) => handleDragStart(e, nodeType)}
            title={nodeType.description}
          >
            {nodeType.label}
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Instrucciones</h3>
        <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.4' }}>
          <p>Arrastra los elementos desde esta biblioteca al área de trabajo para crear tu diagrama de flujo.</p>
          <p style={{ marginTop: '1rem' }}>Haz clic en los elementos del canvas para editarlos.</p>
        </div>
      </div>
    </div>
  );
};

export default ElementLibrary;