import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalAPIEndpoint, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-pending-signature',
  templateUrl: './pending-signature.component.html',
  styleUrls: ['./pending-signature.component.css']
})
export class PendingSignatureComponent implements OnInit {

  isSelectAll: boolean = false;
  selectedData: any = [];
  getfilterData: any;
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

  signaturePadOptions: Object = {
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 100,
    Placeholder: 'test'
  };

  dataSource: any = [];

  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  totalRecord: number = 0;
  currentPageNumber: number = 1;
  pageSize: number = 20;
  signatureForm: FormGroup;
  isDefaultSignature: boolean;
  defaultSignature: string;

  constructor(private lienPortalService: LienPortalService,
    private fb: FormBuilder,
    private storageService: StorageService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';

    this.signatureForm = this.fb.group({
      firstName: [this.storageService.user.FirstName, Validators.required],
      lastName: [this.storageService.user.LastName, Validators.required],
      fundingCompanySign: ['', Validators.required],
      baseUrl:[window.location.origin]
    })
  }

  ngOnInit(): void {
    this.getFundingCompanySetting();
  }

  getListingData() {
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetPendingSignature).subscribe((result) => {
      this.totalRecord = result.result.length;
      this.dataSource = [];
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

  clearSign(): void {
    this.signaturePad.clear();
    this.signatureForm.patchValue({ fundingCompanySign: '' });
    this.signaturePad.fromDataURL(this.defaultSignature);
  }

  signatureCompleted() {
    this.signatureForm.patchValue({ fundingCompanySign: this.signaturePad.toDataURL() });
  }

  onSelectAll(isChecked) {
    if (isChecked)
      this.dataGrid.instance.selectAll();
    else
      this.dataGrid.instance.deselectAll();
  }

  onSelectCheckbox($event) {
    this.selectedData = $event.selectedRowsData;
    if (this.dataGrid.instance.totalCount() == $event.selectedRowsData.length)
      this.isSelectAll = true;
    else if ($event.selectedRowsData.length == 0)
      this.isSelectAll = false;
  }

  clearSignatureForm() {
    this.signatureForm.patchValue({
      fundingCompanySign: ''
    });
  }

  onSubmitSignature() {
    if (this.signatureForm.valid && this.selectedData.length > 0) {
      var data = this.signatureForm.value;
      data.request = this.selectedData.map(value => ({ lienFundingMappingId: value.batchId }));
      this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.SaveFundingCompany).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.lienPortalService.successNotification(LienPortalStatusMessage.SIGNATURE_UPDATED_SUCCESS);
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

  getFundingCompanySetting(){
    var data = {};
    this.lienPortalService.PostAPI(data,LienPortalAPIEndpoint.GetFundingCompanySetting).subscribe(res=>{
      if(res.status == LienPortalResponseStatus.Success){
        // console.log(res);
        var data = res.result;
        this.isDefaultSignature = data.isDefaultSignature;
        if(data.defaultSign.defaultSign)
        this.defaultSignature = data.defaultSign.defaultSign;
          this.signaturePad.fromDataURL(data.defaultSign.defaultSign);
      } else
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    },() => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

}
