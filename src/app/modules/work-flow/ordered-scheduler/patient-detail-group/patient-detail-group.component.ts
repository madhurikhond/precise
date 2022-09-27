import { AfterViewInit, Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GridRowState } from 'src/app/models/pre-screeing-question';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';

@Component({
  selector: 'patient-detail-group',
  templateUrl: './patient-detail-group.component.html',
  styleUrls: ['./patient-detail-group.component.css']
})
export class PatientDetailGroupComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() viewingData: any;
  patientId: string;
  name: string;
  dob: string;
  financialTypeName: string;
  phone: string;
  language: string;
  zipCode: string;
  hasAlert: boolean = false;
  isSeen: number = -1;
  reason: string;
  activityData: any;
  returnData: any;
  fullName: any;

  constructor(private readonly patientService: PatientService, private _common: CommonMethodService, private _storage: StorageService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.viewingData['currentValue']) {
      this.activityData = changes.viewingData['currentValue'].response;
      this.isSeen = this.setUserPreScreeningShowingState(this.data.key)
    }
  }

  ngOnInit(): void {

  }

  setUserPreScreeningShowingState(key) {
    this.isSeen = -1
    this.fullName = ''
    if (this.activityData) {
      const findIndex = this.activityData.filter(item => item.GroupKey1 === key[0] && item.GroupKey2 === key[1]);
      if (findIndex.length > 0) {
        if (parseInt(this._storage.user.UserId) !== findIndex[0].UserId) {
          this.isSeen = 0;
        }
        else {
          this.isSeen = 1;
        }
        this.fullName = '(' + findIndex[0].FullName + ')'
      }
      const otherViewer = this.activityData.filter(item => parseInt(item.UserId) !== parseInt(this._storage.user.UserId));
      const myViewer = this.activityData.filter(item => parseInt(item.UserId) === parseInt(this._storage.user.UserId));
      let combineViewer = {
        otherViewer: otherViewer,
        myViewer: myViewer
      };
      this._common.viewerRecords.next(combineViewer);
    }
    else {
      let combineViewer = {
        otherViewer: [],
        myViewer: []
      };
      this._common.viewerRecords.next(combineViewer);
    }
    return this.isSeen;
  }


  ngAfterViewInit(): void {
    this.patientId = this.data.key[1];
    this.name = this.data.data.items ? this.data.data.items[0].GivenName1.split(" ",2) : this.data.data.collapsedItems[0].GivenName1.split(" ",2);
    this.financialTypeName = this.data.data.items ? this.data.data.items[0].FinancialTypeName : this.data.data.collapsedItems[0].FinancialTypeName;
    this.dob = this.data.data.items ? this.data.data.items[0].DOB : this.data.data.collapsedItems[0].DOB;
    this.phone = this.data.data.items ? this.phoneMask(this.data.data.items[0].CELLPHONE) : this.phoneMask(this.data.data.collapsedItems[0].CELLPHONE);
    this.language = this.data.data.items ? this.data.data.items[0].LANGUAGE : this.data.data.collapsedItems[0].LANGUAGE;
    this.zipCode = this.data.data.items ? this.data.data.items[0].ZIPCODE : this.data.data.collapsedItems[0].ZIPCODE;
    var items = this.data.data.items ? this.data.data.items : this.data.data.collapsedItems;
    this.hasAlert = (items.filter(a => a.HasAlert == '1')).length > 0;
    this.reason = this.data.data.items ? this.data.data.items[0].Reason : this.data.data.collapsedItems[0].Reason;
    this.isSeen = this.setUserPreScreeningShowingState(this.data.key)
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
    this._common.sendDataToDocumentManager(patientId);
  }

  getPatientDetailById(isHasAlertSelectedTab = 0) {
    let rowData = this.data.data?.collapsedItems?.length > 0 ? this.data.data?.collapsedItems[0] : this.data.data.items[0]
    let body = {
      'internalPatientId': rowData.INTERNALPATIENTID,
      'internalStudyId': rowData.InternalStudyId,
      'PatientId':rowData.PatientId,
      'hasAlert': rowData.HasAlert,
      'isHasAlertSelectedTab': isHasAlertSelectedTab
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
}
