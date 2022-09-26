import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import{ CaseUpdateAndCollectionComponent} from './case-update-and-collection/case-update-and-collection.component';
import { PiRoutingModule } from './pi-routing.module';
import { PiComponent } from './pi.component';
import { ProRataCalculatorComponent } from './pro-rata-calculator/pro-rata-calculator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DxAutocompleteModule, DxButtonModule, DxContextMenuModule, DxDataGridModule, DxPopupModule, DxSelectBoxModule, DxTemplateModule } from 'devextreme-angular';
import { SettlementsComponent } from './settlements/settlements.component';
import { PatDetailComponent } from './settlements/pat-detail/pat-detail.component';
import { FacilityService } from 'src/app/services/facility.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { PatientDetailGroupComponent } from '../accounting/receive-payment/detail-group/detail-group.component';
import { PatientDetailsComponent } from '../work-flow/call-patient-schedule/patient-details/patient-details.component';




@NgModule({
  declarations: [PiComponent, ProRataCalculatorComponent, PatDetailComponent,CaseUpdateAndCollectionComponent,
    SettlementsComponent],
  imports: [
    CommonModule,
    PiRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    MatTableModule,
    MatSortModule,
    DxDataGridModule,
    DxSelectBoxModule,
    DxContextMenuModule,
    DxPopupModule,
    DxButtonModule,
    DxTemplateModule,
    DxAutocompleteModule,

  ],
  exports: [

  ],
  providers: [FacilityService, DatePipe, PatientService]
})
export class PiModule { }
