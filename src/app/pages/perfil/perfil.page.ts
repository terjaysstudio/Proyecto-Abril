import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: false
})
export class PerfilPage implements OnInit {
  nombre: string = '';
  puntajeFirebase: number = 0;

  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private dbService: DbService
  ) { }

  async ngOnInit() {
    this.nombre = this.authService.obtenerNombre();
    
    if (this.nombre !== '') {
      this.puntajeFirebase = await this.dbService.obtenerPuntaje(this.nombre);
    }
  }

  volver() {
    this.navCtrl.navigateBack('/home');
  }
}
