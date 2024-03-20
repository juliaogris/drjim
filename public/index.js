import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js'
import {
  AuthErrorCodes,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js'
import {
  connectStorageEmulator,
  getStorage,
  ref,
  uploadString
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js'

import {
  connectFirestoreEmulator,
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js'

const provider = new GoogleAuthProvider()
const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDxruYgyEFrUsC0Q4XCiYpX9HaDonL-Pos',
  authDomain: 'drjim-eaf50.firebaseapp.com',
  projectId: 'drjim-eaf50',
  storageBucket: 'drjim-eaf50.appspot.com',
  messagingSenderId: '457495512018',
  appId: '1:457495512018:web:95e5231d1dc21940c03e0b'
})

function showLoginScreen() {
  loginScreen.style.display = 'block'
  appScreen.style.display = 'none'
}

let currentUser = null
function showApp(user) {
  currentUser = user
  showUser(user)
  hideError()
  loginScreen.style.display = 'none'
  appScreen.style.display = 'block'
}

function hideError() {
  errorPanel.style.display = 'none'
  errorPanel.innerHTML = ''
}

function showError(error) {
  errorPanel.style.display = 'block'
  if (error.code == AuthErrorCodes.INVALID_PASSWORD) {
    errorPanel.innerHTML = `Wrong password. Try again.`
  } else {
    errorPanel.innerHTML = `Error: ${error.message}`
  }
}

async function showUser(user) {
  const token = await user.getIdToken()
  const msg = [
    "You're logged in as",
    `email: ${user.email}`,
    `uid: ${user.uid}`,
    `idToken: ${token}`
  ]
  authState.innerHTML = msg.join('<br>')
}

async function loginEmailPassword() {
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value)
  } catch (error) {
    console.log(`There was an error: ${error}`)
    showError(error)
  }
}

async function createAccount() {
  try {
    await createUserWithEmailAndPassword(auth, email.value, password.value)
  } catch (error) {
    console.log(`There was an error: ${error}`)
    showError(error)
  }
}

async function loginGoogle() {
  try {
    await signInWithPopup(auth, provider)
  } catch (error) {
    console.log(`There was an error: ${error}`)
    showError(error)
  }
}

async function logout() {
  currentUser = null
  await signOut(auth)
}

async function uploadToStorage() {
  const storage = getStorage(firebaseApp)
  const storageRef = ref(storage, `user/${currentUser.uid}/test.txt`)
  const now = new Date().toISOString()
  const content = `🛢️ Hello, Storage World! by ${currentUser.email} at ${now}`
  await uploadString(storageRef, content)
  alert(`Uploaded "${content}" to Storage`)
}

async function uploadToFirestore() {
  const db = getFirestore(firebaseApp)
  const now = new Date().toISOString()
  const content = `🔥 Hello, Firestore World! by ${currentUser.email} at ${now}`
  await setDoc(doc(db, 'users', currentUser.uid), { content })
  alert(`Uploaded "${content}" to Firestore`)
}

// login screen buttons
loginButton.addEventListener('click', loginEmailPassword)
loginGoogleButton.addEventListener('click', loginGoogle)
signupButton.addEventListener('click', createAccount)

// app screen buttons
logoutButton.addEventListener('click', logout)
uploadStorageButton.addEventListener('click', uploadToStorage)
uploadFirestoreButton.addEventListener('click', uploadToFirestore)

const auth = getAuth(firebaseApp)
if (location.host.startsWith('localhost') || location.host.startsWith('127.0.0.1')) {
  console.log('connecting to emulators')
  const storage = getStorage(firebaseApp)
  const db = getFirestore(firebaseApp)
  connectAuthEmulator(auth, 'http://localhost:9001')
  connectStorageEmulator(storage, '127.0.0.1', 9002)
  connectFirestoreEmulator(db, '127.0.0.1', 9003)
}

onAuthStateChanged(auth, (user) => {
  user ? showApp(user) : showLoginScreen()
})
