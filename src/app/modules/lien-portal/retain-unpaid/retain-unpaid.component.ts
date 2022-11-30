import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignaturePad } from 'angular2-signaturepad';
import { DxDataGridComponent } from 'devextreme-angular';
import { CommonRegex } from 'src/app/constants/commonregex';
import { LienPortalAPIEndpoint, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
@Component({
  selector: 'app-retain-unpaid',
  templateUrl: './retain-unpaid.component.html',
  styleUrls: ['./retain-unpaid.component.css']
})
export class RetainUnpaidComponent implements OnInit {

  getfilterData: any;
  readonly commonRegex = CommonRegex;
  @Input()
  set filterData(val: any) {
    if (val && val != "") {
      this.getfilterData = val;
      this.getRetainUnPaidList();
    }
  }

  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder: 'test'
  };


  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  assignARform: FormGroup;
  receivePaymentform: FormGroup;
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  pageSize: number = 20;
  currentPageNumber: number = 1;
  columnResizingMode: string;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  applyFilterTypes: any;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  dataSource: any = [];
  retainARUnpaid: any = [];
  checkboxSelectedData: any = [];
  fundingCompanies = [];
  selecteFundComp: number = 0;
  firstName: string;
  lastName: string;
  radiologistSign: string;
  isDefaultSignature: boolean;
  defaultSignature: any;

  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService, private storageService: StorageService,
    private fb: FormBuilder) {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [
      {
        key: 'auto',
        name: 'Immediately',
      },
      {
        key: 'onClick',
        name: 'On Button Click',
      },
    ];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.assignARform = this.fb.group({
      fundingCompany: ['', Validators.required],
      firstName: [this.storageService.user.FirstName, Validators.required],
      lastName: [this.storageService.user.LastName, Validators.required],
      radiologistSign: ['', Validators.required]
    })
    this.receivePaymentform = this.fb.group({
      checkAmount: ['', [Validators.required]],
      checkDate: ['',Validators.required],
      checkNo: ['',Validators.required],
    })
  }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.RETAINED_AND_UNPAID);
    this.isDefaultSignature = this.lienPortalService.isDefaultSignature;
    this.bindFundComp_DDL();
    if(this.isDefaultSignature)
      this.GetRadDefaultSign();
  }

  getRetainUnPaidList() {
    this.dataSource = [];
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetRetainedUnPaid).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        if (res.result) {
          this.dataSource = res.result.retainedArUnPaidBatches;
          this.retainARUnpaid = this.dataSource;
          this.totalRecord = this.retainARUnpaid.length;
        }
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  changeCheckbox(item: any) {

    this.dataGrid.instance.expandRow((item.currentSelectedRowKeys[0]));
    setTimeout(() => {
      if (item) {
        this.checkboxSelectedData = item.selectedRowsData;
      }

      //selection

      if (item.currentSelectedRowKeys.length > 0) {
        var selectedbatchName = item.currentSelectedRowKeys[0].batchName;
        var chkBatch = document.getElementsByName(selectedbatchName);
        chkBatch.forEach(item => {
          var element = <HTMLInputElement>item;
          element.checked = true;
        });
      }

      //Deselection

      if (item.currentDeselectedRowKeys.length > 0) {
        var deSelectedbatchname = item.currentDeselectedRowKeys[0].batchName;
        var chkBatch = document.getElementsByName(deSelectedbatchname);
        this.dataGrid.instance.collapseRow((item.currentDeselectedRowKeys[0]));
        chkBatch.forEach(function (item) {
          var element = <HTMLInputElement>item;
          element.checked = false;
        });
      }
    }, 150);

  }

  drawComplete() {
    this.assignARform.patchValue({
      'radiologistSign': this.signaturePad.toDataURL()
    })
  }

  previewAssignment(){
    if(Number(this.assignARform.get("fundingCompany").value)){
      var retainSelectedData = [];
      this.checkboxSelectedData.map(data =>{
        data.retainedArUnPaidList.forEach(element => {
         var selectedData = {
          "patientId": element.patientId,
          "patientName": this.storageService.user.FirstName + this.storageService.user.LastName,
          "dateOfStudy": element.dateRead,
          "studyDescription": element.studyDescription,
          "cptGroup": element.cptGroup
         }
         retainSelectedData.push(selectedData);
        });
       });
      var request = {
          "pdfPreview": retainSelectedData,
          "radFirstName": this.storageService.user.FirstName,
          "radLastName": this.storageService.user.LastName,
          "fundingCompanyId": Number(this.assignARform.get("fundingCompany").value),
      }
      this.lienPortalService.PostAPI(request,LienPortalAPIEndpoint.AssignARPreviewAssignment).subscribe((res)=>{
        if(res.status == LienPortalResponseStatus.Success){
          this.lienPortalService.FilePreview(res.result);
        }
        else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
    else{
      this.lienPortalService.errorNotification(LienPortalStatusMessage.FUNDING_COMPANY_REQUIRED);
    }
  }

  GetRadDefaultSign(){
    let data = {};
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetRadDefaultSign).subscribe((res)=>{
      if (res.status == LienPortalResponseStatus.Success)
        this.defaultSignature = res.result.defaultSign
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    },()=>{
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'radiologistSign': ''
    })
  }

  bindFundComp_DDL() {
    let data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetFundingCompanyByUser).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result)
          this.fundingCompanies = result.result
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onMarkAsPaid() {
    if (this.receivePaymentform.valid) {
      var assignData = {
        batchId: this.checkboxSelectedData[0].lienFundingMappingId,
        checkAmount: parseInt(this.receivePaymentform.controls.checkAmount.value),
        checkDate: this.lienPortalService.convertDateFormat(this.receivePaymentform.controls.checkDate.value),
        checkNumber: this.receivePaymentform.controls.checkNo.value,
      }
      this.lienPortalService.PostAPI(assignData, LienPortalAPIEndpoint.ReceivePaymentForSelectStudy).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.closeReceivePaymentModal();
          this.lienPortalService.successNotification(LienPortalStatusMessage.PAYMENT_RECEIVE_SUCCESS);
          this.getRetainUnPaidList();
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
  }
  onAssignAR() {

    var request = [];
    if (this.assignARform.valid) {
      this.checkboxSelectedData.map(data => {
        data.retainedArUnPaidList.forEach(element => {
          var requestData = {
            'lienFundingId': element.lienFundingId,
            'cptGroup': element.cptGroup,
          }
          request.push(requestData);
        });
      });

      var assignData = {
        request: request,
        lienFundingMappingId: this.checkboxSelectedData[0].lienFundingMappingId,
        radiologistSign: this.assignARform.get("radiologistSign").value,
        firstName: this.assignARform.get("firstName").value,
        lastName: this.assignARform.get("lastName").value,
        fundingCompanyId: Number(this.assignARform.get("fundingCompany").value),
      }

      this.lienPortalService.PostAPI(assignData, LienPortalAPIEndpoint.MoveRetainARToAssignAR).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.closeAssignARModal();
          this.lienPortalService.successNotification(LienPortalStatusMessage.STUDIES_ASSIGNED_TO_FUNDING_CO);
          this.getRetainUnPaidList();
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
  }

  closeAssignARModal() {
    document.getElementById('AssignARFundingModal').setAttribute('data-dismiss', 'modal');
    document.getElementById('AssignARFundingModal').click();
  }

  closeReceivePaymentModal() {
    document.getElementById('ReceivePaymentModal').setAttribute('data-dismiss', 'modal');
    document.getElementById('ReceivePaymentModal').click();
  }

  clearModalPopup() {
    this.assignARform.reset();
    this.receivePaymentform.reset();
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'fundingCompany': '',
      'firstName': (this.storageService.user.FirstName) ? this.storageService.user.FirstName : '',
      'lastName': (this.storageService.user.LastName) ? this.storageService.user.LastName : '',
      'radiologistSign': ''
    });

    this.assignARform.patchValue({
      'checkAmount': '',
      'checkDate': '',
      'checkNo': '',
    });
    this.signaturePad.fromDataURL(this.defaultSignature);
    this.drawComplete();
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
    setTimeout(() => {
      this.checkboxSelectedData.forEach(element => {

        var chkBatch = document.getElementsByName(element.batchName);
        chkBatch.forEach(item => {
          var element = <HTMLInputElement>item;
          element.checked = true;
        });
      });
    }, 150);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
}
