import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Senia } from '../../interfaces/models';
import { DbService } from '../../services/db.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-leccion',
  templateUrl: './leccion.page.html',
  styleUrls: ['./leccion.page.scss'],
  standalone: false
})
export class LeccionPage implements OnInit {
  senias: Senia[] = [];

  ngOnInit() {
    this.generarLeccion();
    this.seniaActual = this.senias[this.indiceActual];
  }

  generarLeccion() {
    const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    // Seleccionamos 10 letras al azar para la lección
    const letrasSeleccionadas = this.shuffleArray([...abecedario]).slice(0, 10);
    
    this.senias = letrasSeleccionadas.map((letra, index) => {
      return {
        id: index + 1,
        imagenUrl: `assets/images/${letra}.png`,
        opciones: this.generarOpciones(letra, abecedario),
        respuestaCorrecta: letra
      };
    });
  }

  generarOpciones(correcta: string, todas: string[]): string[] {
    const opciones = [correcta];
    while (opciones.length < 4) {
      const randomLetra = todas[Math.floor(Math.random() * todas.length)];
      if (!opciones.includes(randomLetra)) {
        opciones.push(randomLetra);
      }
    }
    return this.shuffleArray(opciones);
  }

  shuffleArray(array: any[]): any[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  seniaActual!: Senia;
  indiceActual: number = 0;
  puntos: number = 0;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private dbService: DbService,
    private authService: AuthService
  ) { }



  async revisarRespuesta(opcion: string) {
    if (opcion === this.seniaActual.respuestaCorrecta) {
      this.puntos = this.puntos + 10;
      await this.mostrarToast('¡Correcto!', 'success');
    } else {
      await this.mostrarToast('Incorrecto', 'danger');
    }

    this.indiceActual++;

    if (this.indiceActual < this.senias.length) {
      this.seniaActual = this.senias[this.indiceActual];
    } else {
      const nombre = this.authService.obtenerNombre();
      this.dbService.guardarPuntaje(nombre, this.puntos);
      this.navCtrl.navigateForward(['/resultados', { puntaje: this.puntos }]);
    }
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 1500,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
