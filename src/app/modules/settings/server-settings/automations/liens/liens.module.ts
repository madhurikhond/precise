import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiensRoutingModule } from './liens-routing.module';
import { SharedModule } from '../../../../shared/shared.module';
import { LiensComponent } from './liens.component';
import { PiComponent } from './pi/pi.component';
import { BrokerPslComponent } from './broker-psl/broker-psl.component';
import { PslAlertComponent } from './psl-alert/psl-alert.component';
import { ESignLienComponent } from './e-sign-lien/e-sign-lien.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [LiensComponent, PiComponent, BrokerPslComponent, PslAlertComponent, ESignLienComponent],
  imports: [
    CommonModule,
    LiensRoutingModule,
    SharedModule,
    CommonModule,
    NgSelectModule
  ]
})
export class LiensModule { }
