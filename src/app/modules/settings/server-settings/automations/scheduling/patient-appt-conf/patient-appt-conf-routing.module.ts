import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientApptConfComponent } from './patient-appt-conf.component';
import { SmsConfirmComponent } from './sms-confirm/sms-confirm.component';

const routes: Routes = [
  {
    path:'',component:PatientApptConfComponent,children:[
      {
        path:'',redirectTo:'smsconfirm',pathMatch:'full'
      },
      {
        path:'smsconfirm', component:SmsConfirmComponent
      },
      {
        path:'callconfirm', loadChildren: () => import('./call-confirm/call-confirm.module').then(m => m.CallConfirmModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientApptConfRoutingModule { }
