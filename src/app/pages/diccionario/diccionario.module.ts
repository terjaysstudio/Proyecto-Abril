import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DiccionarioPageRoutingModule } from './diccionario-routing.module';

import { DiccionarioPage } from './diccionario.page';
import { HeaderAppComponent } from '../../components/header-app/header-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DiccionarioPageRoutingModule,
    HeaderAppComponent
  ],
  declarations: [DiccionarioPage]
})
export class DiccionarioPageModule {}
