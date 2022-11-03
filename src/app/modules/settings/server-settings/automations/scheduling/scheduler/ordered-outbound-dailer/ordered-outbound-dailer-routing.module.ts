import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { CallTimingComponent } from './call-timing/call-timing.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { OrderedOutboundDailerComponent } from './ordered-outbound-dailer.component';

const routes: Routes = [
  {
    path:'',component:OrderedOutboundDailerComponent,children:[
      {
        path:'',redirectTo:'generalsettings',pathMatch:'full',canActivate:[RoleGuard]
      },
      {
        path:'generalsettings',component:GeneralSettingsComponent,canActivate:[RoleGuard]
      },
      {
        path:'calltimingsettings',component:CallTimingComponent,canActivate:[RoleGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderedOutboundDailerRoutingModule { }
