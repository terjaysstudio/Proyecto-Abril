import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, collection, query, orderBy, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  constructor(private firestore: Firestore) { }

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

  async obtenerSenias(): Promise<{ letra: string; imagenUrl: string; opciones: string[]; respuestaCorrecta: string }[]> {
    try {
      const colRef = collection(this.firestore, 'senias');
      const q = query(colRef, orderBy('letra'));
      const querySnapshot = await getDocs(q);

      const list = querySnapshot.docs.map(doc => doc.data() as { letra: string; imagenUrl: string; opciones: string[]; respuestaCorrecta: string });

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

  private obtenerSeniasLocalFallback(): { letra: string; imagenUrl: string; opciones: string[]; respuestaCorrecta: string }[] {
    const todas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return todas.map(letra => {
      const opciones = [letra];
      while (opciones.length < 4) {
        const r = todas[Math.floor(Math.random() * todas.length)];
        if (!opciones.includes(r)) opciones.push(r);
      }
      // Mezclar opciones
      for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
      }
      return { letra, imagenUrl: `assets/images/${letra}.png`, opciones, respuestaCorrecta: letra };
    });
  }
}
