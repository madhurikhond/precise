import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiRoutingModule } from './bi-routing.module';
import { BiComponent } from './bi/bi.component';
import { MarketingComponent } from './marketing/marketing.component';
import { PersonalInjuryComponent } from './personal-injury/personal-injury.component';
import { SchedulingComponent } from './scheduling/scheduling.component';

@NgModule({
  declarations: [BiComponent, MarketingComponent,PersonalInjuryComponent,SchedulingComponent],
  imports: [
    CommonModule,
    BiRoutingModule
  ]
})
export class BiModule { }
