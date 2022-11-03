import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { OrderedReviewComponent } from './ordered-review/ordered-review.component';
import { OrderedShedulerComponent } from './ordered-sheduler/ordered-sheduler.component';
import { OrderedSmsComponent } from './ordered-sms/ordered-sms.component';
import { PendPiAcceptLiabComponent } from './pend-pi-accept-liab/pend-pi-accept-liab.component';
import { SchedulerComponent } from './scheduler.component';




const routes: Routes = [
     {
       path:'',component:SchedulerComponent,children:[
  
    {
      path:'',redirectTo:'orderedoutbounddailer',loadChildren: () => import('./ordered-outbound-dailer/ordered-outbound-dailer.module').then(m => m.OrderedOutboundDailerModule),canActivate:[RoleGuard]
    },
    {
      path:'orderedoutbounddailer',loadChildren: () => import('./ordered-outbound-dailer/ordered-outbound-dailer.module').then(m => m.OrderedOutboundDailerModule),canActivate:[RoleGuard]
    },
    {
      path:'pendpiacceptliab',component:PendPiAcceptLiabComponent,canActivate:[RoleGuard]
    },
    {
      path:'orderedsms',component:OrderedSmsComponent,canActivate:[RoleGuard]
    },
    {
      path:'orderedreview',component:OrderedReviewComponent,canActivate:[RoleGuard]
    },
    {
      path:'orderedsheduler',component:OrderedShedulerComponent,canActivate:[RoleGuard]
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulerRoutingModule { }
