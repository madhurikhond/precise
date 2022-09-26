import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutodialerComponent } from './autodialer.component';
import { NewordercallerComponent } from './newordercaller/newordercaller.component';

const routes: Routes = [
  {
    path: '', component: AutodialerComponent,
    children: [
      { path: '', redirectTo: 'newordercaller', pathMatch: 'full' },
      { path: 'newordercaller', component: NewordercallerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutodialerRoutingModule { }
