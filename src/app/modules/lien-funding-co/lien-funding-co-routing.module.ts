import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PAuthGuard } from '../core/guards/pauth.guard';
import { LienFundingCoComponent } from './lien-funding-co.component';

const route: Routes = [
  {
      path: '',
      component: LienFundingCoComponent
  },
]
@NgModule({
  imports: [RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class LienFundingCoRoutingModule { }
