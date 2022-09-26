import { Component, AfterViewInit, Input } from '@angular/core';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'pat-detail',
  templateUrl: './pat-detail.component.html',
  styleUrls: ['./pat-detail.component.css']
})
export class PatDetailComponent implements AfterViewInit {
  @Input() data: any;
  patientId: string;
  lastName: string;
  firstName: string;
  dob: string;
  financialTypeName: string;
  doi: string;

  constructor(private readonly patientService: PatientService) { }

  ngAfterViewInit(): void {
    this.patientId = this.data.key;
    this.lastName = this.data.data.items ? this.data.data.items[0].FAMILYNAME : this.data.data.collapsedItems[0].FAMILYNAME;
    this.firstName = this.data.data.items ? this.data.data.items[0].GIVENNAME : this.data.data.collapsedItems[0].GIVENNAME;
    this.financialTypeName = this.data.data.items ? this.data.data.items[0].FINANCIALTYPENAME : this.data.data.collapsedItems[0].FINANCIALTYPENAME;
    this.dob = this.data.data.items ? this.data.data.items[0].BIRTHDATE : this.data.data.collapsedItems[0].BIRTHDATE;
    this.doi = this.data.data.items ? this.data.data.items[0].InjuryDate : this.data.data.collapsedItems[0].InjuryDate;
  }
  getPatientDetailById() {
    let rowData = this.data.data?.collapsedItems?.length > 0 ? this.data.data?.collapsedItems[0] : this.data.data.items[0]
    let body = {
      'internalPatientId': rowData.INTERNALPATIENTID,
      'internalStudyId': rowData.InternalStudyId,
      'hasAlert': rowData.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
