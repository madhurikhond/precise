import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalAPIEndpoint, LienPortalPageTitleOption, LienPortalResponseStatus, LienPortalStatusMessage } from 'src/app/models/lien-portal-response';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pending-bill',
  templateUrl: './pending-bill.component.html',
  styleUrls: ['./pending-bill.component.css']
})
export class PendingBillComponent implements OnInit {

  getfilterData: any;
  @Input()
  set filterData(val: any) {
    if (val && val != "") {
      this.getfilterData = val;
      this.getListingData();
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

  radiologistSign: string;

  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  assignARform: FormGroup;
  dataSource = [];
  checkBoxesMode: string;
  allMode: string;
  pageNumber: number = 0;
  currentPageNumber: number = 1;
  totalRecord: number = 0;
  pageSize: number = 20;
  fundingCompanies = [];
  checkboxSelectedData: any = [];
  isDefaultSignature: boolean;
  defaultSignature: any;

  constructor(private lienPortalService: LienPortalService,
    private commonService: CommonMethodService, private storageService: StorageService,
    private fb: FormBuilder) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.assignARform = this.fb.group({
      fundingCompany: ['', Validators.required],
      firstName: [this.storageService.user.FirstName, Validators.required],
      lastName: [this.storageService.user.LastName, Validators.required],
      radiologistSign: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.PENDING_TO_BILL);
    this.bindFundComp_DDL();
    this.GetRadiologistSettings();
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  clearSign(): void {
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'radiologistSign': ''
    })
  }

  showDocManager(patientId: any) {
    this.commonService.sendDataToDocumentManager(patientId);
  }

  getListingData() {
    this.lienPortalService.PostAPI(this.getfilterData, LienPortalAPIEndpoint.GetPendingToBill).subscribe((result) => {
      if (result.status == LienPortalResponseStatus.Success) {
        this.totalRecord = result.result.length;
        this.dataSource = [];
        if (result.result)
          this.dataSource = result.result
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  changeCheckbox(item: any) {
    if (item) {
      this.checkboxSelectedData = item.selectedRowsData;
    }
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

  previewAssignment() {
    if (Number(this.assignARform.get("fundingCompany").value)) {
      var checkboxSelectedData = this.checkboxSelectedData.map(data => ({
        patientId: data.patientId,
        patientName: this.storageService.user.FirstName + this.storageService.user.LastName,
        dateOfStudy: data.dateOfStudy,
        studyDescription: data.study,
        cptGroup: data.cptGroup
      }));
      var request = {
        "pdfPreview": checkboxSelectedData,
        "radFirstName": this.storageService.user.FirstName,
        "radLastName": this.storageService.user.LastName,
        "fundingCompanyId": Number(this.assignARform.get("fundingCompany").value),
      }
      this.lienPortalService.PostAPI(request, LienPortalAPIEndpoint.AssignARPreviewAssignment).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success)
          this.lienPortalService.FilePreview(res.result);
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
    else {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.FUNDING_COMPANY_REQUIRED);
    }
  }

  drawComplete() {
    this.assignARform.patchValue({
      'radiologistSign': this.signaturePad.toDataURL()
    })
  }

  onAssignAR() {

    if (this.assignARform.valid) {
      var checkboxSelectedData = this.checkboxSelectedData.map(data => ({
        patientId: data.patientId,
        internalStudyId: data.internalStudyId,
        cptGroup: data.cptGroup
      }));

      var assignData = {
        request: checkboxSelectedData,
        radiologistSign: this.assignARform.get("radiologistSign").value,
        firstName: this.assignARform.get("firstName").value,
        lastName: this.assignARform.get("lastName").value,
        fundingCompanyId: Number(this.assignARform.get("fundingCompany").value)
      }

      this.lienPortalService.PostAPI(assignData, LienPortalAPIEndpoint.AssignARStudiesToRadiologist).subscribe((res) => {
        if (res.status == LienPortalResponseStatus.Success) {
          this.closeAssignARModal();
          this.lienPortalService.successNotification(LienPortalStatusMessage.STUDIES_ASSIGNED_TO_FUNDING_CO);
          this.getListingData();
        }
        else
          this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      }, () => {
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
      })
    }
  }

  closeAssignARModal() {
    document.getElementById('signatureModal').setAttribute('data-dismiss', 'modal');
    document.getElementById('signatureModal').click();
  }

  closeRetainARModal() {
    document.getElementById('RetainedARModal').setAttribute('data-dismiss', 'modal');
    document.getElementById('RetainedARModal').click();
  }

  onRetainAR() {

    var checkboxSelectedData = this.checkboxSelectedData.map(data => ({
      patientId: data.patientId,
      internalStudyId: data.internalStudyId,
      cptGroup: data.cptGroup
    }));
    var assignData = {
      request: checkboxSelectedData,
      radiologistSign: null,
      firstName: this.assignARform.get("firstName").value,
      lastName: this.assignARform.get("lastName").value,
      fundingCompanyId: 0,
    }
    this.lienPortalService.PostAPI(assignData, LienPortalAPIEndpoint.RetainARStudies).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        this.closeRetainARModal();
        this.lienPortalService.successNotification(LienPortalStatusMessage.STUDIES_RETAINED_SUCCESS);
        this.getListingData();
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }

  clearModalPopup() {
    this.assignARform.reset();
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'fundingCompany': '',
      'firstName': this.storageService.user.FirstName,
      'lastName': this.storageService.user.LastName,
      'radiologistSign': ''
    });
    this.signaturePad.fromDataURL(this.lienPortalService.defaultSignature);
    this.drawComplete();
  }

  GetRadiologistSettings() {

    var data = {};
    this.lienPortalService.PostAPI(data, LienPortalAPIEndpoint.GetRadiologistSettings).subscribe((res) => {
      if (res.status == LienPortalResponseStatus.Success) {
        var data = res.result;
        this.lienPortalService.isDefaultSignature = data.isDefaultSignature;
        if (this.lienPortalService.isDefaultSignature)
          this.defaultSignature = data.defaultSign.defaultSign == null ? '' : data.defaultSign.defaultSign;
          this.lienPortalService.defaultSignature = this.defaultSignature;
      }
      else
        this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    }, () => {
      this.lienPortalService.errorNotification(LienPortalStatusMessage.COMMON_ERROR);
    })
  }
}
