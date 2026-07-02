import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-diccionario',
  templateUrl: './diccionario.page.html',
  styleUrls: ['./diccionario.page.scss'],
  standalone: false
})
export class DiccionarioPage implements OnInit {

  letras: { letra: string; imagenUrl: string }[] = [];

  constructor() { }

  ngOnInit() {
    const abecedario = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.letras = abecedario.map(letra => ({
      letra,
      imagenUrl: `assets/images/${letra}.png`
    }));
  }

}
