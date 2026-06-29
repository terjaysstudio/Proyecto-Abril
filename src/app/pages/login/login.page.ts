import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  nombre: string = '';
  mostrarIntro: boolean = true; // Por defecto mostramos la intro

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  comenzarLogin() {
    this.mostrarIntro = false;
  }

  async entrar() {
    if (this.nombre.trim() !== '') {
      // Mostrar toast y navegar inmediatamente para dar feedback al usuario
      const toast = await this.toastController.create({
        message: `¡Bienvenido/a ${this.nombre}! Tu acceso ha sido registrado.`,
        duration: 2500,
        position: 'top',
        color: 'primary'
      });
      await toast.present();

      // Ejecutar en background para no bloquear si Firebase está lento
      this.authService.guardarNombre(this.nombre);

      this.navCtrl.navigateForward('/home');
    }
  }
}
