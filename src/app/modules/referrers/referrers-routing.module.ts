import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReferrersComponent } from './referrers.component';

const routes: Routes = [
  { path: '', component:ReferrersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferrersRoutingModule { }
