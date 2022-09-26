import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AutomationsRoutingModule } from './automations-routing.module';
import { AutomationsComponent } from './automations.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/shared.module';
import { SmsTestComponent } from './sms-test/sms-test.component';
import { ReminderStatusComponent } from './reminder-status/reminder-status.component';
import { PiAcceptLiabilityComponent } from './pi-accept-liability/pi-accept-liability.component';
import { RefStudySumComponent } from './ref-study-sum/ref-study-sum.component';
import { OptionsComponent } from './options/options.component';
import { EmailFormComponent } from './email-form/email-form.component';
import { FunctionalityComponent } from './functionality/functionality.component';
import { SlackComponent } from './slack/slack.component';
import { BrokerBillingComponent } from './broker-billing/broker-billing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [AutomationsComponent, SmsTestComponent, ReminderStatusComponent, 
    PiAcceptLiabilityComponent, RefStudySumComponent, OptionsComponent, 
    EmailFormComponent, FunctionalityComponent, SlackComponent, BrokerBillingComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SharedModule,
    NgxPaginationModule,
    AutomationsRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AutomationsModule { }
