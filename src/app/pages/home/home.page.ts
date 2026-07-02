import { Component } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController
  ) {}

  irLeccion() {
    this.navCtrl.navigateForward('/leccion');
  }

  irPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  irDiccionario() {
    this.navCtrl.navigateForward('/diccionario');
  }

  async salir() {
    const alert = await this.alertCtrl.create({
      header: 'Salir',
      message: '¿Estás seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Sí', 
          handler: () => {
            this.navCtrl.navigateRoot('/login');
          }
        }
      ]
    });
    await alert.present();
  }
}
