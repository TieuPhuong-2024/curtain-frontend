'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  db,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut,
  onAuthStateChanged
} from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

// Create context
const AuthContext = createContext();

// Export the useAuth hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to fetch user role from Firestore
  const fetchUserRole = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setUserRole(userDoc.data().role || 'user');
        return userDoc.data().role || 'user';
      } else {
        // If user document doesn't exist, create one with default role 'user'
        try {
          await setDoc(userDocRef, { role: 'user' });
          setUserRole('user');
          return 'user';
        } catch (error) {
          console.error("Error creating user document:", error);
          // If we can't write to Firestore, still set the role locally
          setUserRole('user');
          return 'user';
        }
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      // Default to 'user' on error and don't fail
      setUserRole('user');
      return 'user';
    }
  };

  // Setup auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const role = await fetchUserRole(authUser.uid);
        setUserRole(role);
        // Luôn cập nhật cookie khi đăng nhập
        document.cookie = `user-role=${role}; path=/`;
      } else {
        setUser(null);
        setUserRole(null);
        // Xóa cookie khi logout hoặc hết phiên
        document.cookie = 'user-role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      try {
        const role = await fetchUserRole(userCredential.user.uid);

        // Set user-role cookie
        document.cookie = `user-role=${role}; path=/`;
        // Redirect based on role
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      } catch (roleError) {
        console.error("Error fetching role:", roleError);
        // Set user-role cookie mặc định là user nếu không lấy được role
        document.cookie = `user-role=user; path=/`;
        // Continue with login even if role fetch fails
        router.push('/');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Register with email and password
  const register = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save user info in Firestore with default role
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email,
          displayName,
          role: 'user',
          createdAt: new Date().toISOString()
        });

        setUserRole('user');
      } catch (docError) {
        console.error("Error creating user document:", docError);
        // Continue even if document creation fails
        setUserRole('user');
      }

      router.push('/');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;

      // Check if user exists in Firestore
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          // First time login, create a user document
          try {
            await setDoc(userDocRef, {
              email: result.user.email,
              displayName: result.user.displayName,
              role: 'user',
              createdAt: new Date().toISOString()
            });
            setUserRole('user');
          } catch (writeError) {
            console.error("Error creating user document:", writeError);
            // Continue even if document creation fails
            setUserRole('user');
          }
          // Set user-role cookie
          document.cookie = `user-role=user; path=/`;
          router.push('/');
        } else {
          // Existing user
          const role = userDoc.data().role;
          setUserRole(role);
          // Set user-role cookie
          document.cookie = `user-role=${role}; path=/`;
          if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/');
          }
        }
      } catch (firestoreError) {
        console.error("Error accessing Firestore:", firestoreError);
        // Set default role and redirect even if Firestore access fails
        setUserRole('user');
        // Set user-role cookie mặc định là user nếu không lấy được role
        document.cookie = `user-role=user; path=/`;
        router.push('/');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      // Xóa cookie user-role
      document.cookie = 'user-role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      router.push('/login');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    loginWithGoogle,

    logout,
    isAdmin: userRole === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 