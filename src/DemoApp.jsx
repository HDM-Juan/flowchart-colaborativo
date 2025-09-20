import React from "react";
import { DemoAuthProvider } from "./contexts/DemoAuthContext";
import DemoAdminPanel from "./components/DemoAdminPanel";
import ListaDiagrams from "./ListaDiagrams";
import "./App.css";

function DemoApp() {
  return (
    <DemoAuthProvider>
      <div className="app-container">
        <DemoAdminPanel />
        <div className="main-content">
          <div className="demo-notice">
            <h3>🎯 Demo del Panel de Administrador</h3>
            <p>Haz clic en el botón "👑 Admin" para abrir el panel de administración</p>
          </div>
          <ListaDiagrams />
        </div>
      </div>
    </DemoAuthProvider>
  );
}

export default DemoApp;