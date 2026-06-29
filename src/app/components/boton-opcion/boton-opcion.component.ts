import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-boton-opcion',
  template: `
    <ion-button expand="block" shape="round" color="secondary" fill="outline" class="ion-margin-bottom" style="height: 55px; font-size: 1.2rem; font-weight: bold; border-width: 2px;" (click)="alPresionar()">
      {{ textoOpcion }}
    </ion-button>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class BotonOpcionComponent {
  @Input() textoOpcion: string = '';
  @Output() opcionElegida = new EventEmitter<string>();

  alPresionar() {
    this.opcionElegida.emit(this.textoOpcion);
  }
}
