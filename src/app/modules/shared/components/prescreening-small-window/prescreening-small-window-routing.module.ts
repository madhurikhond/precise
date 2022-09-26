import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { PrescreengridComponent } from './prescreengrid/prescreengrid.component';

const routes: Routes = [
  {path:'preScreenGrid',component:PrescreengridComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrescreeningSmallWindowRoutingModule { }
