import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-diccionario',
  templateUrl: './diccionario.page.html',
  styleUrls: ['./diccionario.page.scss'],
  standalone: false
})
export class DiccionarioPage implements OnInit {

  letras: { letra: string; imagenUrl: string }[] = [];

  constructor(private dbService: DbService) { }

  async ngOnInit() {
    this.letras = await this.dbService.obtenerSenias();
  }

}
