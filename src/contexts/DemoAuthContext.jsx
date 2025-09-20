/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';

const DemoAuthContext = createContext();

export const useDemoAuth = () => {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
};

export const DemoAuthProvider = ({ children }) => {
  const [userRole] = useState('admin'); // Demo: always admin for showcase
  const [connectedUsers, setConnectedUsers] = useState([
    {
      id: 'admin-demo',
      name: 'Administrador',
      role: 'admin',
      online: true,
      canEdit: true
    },
    {
      id: 'user-1',
      name: 'Usuario María',
      role: 'user',
      online: true,
      canEdit: true
    },
    {
      id: 'user-2',
      name: 'Usuario Carlos',
      role: 'user',
      online: true,
      canEdit: false
    },
    {
      id: 'user-3',
      name: 'Usuario Ana',
      role: 'user',
      online: true,
      canEdit: true
    }
  ]);

  const [sessionSettings, setSessionSettings] = useState({
    chatLocked: false,
    postitsLocked: false,
    editingLocked: false
  });

  const isAdmin = () => userRole === 'admin';

  const kickUser = async (userId) => {
    if (!isAdmin()) return;
    
    setConnectedUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, online: false, kicked: true }
          : user
      )
    );
    
    // Simulate user reconnecting after 3 seconds for demo
    setTimeout(() => {
      setConnectedUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, online: true, kicked: false }
            : user
        )
      );
    }, 3000);
  };

  const toggleUserEditPermission = async (userId) => {
    if (!isAdmin()) return;
    
    setConnectedUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, canEdit: !user.canEdit }
          : user
      )
    );
  };

  const updateSessionSettings = async (settings) => {
    if (!isAdmin()) return;
    
    setSessionSettings(prev => ({ ...prev, ...settings }));
  };

  const closeSessionForAll = async () => {
    if (!isAdmin()) return;
    
    setConnectedUsers(prev =>
      prev.map(user =>
        user.role !== 'admin'
          ? { ...user, online: false, sessionClosed: true }
          : user
      )
    );
    
    // Simulate users reconnecting after 5 seconds for demo
    setTimeout(() => {
      setConnectedUsers(prev =>
        prev.map(user => ({ ...user, online: true, sessionClosed: false }))
      );
    }, 5000);
  };

  const value = {
    user: { uid: 'admin-demo' },
    userRole,
    connectedUsers: connectedUsers.filter(user => user.online),
    sessionSettings,
    loading: false,
    isAdmin,
    kickUser,
    toggleUserEditPermission,
    updateSessionSettings,
    closeSessionForAll
  };

  return (
    <DemoAuthContext.Provider value={value}>
      {children}
    </DemoAuthContext.Provider>
  );
};