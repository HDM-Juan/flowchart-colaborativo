import React, { useState } from "react";
import ListaDiagrams from "./ListaDiagrams";
import Chat from "./Chat";

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Tu código principal */}
      <ListaDiagrams />
      
      {/* Floating Chat Toggle Button */}
      {!isChatOpen && (
        <button 
          className="chat-float-toggle" 
          onClick={toggleChat}
          title="Abrir Chat"
        >
          💬
        </button>
      )}
      
      {/* Chat Panel */}
      <Chat 
        isOpen={isChatOpen} 
        onToggle={toggleChat}
        sessionId="main-session"
      />
    </div>
  );
}

export default App;