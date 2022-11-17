import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadPortalRoutingModule } from './rad-portal-routing.module';
import { RadPortalComponent } from './rad-portal.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from "ngx-translate-multi-http-loader";
import { HttpClient } from '@angular/common/http';
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
import { PendingBillComponent } from './pending-bill/pending-bill.component';
import { AssignUnpaidComponent } from './assign-unpaid/assign-unpaid.component';
import { AssignPaidComponent } from './assign-paid/assign-paid.component';
import { RetainUnpaidComponent } from './retain-unpaid/retain-unpaid.component';
import { RetainPaidComponent } from './retain-paid/retain-paid.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { HeaderComponent } from './shared/header/header.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
    return new MultiTranslateHttpLoader(httpClient, [
      { prefix: './assets/translate/', suffix: '.json' }
    ])
  }

@NgModule({
  declarations: [RadPortalComponent, PendingBillComponent, AssignUnpaidComponent, AssignPaidComponent, RetainUnpaidComponent, RetainPaidComponent, HeaderComponent],
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
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
    SignaturePadModule
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ],
  providers:[PAuthGuard]
})
export class RadPortalModule { }
