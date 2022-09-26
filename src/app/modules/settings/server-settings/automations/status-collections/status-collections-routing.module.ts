import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { BulkBillingEmailComponent } from './bulk-billing-email/bulk-billing-email.component';
import { CaseStatusComponent } from './case-status/case-status.component';
import { PersonellComponent } from './personell/personell.component';
import { PslPatientComponent } from './psl-patient/psl-patient.component';
import { StatusCollectionsComponent } from './status-collections.component';

const routes: Routes = [
{
  path:'',component:StatusCollectionsComponent,children:[
  {
   path:'' , redirectTo: 'pslpatient', pathMatch: 'full',canActivate:[RoleGuard]
  },
  {
    path:'pslpatient' , component:PslPatientComponent,canActivate:[RoleGuard]
   },
   {
    path:'casestatus' , component:CaseStatusComponent,canActivate:[RoleGuard]
   },
   {
    path:'bulkbillingemail' , component:BulkBillingEmailComponent,canActivate:[RoleGuard]
   },
   {
     path:'personell',component:PersonellComponent,canActivate:[RoleGuard]
   }

  ]
}


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusCollectionsRoutingModule { }
