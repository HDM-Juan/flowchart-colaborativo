import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { db, storage } from './firebaseConfig';

const Chat = ({ diagramId, currentUser, isOpen, onToggle }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Real-time message listener - simplified to avoid infinite loops
  useEffect(() => {
    if (!diagramId || !isOpen) return;

    const messagesRef = collection(db, `diagrams/${diagramId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [diagramId, isOpen]);

  // Handle file upload
  const handleFileUpload = async (file) => {
    if (!file || !diagramId) return null;

    try {
      const fileRef = ref(storage, `chat-attachments/${diagramId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        url: downloadURL,
        name: file.name,
        type: file.type,
        size: file.size
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  // Send message
  const sendMessage = async () => {
    if ((!newMessage.trim() && !attachmentFile) || !currentUser || !diagramId) return;

    setIsLoading(true);
    try {
      let attachment = null;
      if (attachmentFile) {
        attachment = await handleFileUpload(attachmentFile);
      }

      const messageData = {
        text: newMessage.trim(),
        userId: currentUser.uid,
        userEmail: currentUser.email || 'Usuario Anónimo',
        timestamp: serverTimestamp(),
        attachment
      };

      await addDoc(collection(db, `diagrams/${diagramId}/messages`), messageData);
      
      setNewMessage('');
      setAttachmentFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Render attachment
  const renderAttachment = (attachment) => {
    if (!attachment) return null;

    const isImage = attachment.type?.startsWith('image/');
    
    return (
      <div className="message-attachment">
        {isImage ? (
          <img 
            src={attachment.url} 
            alt={attachment.name}
            className="attachment-image"
            onClick={() => window.open(attachment.url, '_blank')}
          />
        ) : (
          <a 
            href={attachment.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="attachment-file"
          >
            <span className="attachment-icon">📎</span>
            <div className="attachment-info">
              <div className="attachment-name">{attachment.name}</div>
              <div className="attachment-size">{formatFileSize(attachment.size)}</div>
            </div>
          </a>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat Colaborativo</h3>
        <button onClick={onToggle} className="chat-close-btn">×</button>
      </div>
      
      <div className="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.userId === currentUser?.uid ? 'own-message' : 'other-message'}`}
          >
            <div className="message-header">
              <span className="message-user">{message.userEmail}</span>
              <span className="message-time">
                {message.timestamp?.toDate ? message.timestamp.toDate().toLocaleTimeString() : 'Enviando...'}
              </span>
            </div>
            {message.text && <div className="message-text">{message.text}</div>}
            {renderAttachment(message.attachment)}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        {attachmentFile && (
          <div className="attachment-preview">
            <span>{attachmentFile.name}</span>
            <button onClick={() => setAttachmentFile(null)}>×</button>
          </div>
        )}
        
        <div className="chat-input-row">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setAttachmentFile(e.target.files[0])}
            style={{ display: 'none' }}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="attachment-btn"
            title="Adjuntar archivo"
          >
            📎
          </button>
          
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje..."
            className="chat-input"
            rows="1"
            disabled={isLoading}
          />
          
          <button 
            onClick={sendMessage}
            disabled={isLoading || (!newMessage.trim() && !attachmentFile)}
            className="send-btn"
          >
            {isLoading ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;