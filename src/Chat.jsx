import React, { useState, useEffect, useRef } from 'react';
import { 
  initializeApp, 
  getApps 
} from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';

// Initialize Firebase if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

function Chat({ isOpen, onToggle, sessionId = 'default' }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isUsernameSet) return;

    const messagesRef = collection(db, `chat-${sessionId}`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [sessionId, isUsernameSet]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !username.trim()) return;

    try {
      await addDoc(collection(db, `chat-${sessionId}`), {
        text: newMessage.trim(),
        username: username.trim(),
        timestamp: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setIsUsernameSet(true);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isUsernameSet) {
    return (
      <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <h3>Chat</h3>
          <button className="chat-toggle" onClick={onToggle}>
            {isOpen ? '✕' : '💬'}
          </button>
        </div>
        {isOpen && (
          <div className="username-setup">
            <p>Ingresa tu nombre para chatear:</p>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Tu nombre..."
                maxLength={20}
                required
              />
              <button type="submit" className="btn primary">
                Entrar al Chat
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`chat-panel ${isOpen ? 'open' : ''}`}>
      <div className="chat-header">
        <h3>Chat</h3>
        <button className="chat-toggle" onClick={onToggle}>
          {isOpen ? '✕' : '💬'}
        </button>
      </div>
      
      {isOpen && (
        <>
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className="message">
                <div className="message-header">
                  <span className="username">{message.username}</span>
                  <span className="timestamp">{formatTime(message.timestamp)}</span>
                </div>
                <div className="message-text">{message.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={sendMessage} className="chat-input">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              maxLength={500}
            />
            <button type="submit" className="btn primary">
              Enviar
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default Chat;