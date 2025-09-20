import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

function ListaDiagrams() {
  const [diagrams, setDiagrams] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const col = collection(db, "diagrams");
      const snapshot = await getDocs(col);
      setDiagrams(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
    }
    fetchData();
  }, []);

  return (
    <div className="diagrams-container">
      <h2>Diagrams en Firestore</h2>
      <ul>
        {diagrams.map(d => (
          <li key={d.id}>
            <b>ID:</b> {d.id} <br/>
            <b>Nodos:</b> {JSON.stringify(d.nodes)} <br/>
            <b>Conexiones:</b> {JSON.stringify(d.connections)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaDiagrams;