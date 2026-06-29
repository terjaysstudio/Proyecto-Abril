import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-app',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar color="primary" style="--border-width: 0; border-bottom-left-radius: 25px; border-bottom-right-radius: 25px;">
        <ion-buttons slot="start" *ngIf="mostrarBotonAtras">
          <ion-button (click)="alVolver()">
            <ion-icon name="arrow-back-outline" style="color: white; font-size: 1.5rem;"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title style="font-weight: bold; text-align: center; color: white;">{{ titulo }}</ion-title>
        <ion-buttons slot="end" *ngIf="mostrarBotonAtras">
          <ion-button style="visibility: hidden"><ion-icon name="arrow-back-outline"></ion-icon></ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
  `,
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class HeaderAppComponent {
  @Input() titulo: string = '';
  @Input() mostrarBotonAtras: boolean = false;
  @Output() volver = new EventEmitter<void>();

  alVolver() {
    this.volver.emit();
  }
}
