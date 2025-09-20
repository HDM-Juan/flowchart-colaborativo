import React, { useState } from "react";
import ListaDiagrams from "./ListaDiagrams";

function App() {
  const [processTitle, setProcessTitle] = useState("Nuevo proceso");
  const [isEditing, setIsEditing] = useState(false);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setProcessTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (processTitle.trim() === "") {
      setProcessTitle("Nuevo proceso");
    }
  };

  const handleTitleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      if (processTitle.trim() === "") {
        setProcessTitle("Nuevo proceso");
      }
    }
  };

  return (
    <div>
      <header className="header">
        {isEditing ? (
          <input
            type="text"
            value={processTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyPress={handleTitleKeyPress}
            className="title-input"
            autoFocus
          />
        ) : (
          <h1 onClick={handleTitleClick} className="process-title">
            {processTitle}
          </h1>
        )}
      </header>
      <div className="main-content">
        <ListaDiagrams />
      </div>
    </div>
  );
}

export default App;