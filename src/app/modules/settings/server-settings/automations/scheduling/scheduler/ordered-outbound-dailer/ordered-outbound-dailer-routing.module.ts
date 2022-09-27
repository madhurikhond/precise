import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallTimingComponent } from './call-timing/call-timing.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { OrderedOutboundDailerComponent } from './ordered-outbound-dailer.component';

const routes: Routes = [
  {
    path:'',component:OrderedOutboundDailerComponent,children:[
      {
        path:'',redirectTo:'generalsettings',pathMatch:'full'
      },
      {
        path:'generalsettings',component:GeneralSettingsComponent
      },
      {
        path:'calltimingsettings',component:CallTimingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderedOutboundDailerRoutingModule { }
