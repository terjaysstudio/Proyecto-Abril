const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBGQ4UB-iNL4xPWpecufwB41VZDwiGmFzs",
  authDomain: "signoedu-dabaf.firebaseapp.com",
  projectId: "signoedu-dabaf",
  storageBucket: "signoedu-dabaf.firebasestorage.app",
  messagingSenderId: "644892455453",
  appId: "1:644892455453:web:7a816fd4cdb829ac50ccf4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function generarOpciones(correcta, todas) {
  const opciones = [correcta];
  while (opciones.length < 4) {
    const randomLetra = todas[Math.floor(Math.random() * todas.length)];
    if (!opciones.includes(randomLetra)) {
      opciones.push(randomLetra);
    }
  }
  // Mezclar opciones
  const newArray = [...opciones];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

async function updateQuizData() {
  console.log('Iniciando actualización de opciones y respuestas del quiz en Firestore...');
  for (const letra of abecedario) {
    const opciones = generarOpciones(letra, abecedario);
    try {
      const docRef = doc(db, 'senias', letra);
      await setDoc(docRef, {
        opciones: opciones,
        respuestaCorrecta: letra,
        tipo: 'Adivina la señal'
      }, { merge: true });
      console.log(`¡Preguntas y respuestas para seña ${letra} actualizadas con éxito!`);
    } catch (error) {
      console.error(`Error al actualizar la seña ${letra}:`, error);
    }
  }
  console.log('Proceso de actualización finalizado.');
  process.exit(0);
}

updateQuizData();
