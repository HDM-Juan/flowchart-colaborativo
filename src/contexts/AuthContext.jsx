/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { firebaseConfig } from '../firebaseConfig';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('user'); // 'admin' or 'user'
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [sessionSettings, setSessionSettings] = useState({
    chatLocked: false,
    postitsLocked: false,
    editingLocked: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Set user presence in Firestore
        const userRef = doc(db, 'sessions', 'current', 'users', firebaseUser.uid);
        await setDoc(userRef, {
          uid: firebaseUser.uid,
          name: `Usuario ${firebaseUser.uid.substring(0, 6)}`,
          role: firebaseUser.uid === 'admin_demo' ? 'admin' : 'user', // Demo: first user is admin
          lastSeen: new Date(),
          online: true
        }, { merge: true });

        setUserRole(firebaseUser.uid === 'admin_demo' ? 'admin' : 'user');
      } else {
        // Sign in anonymously if no user
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error('Error signing in anonymously:', error);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Listen to connected users
    const usersRef = collection(db, 'sessions', 'current', 'users');
    const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConnectedUsers(users);
    });

    // Listen to session settings
    const sessionRef = doc(db, 'sessions', 'current');
    const unsubscribeSession = onSnapshot(sessionRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setSessionSettings(prev => ({
          ...prev,
          ...data.settings
        }));
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeSession();
    };
  }, [user]);

  const isAdmin = () => userRole === 'admin';

  const kickUser = async (userId) => {
    if (!isAdmin()) return;
    
    try {
      const userRef = doc(db, 'sessions', 'current', 'users', userId);
      await setDoc(userRef, { online: false, kicked: true }, { merge: true });
    } catch (error) {
      console.error('Error kicking user:', error);
    }
  };

  const toggleUserEditPermission = async (userId) => {
    if (!isAdmin()) return;
    
    try {
      const user = connectedUsers.find(u => u.id === userId);
      const userRef = doc(db, 'sessions', 'current', 'users', userId);
      await setDoc(userRef, { 
        canEdit: !user.canEdit 
      }, { merge: true });
    } catch (error) {
      console.error('Error toggling edit permission:', error);
    }
  };

  const updateSessionSettings = async (settings) => {
    if (!isAdmin()) return;
    
    try {
      const sessionRef = doc(db, 'sessions', 'current');
      await setDoc(sessionRef, { 
        settings: { ...sessionSettings, ...settings }
      }, { merge: true });
    } catch (error) {
      console.error('Error updating session settings:', error);
    }
  };

  const closeSessionForAll = async () => {
    if (!isAdmin()) return;
    
    try {
      // Mark all users as kicked/disconnected
      const batch = [];
      connectedUsers.forEach(user => {
        if (user.role !== 'admin') {
          const userRef = doc(db, 'sessions', 'current', 'users', user.id);
          batch.push(setDoc(userRef, { online: false, sessionClosed: true }, { merge: true }));
        }
      });
      
      await Promise.all(batch);
    } catch (error) {
      console.error('Error closing session:', error);
    }
  };

  const value = {
    user,
    userRole,
    connectedUsers,
    sessionSettings,
    loading,
    isAdmin,
    kickUser,
    toggleUserEditPermission,
    updateSessionSettings,
    closeSessionForAll
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};