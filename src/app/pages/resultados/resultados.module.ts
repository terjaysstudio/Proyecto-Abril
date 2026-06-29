import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ResultadosPageRoutingModule } from './resultados-routing.module';
import { ResultadosPage } from './resultados.page';
import { HeaderAppComponent } from '../../components/header-app/header-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResultadosPageRoutingModule,
    HeaderAppComponent
  ],
  declarations: [ResultadosPage]
})
export class ResultadosPageModule {}
