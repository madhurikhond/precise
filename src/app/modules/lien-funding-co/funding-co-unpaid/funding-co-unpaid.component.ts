import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-funding-co-unpaid',
  templateUrl: './funding-co-unpaid.component.html',
  styleUrls: ['./funding-co-unpaid.component.css']
})
export class FundingCoUnpaidComponent implements OnInit {
  isSelectAll: boolean = false;
  selectedData: any = [];
  getfilterData: any;
  defaultCheckDate = new Date();
  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getfilterData = val;
      this.getListingData();
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

  constructor(private fb: FormBuilder, private lienPortalService: LienPortalService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';

    this.paymentForm = this.fb.group({
      checkDate: [""],
      checkNumber: [this.defaultCheckDate, Validators.required],
      checkAmount: [0, Validators.required]
    })
  }

  ngOnInit(): void {
  }

  getListingData() {
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetFundingCompanyUnpaidList).subscribe((result) => {
      this.totalRecord = result.result.length;
      this.dataSource = [];
      this.dataGrid.instance.deselectAll();
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result)
          this.dataSource = result.result;
          this.totalRecord = this.dataSource.length;
          this.dataSource.forEach(element => {
            this.dataGrid.instance.collapseRow(element);
          });
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

    // if (this.dataGrid.instance.totalCount() > 1) {
    //   if ($event.currentSelectedRowKeys.length == 1)
    //     this.dataGrid.instance.expandRow(($event.currentSelectedRowKeys[0]));
    //   else if ($event.currentDeselectedRowKeys.length == 1)
    //     this.dataGrid.instance.collapseRow(($event.currentDeselectedRowKeys[0]));
    // }

    if (this.dataGrid.instance.totalCount() == $event.selectedRowsData.length)
      this.isSelectAll = true;
    else if ($event.selectedRowsData.length == 0)
      this.isSelectAll = false;
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


}
