import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const FlowchartEditor = () => {
  const [nodes, setNodes] = useState([]);
  const [postIts, setPostIts] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingPostIt, setEditingPostIt] = useState(null);

  // Mock diagram ID for now - in a real app this would come from routing/props
  const diagramId = 'demo-diagram';

  // Load data from Firebase
  useEffect(() => {
    const docRef = doc(db, 'diagrams', diagramId);
    
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setNodes(data.nodes || []);
        setPostIts(data.postIts || []);
      } else {
        // Create initial document
        updateDoc(docRef, {
          nodes: [],
          postIts: [],
          connections: []
        }).catch(() => {
          // Document doesn't exist, that's ok for demo
        });
      }
    });

    return () => unsubscribe();
  }, [diagramId]);

  // Save post-its to Firebase
  const savePostIts = async (newPostIts) => {
    try {
      const docRef = doc(db, 'diagrams', diagramId);
      await updateDoc(docRef, { postIts: newPostIts });
    } catch (error) {
      console.error('Error saving post-its:', error);
    }
  };

  // Create new post-it
  const createPostIt = (x = 100, y = 100) => {
    const newPostIt = {
      id: Date.now().toString(),
      x,
      y,
      text: 'Nuevo post-it',
      color: '#FFE066' // Default yellow
    };
    
    const newPostIts = [...postIts, newPostIt];
    setPostIts(newPostIts);
    savePostIts(newPostIts);
  };

  // Handle drag start
  const handleDragStart = (e, item, type) => {
    setDraggedItem({ ...item, type });
  };

  // Handle drag over canvas
  const handleDragOver = (e) => {
    e.preventDefault();
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
      p.id === id ? { ...p, text: newText } : p
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
      </div>

      {/* Canvas */}
      <div className="canvas-container">
        <div 
          className="canvas"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {/* Render post-its */}
          {postIts.map((postIt) => (
            <div
              key={postIt.id}
              className="post-it"
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
            >
              {editingPostIt === postIt.id ? (
                <input
                  type="text"
                  defaultValue={postIt.text}
                  autoFocus
                  onBlur={(e) => handlePostItEdit(postIt.id, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, postIt.id)}
                  className="post-it-input"
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
        </div>
      </div>
    </div>
  );
};

export default FlowchartEditor;