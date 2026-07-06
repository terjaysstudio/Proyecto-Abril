const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

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
const imagesDir = path.join(__dirname, '../src/assets/images');

async function upload() {
  console.log('Iniciando subida de imágenes a Firestore...');
  for (const letra of abecedario) {
    const filePath = path.join(imagesDir, `${letra}.png`);
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      const base64 = `data:image/png;base64,${fileBuffer.toString('base64')}`;
      
      try {
        const docRef = doc(db, 'senias', letra);
        await setDoc(docRef, {
          letra: letra,
          imagenUrl: base64
        });
        console.log(`¡Seña ${letra} subida con éxito!`);
      } catch (error) {
        console.error(`Error al subir la seña ${letra}:`, error);
      }
    } else {
      console.warn(`Archivo no encontrado: ${filePath}`);
    }
  }
  console.log('Proceso de subida finalizado.');
  process.exit(0);
}

upload();
