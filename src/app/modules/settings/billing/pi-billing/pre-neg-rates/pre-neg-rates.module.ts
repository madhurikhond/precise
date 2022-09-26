import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreNegRatesRoutingModule } from './pre-neg-rates-routing.module';
import { DefaultMinPricingComponent } from './default-min-pricing/default-min-pricing.component';
import { OverridePricingComponent } from './override-pricing/override-pricing.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [DefaultMinPricingComponent, OverridePricingComponent],
  imports: [
    CommonModule,
    PreNegRatesRoutingModule,
    SharedModule,
    BsDatepickerModule.forRoot()
  ]
})
export class PreNegRatesModule { }
