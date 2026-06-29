import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.page.html',
  styleUrls: ['./resultados.page.scss'],
  standalone: false
})
export class ResultadosPage implements OnInit {
  puntosObtenidos: number = 0;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastController: ToastController
  ) { }

  async ngOnInit() {
    const puntos = this.route.snapshot.paramMap.get('puntaje');
    this.puntosObtenidos = Number(puntos);
    await this.mostrarToast();
  }

  async mostrarToast() {
    const toast = await this.toastController.create({
      message: '¡Tu progreso se guardó en Firebase exitosamente! 🎉',
      duration: 3000,
      position: 'top',
      color: 'success'
    });
    await toast.present();
  }

  irAInicio() {
    this.navCtrl.navigateRoot('/home');
  }
}
