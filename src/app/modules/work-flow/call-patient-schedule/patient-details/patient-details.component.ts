import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements AfterViewInit {
  @Input() data: any;
  patientId: string;
  lastName: string;
  firstName: string;
  dob: string;
  financialTypeName: string;
  phone: string;
  language: string;
  hasAlert: boolean = false;
  reason: string;
  smsSent: string;

  constructor(private readonly commonMethodService: CommonMethodService, private readonly patientService: PatientService,) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
     this.patientId = this.data.data.items ? this.data.data.items[0].patientid : this.data.data.collapsedItems[0].patientid;
    this.lastName = this.data.data.items ? this.data.data.items[0].LastName : this.data.data.collapsedItems[0].LastName;
    this.firstName = this.data.data.items ? this.data.data.items[0].FirstName : this.data.data.collapsedItems[0].FirstName;
    this.financialTypeName = this.data.data.items ? this.data.data.items[0].FINANCIALTYPENAME : this.data.data.collapsedItems[0].FINANCIALTYPENAME;
    this.dob = this.data.data.items ? this.data.data.items[0].BIRTHDATE : this.data.data.collapsedItems[0].BIRTHDATE;
    this.phone = this.data.data.items ? this.phoneMask(this.data.data.items[0].phone) : this.phoneMask(this.data.data.collapsedItems[0].phone);
    this.language = this.data.data.items ? this.data.data.items[0].Language : this.data.data.collapsedItems[0].Language;
    //this.hasAlert = this.data.data.items ? this.data.data.items[0].hasalert : this.data.data.collapsedItems[0].hasalert;
    var items = this.data.data.items ? this.data.data.items : this.data.data.collapsedItems;
    this.hasAlert = (items.filter(a => a.hasalert == '1')).length > 0;
    this.reason = this.data.data.items ? this.data.data.items[0].Reason : this.data.data.collapsedItems[0].Reason;
    this.smsSent = this.data.data.items ? this.data.data.items[0].smssent : this.data.data.collapsedItems[0].smssent;
  }

  phoneMask(a) {
    try {
      a = [a.slice(0, 6), '-', a.slice(6)].join('');
      a = [a.slice(0, 3), '-', a.slice(3)].join('');
      return a;
    }
    catch {
      return a;
    }
  }

  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  getPatientDetailById(isHasAlertSelectedTab = 0) {
    let body = {
      'internalPatientId': this.data.data.items ? this.data.data.items[0].internalpatientid : this.data.data.collapsedItems[0].internalpatientid,
      'internalStudyId': this.data.data.items ? this.data.data.items[0].internalstudyid : this.data.data.collapsedItems[0].internalstudyid,
      'hasAlert':this.data.HasAlert,
      'isHasAlertSelectedTab': isHasAlertSelectedTab
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
  
}
