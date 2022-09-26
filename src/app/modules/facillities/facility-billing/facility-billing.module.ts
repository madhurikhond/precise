import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacilityBillingRoutingModule } from './facility-billing-routing.module';
import { FrontDeskComponent } from './front-desk/front-desk.component';
import { BillingComponent } from './billing/billing.component';
import { SharedModule } from '../../shared/shared.module';
// import { FacilityBillingComponent } from './facility-billing.component';
//import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxCheckBoxModule } from 'devextreme-angular';
import { PatientService } from 'src/app/services/patient/patient.service';
import { RadflowBillingComponent } from './radflow-billing/radflow-billing.component';


// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


@NgModule({
  declarations: [FrontDeskComponent, BillingComponent, RadflowBillingComponent],
  imports: [
    CommonModule,
    SharedModule,
    // DxDataGridModule,
    DxCheckBoxModule,
    // CKEditorModule,
    FacilityBillingRoutingModule
  ],
  providers:[PatientService]  
})
export class FacilityBillingModule { }