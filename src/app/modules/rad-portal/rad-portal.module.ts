import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadPortalRoutingModule } from './rad-portal-routing.module';
import { RadPortalComponent } from './rad-portal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgbProgressbarModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxProgressBarModule } from 'devextreme-angular';
import {  DxDateBoxModule,DxCheckBoxModule,DxSelectBoxModule } from "devextreme-angular";
import { FormsModule } from "@angular/forms";
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
} from 'devextreme-angular';
import { PendingBillComponent } from './pending-bill/pending-bill.component';
import { AssignUnpaidComponent } from './assign-unpaid/assign-unpaid.component';
import { AssignPaidComponent } from './assign-paid/assign-paid.component';
import { RetainUnpaidComponent } from './retain-unpaid/retain-unpaid.component';
import { RetainPaidComponent } from './retain-paid/retain-paid.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { SettingComponent } from './setting/setting.component';
import { AddFundingCompanyComponent } from './add-funding-company/add-funding-company.component';
import { HeaderComponent } from './shared/header/header.component';
import { RAuthGuard } from '../core/guards/rauth.guard';


@NgModule({
  declarations: [HeaderComponent,RadPortalComponent, PendingBillComponent, AssignUnpaidComponent, AssignPaidComponent, RetainUnpaidComponent, RetainPaidComponent, SettingComponent, AddFundingCompanyComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SharedModule,
    RadPortalRoutingModule,
    NgbProgressbarModule,
    DxProgressBarModule,
    NgbTooltipModule,
    DxDataGridModule,
    DxDateBoxModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxTemplateModule,
    DxBulletModule,
    DxSelectBoxModule,  
    NgSelectModule,
    FormsModule,
    SignaturePadModule
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
  providers:[RAuthGuard]
})
export class RadPortalModule { }
