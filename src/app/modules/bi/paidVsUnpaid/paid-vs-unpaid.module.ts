import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidVsUnpaidRoutingModule } from './paid-vs-unpaid-routing.module';
import { PaidVsUnpaidComponent } from './paid-vs-unpaid.component';
import { ByattorneyComponent } from './byattorney/byattorney.component';
import { ByreferrerComponent } from './byreferrer/byreferrer.component';
import { SharedModule } from '../../shared/shared.module';
//import { DxDataGridModule} from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [PaidVsUnpaidComponent, ByattorneyComponent, ByreferrerComponent],
  imports: [
    CommonModule,
    DxDataGridModule,
    SharedModule,
    PaidVsUnpaidRoutingModule,
  ]
})
export class PaidVsUnpaidModule { }
