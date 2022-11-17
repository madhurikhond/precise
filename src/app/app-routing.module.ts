import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/account/account.module').then(m => m.AccountModule)}, 
  { path: '', loadChildren: () => import('./modules/core/core.module').then(m => m.CoreModule) },
  { path: 'patient', loadChildren: () => import('./modules/patient/patient.module').then(m => m.PatientModule) },
  { path: '', loadChildren: () => import('./modules/patient-portal/patient-portal.module').then(m => m.PatientPortalModule) },
  { path: '', loadChildren: () => import('./modules/rad-portal/rad-portal.module').then(m => m.RadPortalModule) }
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
