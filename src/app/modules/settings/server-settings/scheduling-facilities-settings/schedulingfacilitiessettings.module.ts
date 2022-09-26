import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchedulingfacilitiessettingsRoutingModule } from './schedulingfacilitiessettings-routing.module';
import { SchedulingFacilitiesSettingsComponent } from './scheduling-facilities-settings.component';
import { GeneralTabComponent } from './general/general.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [SchedulingFacilitiesSettingsComponent, GeneralTabComponent],
  imports: [
    CommonModule,
    SchedulingfacilitiessettingsRoutingModule,
    SharedModule
  ]
})
export class SchedulingfacilitiessettingsModule { }
