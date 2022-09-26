import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BulkBillingEmailComponent } from './bulk-billing-email/bulk-billing-email.component';
import { CaseStatusComponent } from './case-status/case-status.component';
import { PersonellComponent } from './personell/personell.component';
import { PslPatientComponent } from './psl-patient/psl-patient.component';
import { StatusCollectionsComponent } from './status-collections.component';

const routes: Routes = [
{
  path:'',component:StatusCollectionsComponent,children:[
  {
   path:'' , redirectTo: 'pslpatient', pathMatch: 'full'
  },
  {
    path:'pslpatient' , component:PslPatientComponent
   },
   {
    path:'casestatus' , component:CaseStatusComponent
   },
   {
    path:'bulkbillingemail' , component:BulkBillingEmailComponent
   },
   {
     path:'personell',component:PersonellComponent
   }

  ]
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusCollectionsRoutingModule { }
