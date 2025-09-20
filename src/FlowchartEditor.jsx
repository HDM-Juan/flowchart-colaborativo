import React, { useState, useEffect } from 'react';
import ElementLibrary from './ElementLibrary';
import Canvas from './Canvas';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FlowchartEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [diagramId, setDiagramId] = useState(null);

  // Load existing diagrams or create a new one
  useEffect(() => {
    loadOrCreateDiagram();
  }, []);

  const loadOrCreateDiagram = async () => {
    try {
      const col = collection(db, 'diagrams');
      const snapshot = await getDocs(col);
      
      if (!snapshot.empty) {
        // Load the first diagram found
        const firstDiagram = snapshot.docs[0];
        setDiagramId(firstDiagram.id);
        const data = firstDiagram.data();
        if (data.nodes) {
          setNodes(data.nodes);
        }
      } else {
        // Create a new diagram
        const newDiagram = {
          nodes: [],
          connections: [],
          createdAt: new Date(),
          title: 'Nuevo Diagrama'
        };
        const docRef = await addDoc(col, newDiagram);
        setDiagramId(docRef.id);
      }
    } catch (error) {
      console.error('Error loading diagrams:', error);
      // Continue without Firebase if there's an error
    }
  };

  const saveDiagram = async (updatedNodes) => {
    if (!diagramId) return;
    
    try {
      const diagramRef = doc(db, 'diagrams', diagramId);
      await updateDoc(diagramRef, {
        nodes: updatedNodes,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving diagram:', error);
    }
  };

  const handleNodeAdd = (newNode) => {
    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    saveDiagram(updatedNodes);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    const updatedNodes = nodes.map(node =>
      node.id === nodeId ? { ...node, ...updates } : node
    );
    setNodes(updatedNodes);
    saveDiagram(updatedNodes);
  };

  const handleNodeSelect = (nodeId) => {
    setSelectedNodeId(nodeId);
  };

  const handleElementDragStart = (nodeType) => {
    // Optional: could show preview or highlight drop zones
    console.log('Dragging element:', nodeType.label);
  };

  const handleClearCanvas = () => {
    if (confirm('¿Estás seguro de que quieres limpiar el canvas?')) {
      setNodes([]);
      setSelectedNodeId(null);
      saveDiagram([]);
    }
  };

  const handleExportDiagram = () => {
    const diagramData = {
      nodes,
      exportedAt: new Date().toISOString()
    };
    const dataStr = JSON.stringify(diagramData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagrama.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <ElementLibrary onElementDragStart={handleElementDragStart} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="header">
          <h1>Editor de Diagramas de Flujo Colaborativo</h1>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <button className="btn" onClick={handleClearCanvas}>
            🗑️ Limpiar Canvas
          </button>
          <button className="btn" onClick={handleExportDiagram}>
            💾 Exportar Diagrama
          </button>
          <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.7)' }}>
            Nodos: {nodes.length}
          </div>
        </div>

        {/* Canvas */}
        <Canvas
          nodes={nodes}
          onNodeAdd={handleNodeAdd}
          onNodeUpdate={handleNodeUpdate}
          onNodeSelect={handleNodeSelect}
          selectedNodeId={selectedNodeId}
        />
      </div>
    </div>
  );
};

export default FlowchartEditor;