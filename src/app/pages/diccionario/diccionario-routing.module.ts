import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DiccionarioPage } from './diccionario.page';

const routes: Routes = [
  {
    path: '',
    component: DiccionarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DiccionarioPageRoutingModule {}
