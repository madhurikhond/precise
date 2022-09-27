import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { AttyBillLogComponent } from './atty-bill-log/atty-bill-log.component';
import { CommunicationComponent } from './communication.component';
import { CommunicationModule } from './communication.module';
import { FailureComponent } from './failure/failure.component';
import { OutboundComponent } from './outbound/outbound.component';

const routes: Routes = [
  {
    path: '', component: CommunicationComponent, children:[
      
      { path: '', redirectTo: 'outbound', pathMatch: 'full'},
      { path: 'outbound', component: OutboundComponent, canActivate: [RoleGuard]},
      {
        path: 'atty-bill-log', component: AttyBillLogComponent
      },
      {
        path: 'failure', component: FailureComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunicationRoutingModule { }
