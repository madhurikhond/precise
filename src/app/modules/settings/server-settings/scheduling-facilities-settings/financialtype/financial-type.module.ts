import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinancialTypeRoutingModule } from './financial-type-routing.module';
import { FinancialTypeComponent } from './financial-type.component';
import { ExcludeFacilitiesComponent } from './exclude-facilities/exclude-facilities.component';
import { SharedModule } from 'src/app/modules/shared/shared.module';


@NgModule({
  declarations: [FinancialTypeComponent, ExcludeFacilitiesComponent],
  imports: [
    CommonModule,
    FinancialTypeRoutingModule,
    SharedModule 
  ]
})
export class FinancialTypeModule { }
