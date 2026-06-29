import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private firestore: Firestore) {}

  async guardarPuntaje(nombre: string, puntos: number) {
    try {
      const docRef = doc(this.firestore, 'usuarios', nombre);
      await setDoc(docRef, { puntajeTotal: puntos });
      console.log('¡Puntaje guardado en Firebase!');
    } catch (error) {
      console.error('Error al guardar en Firebase', error);
    }
  }

  async obtenerPuntaje(nombre: string): Promise<number> {
    try {
      const docRef = doc(this.firestore, 'usuarios', nombre);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data()['puntajeTotal'];
      }
    } catch (error) {
      console.error('Error leyendo de Firebase', error);
    }
    return 0;
  }
}
