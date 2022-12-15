import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DxDataGridComponent } from 'devextreme-angular';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

enum actionDropdown {
  remove = 'remove',
  edit_payment = 'edit_payment',
}

@Component({
  selector: 'app-funding-co-paid',
  templateUrl: './funding-co-paid.component.html',
  styleUrls: ['./funding-co-paid.component.css']
})
export class FundingCoPaidComponent {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getfilterData = val;
      this.getFundingCoPaidList();
    }
  }

  _actionDropdown = actionDropdown;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild("modal_open") modal_open: ElementRef;
  @ViewChild("modal_edit_payment_close") modal_edit_payment_close: ElementRef;
  @ViewChild("modal_remove_close") modal_remove_close: ElementRef;

  checkBoxesMode: string;
  selectedData: any = [];
  isSelectAll: boolean = false;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  currentPageNumber: number = 1;
  pageSize: number = 20;

  dataSource: any = [];
  fundingCoPaid: any = [];
  checkboxSelectedData: any;
  paymentForm: FormGroup;
  defaultCheckDate = new Date();
  selectedAction = "";


  constructor(private lienPortalService: LienPortalService, private commonService: CommonMethodService, private fb: FormBuilder) {
    this.allMode = 'page';
    this.checkBoxesMode = 'always';


    this.paymentForm = this.fb.group({
      checkDate: [this.defaultCheckDate, Validators.required],
      checkNumber: ['', Validators.required],
      checkAmount: [0, Validators.required]
    })
  }

  private getFundingCoPaidList() {
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetFundingCompanyPaidList).subscribe(res => {
      if (res.status == LienPortalResponseStatus.Success) {
        this.totalRecord = 0;
        this.dataSource = [];
        if (res.result) {
          var data = res.result;
          this.dataSource = data;
          this.fundingCoPaid = this.dataSource;
          this.totalRecord = this.fundingCoPaid.length;
          this.fundingCoPaid.forEach(element => {
            this.dataGrid.instance.collapseRow(element);
          });
        }
      } else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onSelectAll(isChecked) {
    if (isChecked)
      this.dataGrid.instance.selectAll();
    else
      this.dataGrid.instance.deselectAll();
  }

  changeCheckbox($event: any) {
    this.selectedData = $event.selectedRowsData;
    if (this.dataGrid.instance.totalCount() == $event.selectedRowsData.length)
      this.isSelectAll = true;
    else if ($event.selectedRowsData.length == 0)
      this.isSelectAll = false;
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  downloadPDF(data) {
    if (data.fileName)
      this.lienPortalService.downloadFile(data.fileName, data.fileByte);
  }

  showDocManager(patientId: any) {
    this.commonService.sendDataToDocumentManager(patientId);
  }

  onAction() {
    if (this.selectedData == 0) {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.FUNDING_COMPANY_PAID_RECORD);
    }

    if (this.selectedAction != "" && this.selectedData != 0){
      this.paymentForm.patchValue({
        checkAmount : this.selectedData[0].checkAmount,
        checkDate : this.selectedData[0].checkDate,
        checkNumber : this.selectedData[0].checkNumber
      });
      this.modal_open.nativeElement.click();
    }
  }

  clearPaymentForm() {
    this.paymentForm.patchValue({
      checkNumber: '',
      checkDate: this.defaultCheckDate
    });

    this.selectedAction = "";
  }

  onSubmitPayment() {
    if (this.paymentForm.valid && this.selectedData.length > 0) {
      var data = {
        "paymentId": this.selectedData[0].paymentId,
        "checkAmount": Number(this.paymentForm.get('checkAmount').value),
        "checkNumber": this.paymentForm.get('checkNumber').value,
        "checkDate": this.lienPortalService.convertDateFormat(this.paymentForm.get('checkDate').value),
      }
      this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.EditPaymentInformation).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.PAYMENT_DELETED_SUCCESS);
          this.getFundingCoPaidList();
          this.modal_edit_payment_close.nativeElement.click();
          this.selectedAction = "";
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      });
    }
  }

  removePayment(){
    if(this.selectedData.length > 0){
      var data = {
        'paymentId': this.selectedData[0].paymentId
      };
      this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.RemovePayment).subscribe((res)=>{
        if (res.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.PAYMENT_RECEIVE_SUCCESS);
          this.getFundingCoPaidList();
          this.modal_remove_close.nativeElement.click();
          this.selectedAction = "";
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      },()=>{
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
  }
}
