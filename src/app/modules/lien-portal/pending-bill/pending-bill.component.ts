import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { SignaturePad } from 'angular2-signaturepad';
import themes from 'devextreme/ui/themes';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { LienPortalPageTitleOption } from 'src/app/models/lien-portal-response';
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


  constructor(private lienPortalService: LienPortalService,
    private commonService: CommonMethodService, private storageService: StorageService,
    private fb: FormBuilder) {
    this.allMode = 'allPages';
    this.checkBoxesMode = themes.current().startsWith('material') ? 'always' : 'onClick';
    this.assignARform = this.fb.group({
      fundingCompany:['',Validators.required],
      firstName:[this.storageService.user.FirstName,Validators.required],
      lastName:[this.storageService.user.LastName,Validators.required],
      radiologistSign:['',Validators.required]
    })
  }

  ngOnInit(): void {
    this.commonService.setTitle(LienPortalPageTitleOption.PENDING_TO_BILL);
    this.bindFundComp_DDL();
  }

  onPageNumberChange(pageNumber: any) {
    this.currentPageNumber = pageNumber;
    if (pageNumber > 1)
      this.pageNumber = pageNumber - 1;
    else
      this.pageNumber = 0;
  }

  onMaterialGroupChange(event) {
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
    try {
      this.lienPortalService.GetPendingToBill(this.getfilterData).subscribe((result) => {
        if (result.status == 1) {
          this.totalRecord = result.result.length;
          this.dataSource = [];
          if (result.result && result.result.length > 0) {
            this.dataSource = result.result
          }
        }
        if (result.exception && result.exception.message) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  changeCheckbox(item: any) {
    if (item) {
      this.checkboxSelectedData = item.selectedRowsData;
    }
  }

  bindFundComp_DDL() {
    try {
      var data = {
        "loggedPartnerId": this.storageService.PartnerId,
        "jwtToken": this.storageService.PartnerJWTToken,
        "userId": this.storageService.user.UserId
      };

      this.lienPortalService.GetFundingCompanyByUser(data).subscribe((result) => {
        if (result.status == 1) {
          if (result.result && result.result.length > 0) {
            this.fundingCompanies = result.result
          }
        }
        if (result.exception && result.exception.message) {
          this.lienPortalService.errorNotification(result.exception.message);
        }
      }, (error) => {
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
      })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  drawComplete() {
    this.assignARform.patchValue({
      'radiologistSign': this.signaturePad.toDataURL()
    })
  }

  onAssignAR() {
    try {
      if(this.assignARform.valid){
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
          fundingCompanyId: Number(this.assignARform.get("fundingCompany").value),
          loggedPartnerId: this.storageService.PartnerId,
          jwtToken: this.storageService.PartnerJWTToken,
          userId: Number(this.storageService.user.UserId)
        }
       this.lienPortalService.AssignARStudiesToRadiologist(assignData).subscribe((res)=>{
        if(res.status == 1){
          this.closeAssignARModal();
          this.lienPortalService.successNotification('Studies assigned to Funding Co. Successfully');
          this.getListingData();
        }
       },(error)=>{
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
       })
     }
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  closeAssignARModal(){
    document.getElementById('signatureModal').setAttribute('data-dismiss','modal');
    document.getElementById('signatureModal').click();
   }

   closeRetainARModal(){
    document.getElementById('RetainedARModal').setAttribute('data-dismiss','modal');
    document.getElementById('RetainedARModal').click();
   }

  onRetainAR(){
    try {
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
        loggedPartnerId: this.storageService.PartnerId,
        jwtToken: this.storageService.PartnerJWTToken,
        userId: this.storageService.user.UserId
      }
      this.lienPortalService.RetainARStudies(assignData).subscribe((res)=>{
        if(res.status == 1){
          this.closeRetainARModal();
          this.lienPortalService.successNotification('Studies Retained Successfully');
          this.getListingData();
        }
      },(error)=>{
        if (error.message) {
          this.lienPortalService.errorNotification(error.message);
        }
       })
    } catch (error) {
      if (error.message) {
        this.lienPortalService.errorNotification(error.message);
      }
    }
  }

  clearModalPopup(){
    this.assignARform.reset();
    this.signaturePad.clear();
    this.assignARform.patchValue({
      'fundingCompany': '',
      'firstName': this.storageService.user.FirstName,
      'lastName': this.storageService.user.LastName,
      'radiologistSign':''
    });
  }

}
