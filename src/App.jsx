import React, { useState, useCallback } from "react";
import ListaDiagrams from "./ListaDiagrams";
import Chat from "./Chat";
import UserAuth from "./UserAuth";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const currentDiagramId = "demo-diagram-123"; // For demo purposes

  const handleUserChange = useCallback((user) => {
    setCurrentUser(user);
  }, []);

  const toggleChat = useCallback(() => {
    setIsChatOpen(prev => !prev);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Flowchart Colaborativo</h1>
        <UserAuth onUserChange={handleUserChange} />
      </header>

      <main className="app-main">
        <ListaDiagrams />
        
        {currentUser && (
          <>
            {!isChatOpen && (
              <button 
                className="chat-toggle-btn"
                onClick={toggleChat}
                title="Abrir chat colaborativo"
              >
                💬
              </button>
            )}
            
            <Chat 
              diagramId={currentDiagramId}
              currentUser={currentUser}
              isOpen={isChatOpen}
              onToggle={toggleChat}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default App;