import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AdminPanel from "./components/AdminPanel";
import ListaDiagrams from "./ListaDiagrams";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <AdminPanel />
        <div className="main-content">
          <ListaDiagrams />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;