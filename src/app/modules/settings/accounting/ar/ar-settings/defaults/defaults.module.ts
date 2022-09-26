import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DefaultsRoutingModule } from './defaults-routing.module';
import { DefaultsComponent } from './defaults.component';
import { GeneralComponent } from './general/general.component';
import { BrokersComponent } from './brokers/brokers.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [DefaultsComponent, GeneralComponent, BrokersComponent],
  imports: [
    CommonModule,
    DefaultsRoutingModule,           
    SharedModule 
  ]
})
export class DefaultsModule { }
