import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalAPIEndpoint, LienPortalFundingCoPermission, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-funding-co-unpaid',
  templateUrl: './funding-co-unpaid.component.html',
  styleUrls: ['./funding-co-unpaid.component.css']
})
export class FundingCoUnpaidComponent {
  isSelectedAll: boolean = false;
  selectedData: any = [];
  getFilterData: any;
  defaultCheckDate = new Date();
  permission : any;
  permissionTitle = LienPortalFundingCoPermission.PayForAR;
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getFilterData = val;
      this.getListingData();
      this.setPermission();
    }
  }
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  @ViewChild("modal_close") modal_close: ElementRef;

  dataSource: any = [];

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  pageSize: number = 20;
  currentPageNumber = 1;
  paymentForm: FormGroup;

  constructor(private fb: FormBuilder, private lienPortalService: LienPortalService, private commonService: CommonMethodService,
    private storageService : StorageService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';

    this.paymentForm = this.fb.group({
      checkDate: [this.defaultCheckDate, Validators.required],
      checkNumber: ['', Validators.required],
      checkAmount: [0, Validators.required]
    })

    this.commonService.setTitle(LienPortalPageTitleOption.UNPAID);
  }

  private getListingData() {
    this.lienPortalService.PostAPI(this.getFilterData, LienPortalAPIEndpoint.GetFundingCompanyUnpaidList).subscribe((result) => {
      this.totalRecord = 0;
      this.dataSource = [];
      this.dataGrid.instance.deselectAll();
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
          this.dataSource = result.result;
          this.totalRecord = this.dataSource.length;
          this.dataSource.forEach(element => {
            this.dataGrid.instance.collapseRow(element);
          });
        }
      }
      else
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

  onSelectCheckbox($event) {
    this.selectedData = $event.selectedRowsData;
    let amount = 0;
    if (this.selectedData.length > 0) {
      let data = this.selectedData.map((data) => {
        return data.batchWiseData.reduce(function (_this, val) {
          return _this + val.arPrice
        }, 0)
      });
      amount = data.reduce(function (val1, val2) { return val1 + val2 });
    }
    this.paymentForm.patchValue({ checkAmount: amount })

    if (this.dataGrid.instance.totalCount() == $event.selectedRowsData.length)
      this.isSelectedAll = true;
    else
      this.isSelectedAll = false;
  }

  clearPaymentForm() {
    this.paymentForm.patchValue({
      checkNumber: '',
      checkDate: this.defaultCheckDate
    });
  }

  onSubmitPayment() {
    if (this.paymentForm.valid && this.selectedData.length > 0) {
      var data = this.paymentForm.value;
      data.checkDate = this.lienPortalService.convertDateFormat(data.checkDate);
      data.request = this.selectedData.map(value => ({ lienFundingMappingId: value.batchId }));
      this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.LienPayment).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.PAYMENT_RECEIVE_SUCCESS);
          this.getListingData();
          this.modal_close.nativeElement.click();
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      });
    }
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

  setPermission() {
    if (this.storageService.permission.length > 0) {
      var permission :any= this.storageService.permission;
      permission = permission.filter(val => val.PageTitle == LienPortalFundingCoPermission.LienFundingCompany);
      if(permission.length > 0){
        var data = permission[0].Children.filter(val => val.PageTitle == this.permissionTitle);
        if(data.length == 1)
          this.permission = data[0];
      }
    }
  }
}
