import firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyA9GTA1t9X86WCNaBx1hQqJvoBnztOjmjA',
  authDomain: 'docs-e1fe8.firebaseapp.com',
  projectId: 'docs-e1fe8',
  storageBucket: 'docs-e1fe8.appspot.com',
  messagingSenderId: '267102246092',
  appId: '1:267102246092:web:c46235d27f46ae59b2de69',
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();

export { db };
