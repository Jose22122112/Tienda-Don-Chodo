// Importar Firebase
const firebase = require("firebase/app");
require("firebase/auth");

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  projectId: "TU_PROJECT_ID",
  appId: "TU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener elementos del DOM
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const googleLoginButton = document.getElementById('googleLogin');
const signupButton = document.getElementById('signupButton');

// Manejar el inicio de sesión con correo electrónico y contraseña
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = emailInput.value;
  const password = passwordInput.value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Inicio de sesión exitoso
      const user = userCredential.user;
      console.log("Usuario ha iniciado sesión:", user);
      // Aquí puedes redirigir al usuario o actualizar la UI
    })
    .catch((error) => {
      console.error("Error de inicio de sesión:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    });
});

// Manejar el inicio de sesión con Google
googleLoginButton.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      console.log("Usuario ha iniciado sesión con Google:", user);
      // Aquí puedes redirigir al usuario o actualizar la UI
    })
    .catch((error) => {
      console.error("Error de inicio de sesión con Google:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    });
});

// Manejar el registro de nuevos usuarios
signupButton.addEventListener('click', () => {
  const email = emailInput.value;
  const password = passwordInput.value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Registro exitoso
      const user = userCredential.user;
      console.log("Nuevo usuario registrado:", user);
      // Aquí puedes redirigir al usuario o actualizar la UI
    })
    .catch((error) => {
      console.error("Error de registro:", error);
      // Aquí puedes mostrar un mensaje de error al usuario
    });
});

// Observador de estado de autenticación
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // El usuario está conectado
    console.log("Usuario está conectado:", user);
    // Aquí puedes actualizar la UI para un usuario conectado
  } else {
    // El usuario está desconectado
    console.log("Usuario está desconectado");
    // Aquí puedes actualizar la UI para un usuario desconectado
  }
});
