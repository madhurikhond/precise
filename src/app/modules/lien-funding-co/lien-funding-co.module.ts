import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { NgbProgressbarModule, NgbTooltip, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DxProgressBarModule } from 'devextreme-angular';
import { PAuthGuard } from '../core/guards/pauth.guard';
import {  DxDateBoxModule,DxCheckBoxModule,DxSelectBoxModule } from "devextreme-angular";
import { FormsModule } from "@angular/forms";
import {
  DxDataGridModule,
  DxBulletModule,
  DxTemplateModule,
} from 'devextreme-angular';
import { LienFundingCoComponent } from './lien-funding-co.component';
import { LienFundingCoRoutingModule } from './lien-funding-co-routing.module';
import { PendingSignatureComponent } from './pending-signature/pending-signature.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { FundingCoUnpaidComponent } from './funding-co-unpaid/funding-co-unpaid.component';
import { FundingCoPaidComponent } from './funding-co-paid/funding-co-paid.component';
import { FundingCoSettingComponent } from './funding-co-setting/funding-co-setting.component';
import { OriginalLienOwnerComponent } from './original-lien-owner/original-lien-owner.component';

@NgModule({
  declarations: [LienFundingCoComponent, PendingSignatureComponent, FundingCoUnpaidComponent,FundingCoPaidComponent,FundingCoSettingComponent,OriginalLienOwnerComponent],
  imports: [
    CommonModule,
    NgSelectModule,
    SharedModule,
    LienFundingCoRoutingModule,
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
  providers:[]
})
export class LienFundingCoModule { }
