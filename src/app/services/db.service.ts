import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private firestore: Firestore) {}

  async guardarPuntaje(nombre: string, puntos: number) {
    try {
      const docRef = doc(this.firestore, 'usuarios', nombre);
      await setDoc(docRef, { puntajeTotal: puntos }, { merge: true });
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
        return docSnap.data()['puntajeTotal'] || 0;
      }
    } catch (error) {
      console.error('Error leyendo de Firebase', error);
    }
    return 0;
  }

  async obtenerSenias(): Promise<{ letra: string; imagenUrl: string }[]> {
    try {
      const colRef = collection(this.firestore, 'senias');
      const q = query(colRef, orderBy('letra'));
      const querySnapshot = await getDocs(q);
      
      const list = querySnapshot.docs.map(doc => doc.data() as { letra: string; imagenUrl: string });
      
      // Si por alguna razón la colección está vacía o incompleta, usamos fallback local
      if (list.length < 26) {
        console.warn('Colección de señas en Firestore vacía o incompleta. Usando fallback local.');
        return this.obtenerSeniasLocalFallback();
      }
      
      return list;
    } catch (error) {
      console.error('Error al obtener señas de Firestore, usando fallback local:', error);
      return this.obtenerSeniasLocalFallback();
    }
  }

  private obtenerSeniasLocalFallback(): { letra: string; imagenUrl: string }[] {
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letra => ({
      letra,
      imagenUrl: `assets/images/${letra}.png`
    }));
  }
}
