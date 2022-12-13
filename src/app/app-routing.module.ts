import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)}, 
  { path: '', loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule) },
  { path: 'patient', loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule) },  
  { path: '', loadChildren: () => import('./modules/patient-portal/patient-portal.module').then(m => m.PatientPortalModule) },
  { path: 'facilities', loadChildren: () => import('./modules/facillities/facillities.module').then(m => m.FacillitiesModule) },
  { path: '', loadChildren: () => import('./modules/lien-portal/lien-portal.module').then(m => m.LienPortalModule) }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
 }
