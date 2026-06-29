import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LeccionPageRoutingModule } from './leccion-routing.module';
import { LeccionPage } from './leccion.page';
import { HeaderAppComponent } from '../../components/header-app/header-app.component';
import { TarjetaSeniaComponent } from '../../components/tarjeta-senia/tarjeta-senia.component';
import { BotonOpcionComponent } from '../../components/boton-opcion/boton-opcion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LeccionPageRoutingModule,
    HeaderAppComponent,
    TarjetaSeniaComponent,
    BotonOpcionComponent
  ],
  declarations: [LeccionPage]
})
export class LeccionPageModule {}
