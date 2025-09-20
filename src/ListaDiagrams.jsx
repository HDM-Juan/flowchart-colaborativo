import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Inicializa Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    <div>
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