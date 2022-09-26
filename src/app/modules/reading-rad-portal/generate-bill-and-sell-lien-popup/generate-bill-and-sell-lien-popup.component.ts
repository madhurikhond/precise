import { ChangeDetectorRef, Component, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SignaturePad } from 'angular2-signaturepad';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { LienConpanyModel } from '../../lien-management/lien-management/lien-management.component';
import { tabModel } from '../reading-rad-portal/reading-rad-portal.component';
export interface SellLien {
  Id: number;
  SellStudyTo: number;
  SellStudiesTo: string;
  signature: string,
  FirstName: string,
  LastName: string,
  LienCompName: string,
  ProcCodeName: string,
  SellPrice: number,
  INTERNALSTUDYID: number,
  lienManagementInput: LienConpanyModel;
}

@Component({
  selector: 'app-generate-bill-and-sell-lien-popup',
  templateUrl: './generate-bill-and-sell-lien-popup.component.html',
  styleUrls: ['./generate-bill-and-sell-lien-popup.component.css']
})
export class GenerateBillAndSellLienPopupComponent implements OnInit {
  LienConpaniesList = [] as LienConpanyModel[];
  LienConpaniesDetails = {} as LienConpanyModel;
  LienConpaniesSubscription: Subscription | undefined;
  LienConpanyDetailsSubscription: Subscription | undefined
  totalRecords: number = 0;
  SellLienModel = {} as SellLien;
  isLockedTable = true as any;
  SubmitSellLienSubscription: Subscription | undefined;
  @ViewChild('f', { static: true }) f: NgForm | any;
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
    'minWidth': 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200
  };
  currentUser = {} as any;
  tab1Model = {} as tabModel;
  radPortalTabs = [] as any;


  constructor(
    private activeModal: NgbActiveModal,
    private readonly _radPortalService: RadPortalService,
    private readonly notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.SellLienModel.SellStudiesTo = '';
    let _cur = localStorage.getItem('_cr_u_infor');
    this.currentUser = JSON.parse(_cur);
    this.SellLienModel.FirstName = this.currentUser.firstname ? this.currentUser.firstname : '';
    this.SellLienModel.LastName = this.currentUser.lastname ? this.currentUser.lastname : '';
  }

  ngOnInit(): void {
    this.GetLientCompanies();
    this.getRadPortalTabs();
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 5);
      this.signaturePad.clear();
    }
  }
  getRadPortalTabs() {
    this._radPortalService.getRadPortalTabs().subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response ? res.response : [];
        this.radPortalTabs = result;
        this.tab1Model = this.radPortalTabs[1];
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  drawComplete() {
    let base64bit: any = this.signaturePad.toDataURL();
    let arr = base64bit.split(',');
    let _base64bit = arr[1];
    this.SellLienModel.signature = _base64bit;
  }
  clearSign(): void {
    this.signaturePad.clear();
  }
  unSuccessNotification(res: any) {

    this.notificationService.showNotification({
      alertHeader: 'No record found.',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  successNotification(res: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  GetLientCompanies() {
    this.ApiCallGetLienCompanies();
  }
  ApiCallGetLienCompanies() {
    if (this.LienConpaniesSubscription) {
      this.LienConpaniesSubscription.unsubscribe();
    }
    this.LienConpaniesSubscription = this._radPortalService.GetLienCompanies(1,20,0).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonData ? res.response.jsonData : [];
        this.LienConpaniesList = result && result[0].lienHoldingCompanies ? result[0].lienHoldingCompanies : [];
        this.totalRecords = result && result[0].TotalRecords ? result[0].TotalRecords : 0;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  changeLienComp(event: any) {
    let ProcCodeName: any = event.target.value;
    let selectedIndex: number = event.target['selectedIndex'];
    let SellPrice = event.target.options[selectedIndex].getAttribute('ProcSellPrice');
    let SellStudyTo = event.target.options[selectedIndex].getAttribute('SellStudyTo');
    this.SellLienModel.SellStudyTo = parseInt(SellStudyTo);
    this.SellLienModel.ProcCodeName = ProcCodeName;
    this.SellLienModel.SellPrice = SellPrice;
    if (SellStudyTo) { this.GetLientCompanyDetails(SellStudyTo); } else { this.SellLienModel.lienManagementInput = null }
  }
  toggle(event: any) {
    let isChecked = event.target.checked;
    if (isChecked) {
      this.isLockedTable = false;
    } else {
      this.isLockedTable = true;
    }
  }
  OnSellLiens(): void {
    if (this.f.valid) {
      let oModel: any = {};
      oModel = this.SellLienModel;
      this._radPortalService.setLienCompany(oModel);
    } else {
      return;
    }
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(loadApi);
  }
  GetLientCompanyDetails(id?: number) {
    this.ApiCallGetLienCompanyDetails(id, true);
  }
  ApiCallGetLienCompanyDetails(id, loader: boolean) {
    if (this.LienConpanyDetailsSubscription) {
      this.LienConpanyDetailsSubscription.unsubscribe();
    }
    this.LienConpanyDetailsSubscription = this._radPortalService.GetLienCompanyDetails(id, loader).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonResult ? res.response.jsonResult : [];
        this.LienConpaniesDetails = result && result[0].lienHoldingCompanyDetails[0] ? result[0].lienHoldingCompanyDetails[0] : {};
        this.SellLienModel.lienManagementInput = this.LienConpaniesDetails;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
}
