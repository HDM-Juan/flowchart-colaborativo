import React, { useState } from 'react';

const Canvas = ({ nodes, onNodeAdd, onNodeUpdate, onNodeSelect, selectedNodeId }) => {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDraggedOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);

    try {
      const nodeTypeData = JSON.parse(e.dataTransfer.getData('application/json'));
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - 60; // Center the node
      const y = e.clientY - canvasRect.top - 30;

      const newNode = {
        id: `node_${Date.now()}`,
        type: nodeTypeData.id,
        x: Math.max(0, x),
        y: Math.max(0, y),
        text: nodeTypeData.defaultText,
        className: nodeTypeData.className
      };

      onNodeAdd(newNode);
    } catch (error) {
      console.error('Error dropping node:', error);
    }
  };

  const handleNodeClick = (node) => {
    onNodeSelect(node.id);
  };

  const handleNodeDoubleClick = (node) => {
    const newText = prompt('Editar texto del nodo:', node.text);
    if (newText !== null) {
      onNodeUpdate(node.id, { text: newText });
    }
  };

  const handleNodeDrag = (nodeId, startX, startY) => {
    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        onNodeUpdate(nodeId, {
          x: Math.max(0, node.x + deltaX),
          y: Math.max(0, node.y + deltaY)
        });
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleNodeMouseDown = (e, node) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    handleNodeDrag(node.id, startX, startY);
  };

  return (
    <div className="canvas-container">
      <div
        className={`canvas ${draggedOver ? 'dragging-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {nodes.map((node) => (
          <div
            key={node.id}
            className={`flowchart-node ${node.className} ${selectedNodeId === node.id ? 'selected' : ''}`}
            style={{
              left: node.x,
              top: node.y,
            }}
            onClick={() => handleNodeClick(node)}
            onDoubleClick={() => handleNodeDoubleClick(node)}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
          >
            {node.text}
          </div>
        ))}
        
        {nodes.length === 0 && (
          <div className="canvas-placeholder" style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '1.2rem',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <div>Arrastra elementos desde la biblioteca</div>
            <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
              para comenzar a crear tu diagrama de flujo
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;