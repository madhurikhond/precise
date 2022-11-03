import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PiComponent } from './pi/pi.component';
import { LiensComponent } from './liens.component';
import { PslAlertComponent } from './psl-alert/psl-alert.component';
import { ESignLienComponent } from './e-sign-lien/e-sign-lien.component';
import { BrokerPslComponent } from './broker-psl/broker-psl.component';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';

const routes: Routes = [

  {
    path: '', component: LiensComponent, children: [
      {
        path: '', redirectTo: 'pi', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'pi',component:PiComponent,canActivate:[RoleGuard]
      }
      ,
      {
        path:'brokerpsl',component:BrokerPslComponent,canActivate:[RoleGuard]
      },
      
      {
        path:'pslalert',component:PslAlertComponent,canActivate:[RoleGuard]
      }
      ,
      {
        path:'esignlien',component:ESignLienComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiensRoutingModule { }
