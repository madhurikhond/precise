import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PatientRoutingModule } from './patient-routing.module';
import { PatientComponent } from './patient.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';
import { PatientService } from 'src/app/services/patient/patient.service';
import { DxAutocompleteModule, DxButtonModule } from 'devextreme-angular';
import { EsignrequestaComponent } from './esignrequesta/esignrequesta.component';
import { EsignrequestComponent } from './esignrequest/esignrequest.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { EsignrequestsComponent } from './esignrequests/esignrequests.component';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { EsignrequestasComponent } from './esignrequestas/esignrequestas.component';

@NgModule({
  declarations: [PatientComponent, EsignrequestaComponent, EsignrequestComponent, EsignrequestsComponent, EsignrequestasComponent],
  imports: [
    CommonModule,  

    NgSelectModule,
    SharedModule,
    DxButtonModule,
    DxAutocompleteModule,
    PatientRoutingModule,
    SignaturePadModule,
  
  ],
  providers:[PatientService ,FacilityService]
})
export class PatientModule { }
