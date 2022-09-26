import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutomationsComponent } from './automations.component';
import { SmsTestComponent } from './sms-test/sms-test.component';
import { ReminderStatusComponent } from './reminder-status/reminder-status.component';
import { PiAcceptLiabilityComponent } from './pi-accept-liability/pi-accept-liability.component';
import { RefStudySumComponent } from './ref-study-sum/ref-study-sum.component';
import { OptionsComponent } from './options/options.component';
import { EmailFormComponent } from './email-form/email-form.component';
import { FunctionalityComponent } from './functionality/functionality.component';
import {SlackComponent} from './slack/slack.component'
import { BrokerBillingComponent } from './broker-billing/broker-billing.component';
import {SchedulingModule} from './scheduling/scheduling.module'
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';

const routes: Routes = [
  
  {
    path: '', component: AutomationsComponent, children:[
      
      {
        path:'',redirectTo:'scheduling',loadChildren: () => import('./scheduling/scheduling.module').then(m => m.SchedulingModule),canActivate:[RoleGuard]
      },
      {
        path:'scheduling',loadChildren: () => import('./scheduling/scheduling.module').then(m => m.SchedulingModule),canActivate:[RoleGuard]
      },
      {
        path: 'smstest', component: SmsTestComponent,canActivate:[RoleGuard]
      },
      {
        path:'reminderstatus',component:ReminderStatusComponent,canActivate:[RoleGuard]
      },
      {
        path:'piacceptliability',component:PiAcceptLiabilityComponent,canActivate:[RoleGuard]
      },
      {
        path:'refstudysum',component:RefStudySumComponent,canActivate:[RoleGuard]
      },
      {
        path:'intake',loadChildren: () => import('./intake-setting/intake.module').then(m => m.IntakeModule),canActivate:[RoleGuard]
      }
      ,
      {
        path:'liens',loadChildren: () => import('./liens/liens.module').then(m => m.LiensModule),canActivate:[RoleGuard]
      },
      // {
      //   path:'options',component:OptionsComponent
      // },
      {
        path:'autobilling',loadChildren: () => import('./auto-billing/auto-billing.module').then(m => m.AutoBillingModule),canActivate:[RoleGuard]
      },
      {
        path:'emailform',component:EmailFormComponent,canActivate:[RoleGuard]
      },
      {
        path:'reports',loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),canActivate:[RoleGuard]
      },
      {
        path:'facilities',loadChildren: () => import('./facilities/facilities.module').then(m => m.FacilitiesModule),canActivate:[RoleGuard]
      },
      {
        path:'functionality',component:FunctionalityComponent,canActivate:[RoleGuard]
      },
      {
        path:'statuscollections',loadChildren: () => import('./status-collections/status-collections.module').then(m => m.StatusCollectionsModule),canActivate:[RoleGuard]
      },
      {
        path:'pendpymt',loadChildren: () => import('./pend-pymt/pend-pymt.module').then(m => m.PendPymtModule),canActivate:[RoleGuard]
      },
      {
        path:'export',loadChildren: () => import('./export/export.module').then(m => m.ExportModule),canActivate:[RoleGuard]
      },
      {
        path:'slack',component:SlackComponent,canActivate:[RoleGuard]
      },
      {
        path:'brokerbilling',component:BrokerBillingComponent,canActivate:[RoleGuard]
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationsRoutingModule { }
