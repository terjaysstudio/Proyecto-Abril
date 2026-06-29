import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  nombreUsuario: string = '';

  constructor(private firestore: Firestore) { }

  async guardarNombre(nombre: string) {
    this.nombreUsuario = nombre;
    try {
      const docRef = doc(this.firestore, 'accesos', nombre);
      await setDoc(docRef, { ultimoAcceso: new Date().toISOString() });
      console.log('Acceso registrado en Firebase');
    } catch (error) {
      console.error('Error al registrar acceso en Firebase', error);
    }
  }

  obtenerNombre() {
    return this.nombreUsuario;
  }
}
