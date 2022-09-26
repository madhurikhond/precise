import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PatientComponent } from './patient.component';
import { EsignrequestaComponent } from './esignrequesta/esignrequesta.component';
import { EsignrequestComponent } from './esignrequest/esignrequest.component';
import { EsignrequestsComponent } from './esignrequests/esignrequests.component';
import { AuthGuard } from '../core/guards/auth.guard';  
import { CoreComponent } from '../core/core.component';
import { RoleGuard } from '../core/guards/role.guard';
import { EsignrequestasComponent } from './esignrequestas/esignrequestas.component';

const routes: Routes = [
 {
  path: '', canActivate: [AuthGuard,RoleGuard] ,component: CoreComponent, children:[
    { path: '', component:PatientComponent, pathMatch: 'full', },
    { path: '', component:PatientComponent, canActivate: [AuthGuard,RoleGuard]},
  ]
},
  // { path: 'patients', component:PatientComponent},
  { path: 'esignrequesta', component:EsignrequestaComponent},
  { path: 'esignrequest', component:EsignrequestComponent},
  { path: 'esignrequests', component:EsignrequestsComponent},
  { path: 'esignrequestas' , component:EsignrequestasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule { }
