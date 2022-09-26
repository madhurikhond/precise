import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ByattorneyComponent } from './byattorney/byattorney.component';
import { ByreferrerComponent } from './byreferrer/byreferrer.component';
import { PaidVsUnpaidComponent } from './paid-vs-unpaid.component';

const routes: Routes = [
  {
    
      path: '', component: PaidVsUnpaidComponent,
      children: [
        { path: '', redirectTo: 'byattorney', pathMatch: 'full' },
        { path: 'byattorney', component: ByattorneyComponent },
        { path: 'byreferrer', component: ByreferrerComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidVsUnpaidRoutingModule { }
