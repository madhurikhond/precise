import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PiComponent } from './pi/pi.component';
import { LiensComponent } from './liens.component';
import { PslAlertComponent } from './psl-alert/psl-alert.component';
import { ESignLienComponent } from './e-sign-lien/e-sign-lien.component';
import { BrokerPslComponent } from './broker-psl/broker-psl.component';

const routes: Routes = [

  {
    path: '', component: LiensComponent, children: [
      {
        path: '', redirectTo: 'pi', pathMatch: 'full'
      },
      {
        path:'pi',component:PiComponent
      }
      ,
      {
        path:'brokerpsl',component:BrokerPslComponent
      },
      
      {
        path:'pslalert',component:PslAlertComponent
      }
      ,
      {
        path:'esignlien',component:ESignLienComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiensRoutingModule { }
