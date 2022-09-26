import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';

import { PatientApptConfComponent } from './patient-appt-conf.component';
import { SmsConfirmComponent } from './sms-confirm/sms-confirm.component';

const routes: Routes = [
  {
    path:'',component:PatientApptConfComponent,children:[
      {
        path:'',redirectTo:'smsconfirm',pathMatch:'full',canActivate:[RoleGuard]
      },
      {
        path:'smsconfirm', component:SmsConfirmComponent,canActivate:[RoleGuard]
      },
      {
        path:'callconfirm', loadChildren: () => import('./call-confirm/call-confirm.module').then(m => m.CallConfirmModule),canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientApptConfRoutingModule { }
