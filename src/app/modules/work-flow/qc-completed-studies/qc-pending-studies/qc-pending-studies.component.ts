import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { timeStamp } from 'console';
import { DxDataGridComponent } from 'devextreme-angular';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { ReferrersService } from 'src/app/services/referrers.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { PageSizeArray } from 'src/app/constants/pageNumber';


@Component({
  selector: 'app-qc-pending-studies',
  templateUrl: './qc-pending-studies.component.html',
  styleUrls: ['./qc-pending-studies.component.css']
})
export class QcPendingStudiesComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('hiddenButtonHardCheck', { static: false }) hiddenButtonHardCheck: ElementRef;
  @ViewChild('hiddenButtonSoftCheck', { static: false }) hiddenButtonSoftCheck: ElementRef;

  allMode: string;
  checkBoxesMode: string;
  searchForm: FormGroup;
  actionForm: FormGroup;
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  showDropdownLoader = true;
  selectedRows: any = [];
  submitted = false;
  financialTypeList: any = [];
  brokerList: any = [];
  studyStatusList: any = [];
  priorityList: any = [];
  modalityList: any = [];

  selectedFinancialType: any = [];
  selectedBroker: any = [];
  selectedStudyStatus: any = [];
  selectedPriority: any = [];
  selectedModality: any = [];

  resizingModes: string[] = ["nextColumn", "widget"];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: "auto", name: "Immediately" }, { key: "onClick", name: "On Button Click" }];
  currentFilter: any;
  showHeaderFilter: boolean;
  checkedPatientIdInternalStudyid: any = [];
  isShowColumnWithNoData = true;
  message: string;
  filterdata: any = [];
  condition: Number;
  modalityExceptionsForm:FormGroup;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService, private _modalService: NgbModal,
    private readonly workflowService: WorkflowService, private referrersService: ReferrersService,
    private readonly notificationService: NotificationService, private readonly storageService: StorageService, private readonly patientService: PatientService) { }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('QC Pending Studies');
    this.getDropdown();
    this.searchForm = this.fb.group({
      patientId: [''],
      lastName: [''],
      firstName: [''],
      financialType: [''],
      broker: [''],
      studyStatus: [''],
      priority: [null],
      modality: [''],
      fromDate: [''],
      toDate: [''],
      dateRange: [null]
    });
    this.actionForm = this.fb.group({
      action: [null, Validators.required],
    }); 
    this.getQcPendingStudies();
   // this.setGridSetting(); As per the client changes save grid option removed from action menu
   this.createModalityExceptionsTabForm();

  }
  createModalityExceptionsTabForm()
  {
    this.modalityExceptionsForm = this.fb.group({
      psltcexception: [''],
      pslpexception:[''],
      
      
      asltcexception:[''],
      aslpexception:[''],
      

    });
    this.modalityExceptionsForm.disable();
  }

  setGridSetting() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [{
      key: "auto",
      name: "Immediately"
    }, {
      key: "onClick",
      name: "On Button Click"
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;

    this.referrersService.getPersistentGridSetting(true, this.storageService.user.UserId, "QC_Pending_Studies").subscribe((res) => {
       if (res.response != null) {
        let state = JSON.parse(res.response.GridSettings);
        this.dataGrid.instance.state(state);
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  getDropdown() {
    this.workflowService.getQCAttorneyDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.financialTypeList = data.response.financialTypeList;
        this.brokerList = data.response.brokerList;
        this.studyStatusList = data.response.studyStatusList;
        this.priorityList = data.response.priorityList;
        this.modalityList = data.response.modalityList;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }

  onSearchSubmit() {
    this.pageNumber = 1;
    this.getQcPendingStudies();
  }

  getQcPendingStudies() {
    var data = {
      "patientId": this.sForm.patientId.value,
      "lastName": this.sForm.lastName.value,
      "firstName": this.sForm.firstName.value,
      "broker": this.sForm.broker.value ? this.sForm.broker.value.toString() : null,
      "financialType": this.sForm.financialType.value ? this.sForm.financialType.value.toString() : null,
      "status": this.sForm.studyStatus.value ? this.sForm.studyStatus.value.toString() : null,
      "priority": this.sForm.priority.value ? this.sForm.priority.value.toString() : null,
      "modality": this.sForm.modality.value ? this.sForm.modality.value.toString() : null,
      "fromDate": this.sForm.fromDate.value ? this.sForm.fromDate.value : null,
      "toDate": this.sForm.toDate.value ? this.sForm.toDate.value : null,
      "dateRange": this.sForm.dateRange.value
    }
    this.workflowService.getQcPendingStudies(true, data, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res) { 
        this.selectedRows=null;
        var data: any = res;
        this.totalRecords = res.totalRecords;
        this.dataList = data.response;
        if (this.dataList != null) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
          });
          this.isShowColumnWithNoData = true;
        }
        else {
          this.totalRecords = 1;
          this.dataList = [];
          this.isShowColumnWithNoData = false;
        }
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  onReset() {
    this.searchForm.reset();
    this.getQcPendingStudies();
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getQcPendingStudies();
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getQcPendingStudies();
  }

  onActionClick() {
    if (this.actionForm.invalid) {
      return;
    }
    else if (!this.selectedRows || this.selectedRows.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select atleast one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
      return
    }

    this.condition = 0;
    this.filterdata = [];
    this.filterdata = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
    this.submitted = true;
    this.checkedPatientIdInternalStudyid = [];
  
    if (this.aForm.action.value === "1") {
      this.saveGridSetting();
    }
    else if (this.aForm.action.value == '2' || this.aForm.action.value == '3') {
      this.condition = Number(this.aForm.action.value) + 2; //same as patient page
      var hardCheck = new Array();
      var softCheck = new Array();
      for (let i = 0; i < this.filterdata.length; i++) {
        if (this.filterdata[i].HardCheck != "") {
          if (!hardCheck.toString().includes(this.filterdata[i].hardCheck)) {
            hardCheck.push(this.filterdata[i].HardCheck);
          }
        }
        if (this.filterdata[i].SoftCheck != "" && this.filterdata[i].HardCheck == "") {
          if (!softCheck.toString().includes(this.filterdata[i].SoftCheck)) {
            softCheck.push(this.filterdata[i].SoftCheck);
          }
        }
      }
      if (hardCheck.length == 0 && softCheck.length == 0) {
        for (let i = 0; i < this.filterdata.length; i++) {
          this.checkedPatientIdInternalStudyid.push({
            PATIENTID: this.filterdata[i].patientid,
            InternalStudyId: this.filterdata[i].internalstudyid,
            Condition: this.condition,
            Userid: this.storageService.user.UserId
          });
        }
        this.getReadyToBill();
      }
      else {
        this.message = '';
        if (hardCheck.length != 0) {
          this.message =  hardCheck.toString().replace(",", ", ") + "\n";
        }
        if (hardCheck.length != 0 && softCheck.length === 0) {
          this.hiddenButtonHardCheck.nativeElement.click();
          for (let i = 0; i < this.filterdata.length; i++) {
            if (this.filterdata[i].HardCheck == "") {
              this.checkedPatientIdInternalStudyid.push({
                PATIENTID: this.filterdata[i].patientid,
                InternalStudyId: this.filterdata[i].internalstudyid,
                Condition: this.condition,
                Userid: this.storageService.user.UserId
              });
            }
          }
          this.getReadyToBill();
        }
        else if (softCheck.length != 0) {
          this.message = this.message + "Patients have " + softCheck.toString().replace(",", ", ") + " soft Check. Do You Really Want To Continue?\n";
          this.hiddenButtonSoftCheck.nativeElement.click();
        }
        this.submitted = false;
        this.actionForm.reset();
        this.selectedRows = null;
      }
    }
    else if (["4", "5", "6", "7", "8", "9", "10", "11"].indexOf(this.aForm.action.value) > -1) {
      let patientIds = this.filterdata.map(a => a.patientid);
      let internalPatientIds = this.filterdata.map(a => a.internalpatientid);

      var data = {
        "PatientId": patientIds.toString(),
        "InternalStudyId": internalPatientIds.toString(),
        "Condition": this.aForm.action.value
      }
      this.workflowService.updateQCAttorneyBillsDropDown(true, data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: "Success",
            alertMessage: res.response[0].Result,
            alertType: res.responseCode
          });
          this.submitted = false;
          this.actionForm.reset();
          this.selectedRows = null;
          this.getQcPendingStudies();
        }
      }, (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
    }
    else if (this.aForm.action.value == '12') {
      for (let i = 0; i < this.filterdata.length; i++) {
        console.log(this.filterdata[i]);
        this.checkedPatientIdInternalStudyid.push({
          patientIdExport: this.filterdata[i].patientid,
          FINANCIALTYPENAME: this.filterdata[i].financialtypename,
          STUDYDESCRIPTION: this.filterdata[i].studydescription,
          IsReferralService: this.filterdata[i].IsReferralService,
          StudyPart: this.filterdata[i].SCHEDULEDBODYPARTEXAMINED,
          DXCode: this.filterdata[i].dxcode,
          ATTORNEYLF: this.filterdata[i].attorneylf,
          BDCompanyName: this.filterdata[i].BDCompanyName,
          BrokerOverRideAddress: this.filterdata.BrokerOverRideAddress,
          AttorneyFaxNumber: this.filterdata[i].AttorneyFaxNumber,
          InjuryDate: this.filterdata[i].injurydate,
          isExamLocation: this.filterdata[i].IsExamLocation,
          firstName: this.filterdata[i].FirstName,
          lastName: this.filterdata[i].LastName,
          ISREADYTOBILL: this.filterdata.isreadytobill,
          address: this.filterdata[i].FullAddress,
          dob: this.filterdata[i].DOB,
          gender: this.filterdata[i].Sex,
          billSent: this.filterdata[i].BillSent,
          insuranceCompany: this.filterdata[i].financialtypename,
          coverageLevel: this.filterdata[i].COVERAGELEVEL,
          insurance: this.filterdata[i].INSUREDID,
          policyGroup: this.filterdata[i].POLICYGROUP,
          notes: this.filterdata[i].Notes,
          attorney: this.filterdata[i].ATTORNEY,
          businessPhoneNumber: this.filterdata[i].BusinessPhoneNumber,
          dos: this.filterdata[i].studydatetime,
          cpt: this.filterdata[i].proccodename,
          referringPhysician: this.filterdata[i].referringPhysician,
          internalStudyId: this.filterdata[i].internalstudyid,
          reportSignedTime: this.filterdata[i].reportsignedtime,
          attorneyEmail: this.filterdata[i].attorneyEmail,
          BillingMethod: this.filterdata[i].BillingMethod,
          RevisedBill: false,
          IsPreview: false,
          userOverRide: false,   //need to discuss
          IsNoReport: false,   //need to discuss
          reportType: ''    //need to discuss
        });
      }
      this.patientService.getGenerateAttorneyBill(true, JSON.stringify(JSON.stringify(this.checkedPatientIdInternalStudyid))).subscribe((res) => {
        if (res.response != null) {
          this.onSearchSubmit();
          let fileList: any = [];
          fileList = res.response;
          for (let result of fileList) {
            let ArrayBuff = this._base64ToArrayBuffer(result.file);
            let file = new Blob([ArrayBuff], { type: 'application/pdf' });
            window.open(URL.createObjectURL(file), '_blank');


          }
        }
      },
        (err: any) => {
          this.error(err);
        });
    }
    else if (this.aForm.action.value == '13') {
      console.log(this.filterdata);
      for (let i = 0; i < this.filterdata.length; i++) {
        this.checkedPatientIdInternalStudyid.push({
          patientIdExport: this.filterdata[i].patientid,
          FINANCIALTYPENAME: this.filterdata[i].financialtypename,
          STUDYDESCRIPTION: this.filterdata[i].studydescription,
          IsReferralService: this.filterdata[i].IsReferralService,
          StudyPart: this.filterdata[i].SCHEDULEDBODYPARTEXAMINED,
          DXCode: this.filterdata[i].dxcode,
          ATTORNEYLF: this.filterdata[i].attorneylf,
          BDCompanyName: this.filterdata[i].BDCompanyName,
          BrokerOverRideAddress: this.filterdata.BrokerOverRideAddress,
          AttorneyFaxNumber: this.filterdata[i].AttorneyFaxNumber,
          InjuryDate: this.filterdata[i].injurydate,
          isExamLocation: this.filterdata[i].IsExamLocation,
          firstName: this.filterdata[i].FirstName,
          lastName: this.filterdata[i].LastName,
          ISREADYTOBILL: this.filterdata.isreadytobill,
          address: this.filterdata[i].FullAddress,
          dob: this.filterdata[i].DOB,
          gender: this.filterdata[i].Sex,
          billSent: this.filterdata[i].BillSent,
          insuranceCompany: this.filterdata[i].financialtypename,
          coverageLevel: this.filterdata[i].COVERAGELEVEL,
          insurance: this.filterdata[i].INSUREDID,
          policyGroup: this.filterdata[i].POLICYGROUP,
          notes: this.filterdata[i].Notes,
          attorney: this.filterdata[i].ATTORNEY,
          businessPhoneNumber: this.filterdata[i].BusinessPhoneNumber,
          dos: this.filterdata[i].studydatetime,
          cpt: this.filterdata[i].proccodename,
          referringPhysician: this.filterdata[i].referringPhysician,
          internalStudyId: this.filterdata[i].internalstudyid,
          reportSignedTime: this.filterdata[i].reportsignedtime,
          attorneyEmail: this.filterdata[i].attorneyEmail,
          BillingMethod: this.filterdata[i].BillingMethod,
          RevisedBill: false,
          IsPreview: true,
          userOverRide: false,   //need to discuss
          IsNoReport: false,   //need to discuss
          reportType: ''    //need to discuss
        });
      }
      this.patientService.getGenerateAttorneyBill(true, JSON.stringify(JSON.stringify(this.checkedPatientIdInternalStudyid))).subscribe((res) => {
        if (res.response != null) {
          this.onSearchSubmit();
          let fileList: any = [];
          fileList = res.response;
          for (let result of fileList) {
            let ArrayBuff = this._base64ToArrayBuffer(result.file);
            let file = new Blob([ArrayBuff], { type: 'application/pdf' });
            window.open(URL.createObjectURL(file), '_blank');
          }
        }
      },
        (err: any) => {
          this.error(err);
        });
    }
  }

  getReadyToBill() {
    if (this.checkedPatientIdInternalStudyid.length > 0) {
      let data = {
        "parameter": JSON.stringify(this.checkedPatientIdInternalStudyid)
      }
      this.patientService.getReadyToBill(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: "Success",
            alertMessage: res.response[0].Result,
            alertType: res.responseCode
          });
          this.submitted = false;
          this.actionForm.reset();
          this.selectedRows = null;
          this.getQcPendingStudies();
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
  }

  sendSoftChecks(condition: boolean) {
    if (condition === true) {
      for (let i = 0; i < this.filterdata.length; i++) {
        if (this.filterdata[i].HardCheck == "") {
          this.checkedPatientIdInternalStudyid.push({
            PATIENTID: this.filterdata[i].patientid,
            InternalStudyId: this.filterdata[i].internalstudyid,
            Condition: this.condition,
            Userid: this.storageService.user.UserId
          });
        }
      }
    }
    else {
      for (let i = 0; i < this.filterdata.length; i++) {
        if (this.filterdata[i].HardCheck == "" && this.filterdata[i].SoftCheck == "") {
          this.checkedPatientIdInternalStudyid.push({
            PATIENTID: this.filterdata[i].patientid,
            InternalStudyId: this.filterdata[i].internalstudyid,
            Condition: this.condition,
            Userid: this.storageService.user.UserId
          });
        }
      }
    }
    this.getReadyToBill();
  }

  saveGridSetting() {
    let state = this.dataGrid.instance.state();
    let gridSetting = JSON.stringify(state);
    let body =
    {
      "id": 0,
      "userId": this.storageService.user.UserId,
      "pageName": "QC_Pending_Studies",
      "gridSettings": gridSetting
    }

    this.referrersService.updatePersistentGridSetting(true, body).subscribe((res) => {
      if (res.response != null) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: 'Grid setting saved successfully.',
          alertType: res.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  get sForm() { return this.searchForm.controls; }
  get aForm() { return this.actionForm.controls; }

  getPatientDetailById(data) {
  
    let body = {
      'internalPatientId': data.internalpatientid,
      'internalStudyId': data.internalstudyid,
      'hasAlert': data.HasAlert,
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  success(data: any) {
    let alertMessage = data.response[0].Result;
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: alertMessage,
      alertType: data.responseCode
    });
  }
  unSuccess(data: any) {
    this.notificationService.showNotification({
      alertHeader: data.statusText,
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }

  error(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
}
