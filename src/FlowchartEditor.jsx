import React, { useState, useEffect, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const POST_IT_COLORS = [
  '#FFE066', // Yellow
  '#FFB3D9', // Pink  
  '#B3D9FF', // Blue
  '#B3FFB3', // Green
  '#FFD9B3'  // Orange
];

const FlowchartEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [postIts, setPostIts] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingPostIt, setEditingPostIt] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Mock diagram ID for now - in a real app this would come from routing/props
  const diagramId = 'demo-diagram';

  // Save post-its to Firebase with error handling
  const savePostIts = useCallback(async (newPostIts) => {
    try {
      const docRef = doc(db, 'diagrams', diagramId);
      await setDoc(docRef, { 
        postIts: newPostIts,
        nodes: nodes,
        connections: [],
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsConnected(true);
    } catch (error) {
      console.warn('Firebase save failed, working offline:', error.message);
      setIsConnected(false);
    }
  }, [nodes, diagramId]);

  // Load data from Firebase with fallback to local state
  useEffect(() => {
    const docRef = doc(db, 'diagrams', diagramId);
    
    const unsubscribe = onSnapshot(docRef, 
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setNodes(data.nodes || []);
          setPostIts(data.postIts || []);
          setIsConnected(true);
        }
      },
      (error) => {
        console.warn('Firebase connection failed, working offline:', error.message);
        setIsConnected(false);
      }
    );

    return () => unsubscribe();
  }, [diagramId]);

  // Create new post-it
  const createPostIt = (x = 100, y = 100) => {
    const randomColor = POST_IT_COLORS[Math.floor(Math.random() * POST_IT_COLORS.length)];
    const newPostIt = {
      id: Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9),
      x,
      y,
      text: 'Nuevo post-it',
      color: randomColor,
      createdAt: new Date().toISOString()
    };
    
    const newPostIts = [...postIts, newPostIt];
    setPostIts(newPostIts);
    savePostIts(newPostIts);
  };

  // Handle drag start
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ ...item, type });
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drag over canvas
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle drop on canvas
  const handleDrop = (e) => {
    e.preventDefault();
    if (!draggedItem) return;

    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedItem.type === 'new-postit') {
      createPostIt(x - 50, y - 25); // Center the post-it on cursor
    } else if (draggedItem.type === 'postit') {
      // Move existing post-it
      const newPostIts = postIts.map(p => 
        p.id === draggedItem.id ? { ...p, x: x - 50, y: y - 25 } : p
      );
      setPostIts(newPostIts);
      savePostIts(newPostIts);
    }

    setDraggedItem(null);
  };

  // Handle post-it text edit
  const handlePostItEdit = (id, newText) => {
    const newPostIts = postIts.map(p => 
      p.id === id ? { ...p, text: newText, updatedAt: new Date().toISOString() } : p
    );
    setPostIts(newPostIts);
    savePostIts(newPostIts);
    setEditingPostIt(null);
  };

  // Handle post-it delete
  const deletePostIt = (id) => {
    const newPostIts = postIts.filter(p => p.id !== id);
    setPostIts(newPostIts);
    savePostIts(newPostIts);
  };

  // Handle key press for editing
  const handleKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      handlePostItEdit(id, e.target.value);
    } else if (e.key === 'Escape') {
      setEditingPostIt(null);
    }
  };

  return (
    <div className="main-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h3>Elementos</h3>
        <div className="node-palette">
          <div 
            className="palette-item"
            draggable
            onDragStart={(e) => handleDragStart(e, {}, 'new-postit')}
            title="Arrastra para crear un post-it"
          >
            📝 Post-it
          </div>
          <div className="palette-item">
            ⬜ Proceso
          </div>
          <div className="palette-item">
            🔶 Decisión
          </div>
          <div className="palette-item">
            🟢 Inicio/Fin
          </div>
        </div>
        
        {/* Connection status */}
        <div className="connection-status" style={{ 
          marginTop: '1rem', 
          padding: '0.5rem', 
          borderRadius: '4px',
          backgroundColor: isConnected ? 'rgba(76, 175, 80, 0.2)' : 'rgba(255, 152, 0, 0.2)',
          color: 'white',
          fontSize: '0.8rem',
          textAlign: 'center'
        }}>
          {isConnected ? '🟢 Conectado' : '🟡 Modo offline'}
        </div>
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <div 
          className="canvas"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Render post-its */}
          {postIts.map((postIt, index) => (
            <div
              key={postIt.id}
              className={`post-it post-it-${index % 3}`} // Add rotation classes
              style={{
                left: postIt.x,
                top: postIt.y,
                backgroundColor: postIt.color
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, postIt, 'postit')}
              onDoubleClick={() => setEditingPostIt(postIt.id)}
              onContextMenu={(e) => {
                e.preventDefault();
                deletePostIt(postIt.id);
              }}
              title="Doble click para editar, clic derecho para eliminar"
            >
              {editingPostIt === postIt.id ? (
                <textarea
                  className="post-it-input"
                  defaultValue={postIt.text}
                  autoFocus
                  onBlur={(e) => handlePostItEdit(postIt.id, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, postIt.id)}
                />
              ) : (
                <span>{postIt.text}</span>
              )}
            </div>
          ))}

          {/* Existing flowchart nodes would be rendered here */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`flowchart-node ${node.type || 'process'}`}
              style={{
                left: node.x,
                top: node.y
              }}
            >
              {node.text}
            </div>
          ))}

          {/* Canvas instructions */}
          {postIts.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255, 255, 255, 0.5)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <p>📝 Arrastra un post-it desde la barra lateral</p>
              <p>para empezar a crear notas</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditor;