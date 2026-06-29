import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tarjeta-senia',
  template: `
    <ion-card class="ion-margin-bottom" style="border-radius: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
      <ion-card-content class="ion-text-center">
        <img [src]="imagenUrl" alt="Seña a adivinar" style="max-height: 250px; border-radius: 12px;"/>
      </ion-card-content>
    </ion-card>
  `,
  standalone: true,
  imports: [IonicModule]
})
export class TarjetaSeniaComponent {
  @Input() imagenUrl: string = '';
}
