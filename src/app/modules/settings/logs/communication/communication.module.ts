import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationRoutingModule } from './communication-routing.module';
import { CommunicationComponent } from './communication.component';
import { OutboundComponent } from './outbound/outbound.component';
import { AttyBillLogComponent } from './atty-bill-log/atty-bill-log.component';
import { FailureComponent } from './failure/failure.component';
import { DxButtonModule, DxContextMenuModule, DxDataGridModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/modules/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';


@NgModule({
  declarations: [ CommunicationComponent, OutboundComponent, AttyBillLogComponent, FailureComponent],
  imports: [
    CommonModule,
    CommunicationRoutingModule,
    NgxPaginationModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxContextMenuModule,    
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CommunicationModule { }
