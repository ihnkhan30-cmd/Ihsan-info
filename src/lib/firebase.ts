import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  getDocs,
  onSnapshot, 
  collection, 
  addDoc, 
  serverTimestamp,
  Firestore,
  query,
  orderBy
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { PortfolioDatabase, FirebaseUploadedFile } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with the provisioned named database
export const db: Firestore = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Initialize Auth
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Document reference for portfolio main content
const PORTFOLIO_DOC_REF = doc(db, 'portfolio', 'main');
const UPLOADED_FILES_COL = collection(db, 'uploaded_files');

/**
 * Compress image before storing in Firestore to respect Firestore document size limit (<1MB)
 */
export async function compressImageForFirestore(
  dataUrl: string,
  maxWidth = 1000,
  maxHeight = 1000,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    // If not an image dataUrl, return as is
    if (!dataUrl.startsWith('data:image/')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      // Prefer webp or jpeg for smaller size
      const mime = dataUrl.includes('image/png') ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(mime, quality);
      resolve(compressedDataUrl);
    };

    img.onerror = () => {
      resolve(dataUrl);
    };

    img.src = dataUrl;
  });
}

/**
 * Save an uploaded file record into Firebase Firestore
 */
export async function saveUploadedFileToFirestore(params: {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  category?: 'avatar' | 'media' | 'document' | 'general';
  description?: string;
}): Promise<FirebaseUploadedFile> {
  try {
    // Compress if it is an image to ensure it easily fits in Firestore
    let finalDataUrl = params.dataUrl;
    if (params.type.startsWith('image/')) {
      try {
        finalDataUrl = await compressImageForFirestore(params.dataUrl);
      } catch (err) {
        console.warn('Image compression skipped, using original:', err);
      }
    }

    const fileDocData = {
      name: params.name,
      type: params.type,
      size: params.size,
      dataUrl: finalDataUrl,
      category: params.category || 'general',
      description: params.description || '',
      uploadedAt: new Date().toISOString(),
      createdAt: serverTimestamp(),
      storageProvider: 'firebase-firestore',
    };

    const docRef = await addDoc(UPLOADED_FILES_COL, fileDocData);
    
    return {
      id: docRef.id,
      name: params.name,
      type: params.type,
      size: params.size,
      dataUrl: finalDataUrl,
      category: params.category || 'general',
      uploadedAt: fileDocData.uploadedAt,
      description: params.description,
    };
  } catch (error) {
    console.error('Error saving uploaded file to Firestore:', error);
    throw error;
  }
}

/**
 * Real-time subscription to uploaded files from Firebase Firestore
 */
export function subscribeToUploadedFiles(
  onData: (files: FirebaseUploadedFile[]) => void,
  onError?: (err: Error) => void
) {
  try {
    const q = query(UPLOADED_FILES_COL);
    return onSnapshot(
      q,
      (snapshot) => {
        const files: FirebaseUploadedFile[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data();
          files.push({
            id: docSnap.id,
            name: item.name || 'Untitled File',
            type: item.type || 'application/octet-stream',
            size: item.size || 0,
            dataUrl: item.dataUrl || '',
            category: item.category || 'general',
            uploadedAt: item.uploadedAt || new Date().toISOString(),
            description: item.description || '',
          });
        });

        // Sort latest first
        files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
        onData(files);
      },
      (error) => {
        console.warn('Subscription to uploaded files warning:', error);
        if (onError) onError(error);
      }
    );
  } catch (err: any) {
    console.warn('Could not setup uploaded files listener:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Fetch list of all uploaded files from Firebase Firestore
 */
export async function getUploadedFilesFromFirestore(): Promise<FirebaseUploadedFile[]> {
  try {
    const snapshot = await getDocs(UPLOADED_FILES_COL);
    const files: FirebaseUploadedFile[] = [];
    snapshot.forEach((docSnap) => {
      const item = docSnap.data();
      files.push({
        id: docSnap.id,
        name: item.name || 'Untitled File',
        type: item.type || 'application/octet-stream',
        size: item.size || 0,
        dataUrl: item.dataUrl || '',
        category: item.category || 'general',
        uploadedAt: item.uploadedAt || new Date().toISOString(),
        description: item.description || '',
      });
    });
    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
    return files;
  } catch (error) {
    console.warn('Error fetching uploaded files from Firestore:', error);
    return [];
  }
}

/**
 * Delete an uploaded file from Firebase Firestore
 */
export async function deleteUploadedFileFromFirestore(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, 'uploaded_files', id));
    return true;
  } catch (error) {
    console.error('Error deleting file from Firestore:', error);
    return false;
  }
}

/**
 * Listen to real-time updates from Firestore
 */
export function subscribeToPortfolioDoc(
  onData: (data: PortfolioDatabase) => void,
  onError?: (error: Error) => void
) {
  return onSnapshot(
    PORTFOLIO_DOC_REF,
    (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as PortfolioDatabase;
        onData(remoteData);
      }
    },
    (err) => {
      console.warn('Firestore subscription warning:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Fetch portfolio from Firestore once
 */
export async function getPortfolioDoc(): Promise<PortfolioDatabase | null> {
  try {
    const snapshot = await getDoc(PORTFOLIO_DOC_REF);
    if (snapshot.exists()) {
      return snapshot.data() as PortfolioDatabase;
    }
    return null;
  } catch (error) {
    console.warn('Error fetching portfolio from Firestore:', error);
    return null;
  }
}

/**
 * Save portfolio to Firestore
 */
export async function savePortfolioDoc(data: Partial<PortfolioDatabase>): Promise<boolean> {
  try {
    await setDoc(PORTFOLIO_DOC_REF, data, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving portfolio to Firestore:', error);
    return false;
  }
}

/**
 * Save contact message to Firestore
 */
export async function saveContactMessage(msg: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  try {
    const contactsCol = collection(db, 'contacts');
    await addDoc(contactsCol, {
      ...msg,
      createdAt: serverTimestamp(),
      platform: 'web',
    });
    return true;
  } catch (error) {
    console.error('Error saving contact message to Firestore:', error);
    return false;
  }
}

/**
 * Sign in with Google Popup
 */
export async function signInAdminWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  }
}

/**
 * Log out from Firebase Auth
 */
export async function logoutFirebaseAuth(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Subscribe to Auth State
 */
export function onAdminAuthStateChanged(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export { app };
