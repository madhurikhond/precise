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

const routes: Routes = [
  
  {
    path: '', component: AutomationsComponent, children:[
      
      {
        path:'',redirectTo:'scheduling',loadChildren: () => import('./scheduling/scheduling.module').then(m => m.SchedulingModule)
      },
      {
        path:'scheduling',loadChildren: () => import('./scheduling/scheduling.module').then(m => m.SchedulingModule)
      },
      {
        path: 'smstest', component: SmsTestComponent
      },
      {
        path:'reminderstatus',component:ReminderStatusComponent
      },
      {
        path:'piacceptliability',component:PiAcceptLiabilityComponent
      },
      {
        path:'refstudysum',component:RefStudySumComponent
      },
      {
        path:'intake',loadChildren: () => import('./intake-setting/intake.module').then(m => m.IntakeModule)
      }
      ,
      {
        path:'liens',loadChildren: () => import('./liens/liens.module').then(m => m.LiensModule)
      },
      // {
      //   path:'options',component:OptionsComponent
      // },
      {
        path:'autobilling',loadChildren: () => import('./auto-billing/auto-billing.module').then(m => m.AutoBillingModule)
      },
      {
        path:'emailform',component:EmailFormComponent
      },
      {
        path:'reports',loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule)
      },
      {
        path:'facilities',loadChildren: () => import('./facilities/facilities.module').then(m => m.FacilitiesModule)
      },
      {
        path:'functionality',component:FunctionalityComponent
      },
      {
        path:'statuscollections',loadChildren: () => import('./status-collections/status-collections.module').then(m => m.StatusCollectionsModule)
      },
      {
        path:'pendpymt',loadChildren: () => import('./pend-pymt/pend-pymt.module').then(m => m.PendPymtModule)
      },
      {
        path:'export',loadChildren: () => import('./export/export.module').then(m => m.ExportModule)
      },
      {
        path:'slack',component:SlackComponent
      },
      {
        path:'brokerbilling',component:BrokerBillingComponent
      }
    ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AutomationsRoutingModule { }
