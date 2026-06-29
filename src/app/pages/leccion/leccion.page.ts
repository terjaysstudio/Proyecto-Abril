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
  senias: Senia[] = [
    { id: 1, imagenUrl: 'assets/letra_a.png', opciones: ['A', 'E', 'I', 'O'], respuestaCorrecta: 'A' },
    { id: 2, imagenUrl: 'assets/letra_b.png', opciones: ['C', 'B', 'D', 'F'], respuestaCorrecta: 'B' },
    { id: 3, imagenUrl: 'assets/letra_c.png', opciones: ['O', 'Q', 'C', 'G'], respuestaCorrecta: 'C' }
  ];

  seniaActual!: Senia;
  indiceActual: number = 0;
  puntos: number = 0;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private dbService: DbService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.seniaActual = this.senias[this.indiceActual];
  }

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
