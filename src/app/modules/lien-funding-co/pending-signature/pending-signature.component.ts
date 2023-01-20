import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalAPIEndpoint, LienPortalFundingCoPermission, LienPortalPageTitleOption, LienPortalResponse, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/services/common/storage.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-pending-signature',
  templateUrl: './pending-signature.component.html',
  styleUrls: ['./pending-signature.component.css']
})
export class PendingSignatureComponent {

  isSelectedAll: boolean = false;
  selectedData: any = [];
  getFilterData: any;
  permission : any;
  permissionTitle = LienPortalFundingCoPermission.SignForAssignAR;

  @Input()
  set filterData(val: any) {
    if (val && val != null) {
      this.getFilterData = val;
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
  isDefaultNamesEnable : boolean;
  isDefaultSignature: boolean;
  defaultSignature: string;

  constructor(private lienPortalService: LienPortalService,
    private fb: FormBuilder, private commonService: CommonMethodService,
    private storageService: StorageService) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.setPermission();
    this.getFundingCompanySetting();
    this.signatureForm = this.fb.group({
      firstName: [(this.permission &&  this.permission.IsAdd === 'true' && this.isDefaultNamesEnable)? this.storageService.user.FirstName : '', Validators.required],
      lastName: [(this.permission &&  this.permission.IsAdd === 'true' && this.isDefaultNamesEnable) ? this.storageService.user.LastName : '', Validators.required],
      fundingCompanySign: ['', Validators.required],
      baseUrl: window.location.origin
    })
    this.commonService.setTitle(LienPortalPageTitleOption.PENDING_SIGNATURE);
  }

  private getListingData() {
    this.pageNumber = 0;
    this.currentPageNumber = 1;
    
    this.lienPortalService.PostAPI(this.getFilterData, LienPortalAPIEndpoint.GetPendingSignature).subscribe((result) => {
      this.totalRecord = 0;
      this.dataSource = [];
      if (result.status == LienPortalResponseStatus.Success) {
        if (result.result) {
          this.totalRecord = result.result.length;
          this.dataSource = result.result;
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

  clearSign(): void {
    this.signaturePad.clear();
    this.signatureForm.patchValue({ fundingCompanySign: '' });
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
      this.isSelectedAll = true;
    else
      this.isSelectedAll = false;
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
          this.lienPortalService.successNotification(LienPortalStatusMessage.ASSIGNED_AR_EXECUTED);
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

  private getFundingCompanySetting() {
    var data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetFundingCompanySetting).subscribe(res => {
      if (res.status == LienPortalResponseStatus.Success) {
        if (res.result) {
          var data = res.result;
          this.isDefaultNamesEnable = data.isDefaultNamesEnable;
          this.isDefaultSignature = data.isDefaultSignature;
          if (data.defaultSign) {
            if (data.defaultSign.defaultSign) {
              this.defaultSignature = data.defaultSign.defaultSign;
              this.signaturePad.fromDataURL(data.defaultSign.defaultSign);
            }
          }
        }
      } else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  clearModalPopup() {
    this.signatureForm.reset();
    this.signaturePad.clear();
    this.signatureForm.patchValue({
      firstName: (this.permission && this.permission.IsAdd === 'true' && this.isDefaultNamesEnable) ? this.storageService.user.FirstName : '',
      lastName: (this.permission &&  this.permission.IsAdd === 'true' && this.isDefaultNamesEnable) ? this.storageService.user.LastName : '',
      fundingCompanySign: '',
      baseUrl: window.location.origin
    });
    if (this.isDefaultSignature) {
      this.signaturePad.fromDataURL(this.defaultSignature);
      this.signatureForm.controls.fundingCompanySign.setValue(this.defaultSignature);
    }
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  showDocManager(patientId: any) {
    this.commonService.sendDataToDocumentManager(patientId);
  }

  downloadPDF(data) {
    if (data.fileName)
      this.lienPortalService.downloadFile(data.fileByte);
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
  onCollapse(){
    this.dataGrid.instance.collapseAll(-1);
  }
  onExpand(){
    this.dataGrid.instance.expandAll(-1);
  }
}
