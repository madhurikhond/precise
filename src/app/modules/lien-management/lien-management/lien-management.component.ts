import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/common/notification.service';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { AddLienHoldingCompanyPopupComponent } from '../add-lien-holding-company-popup/add-lien-holding-company-popup.component';
export interface LienConpanyModel {
  id: number;
  CompanyName: string;
  Address1: string;
  Address2: string;
  City: string;
  State: string;
  Zip: string;
  ContactName: string;
  Phone: string;
  Fax: string;
  TaxID: string;
  NotifyOfAssignment: string;
  Email1: string;
  Email2: string;
  Email3: string;
  OpType: string;
  ProcCodeName: string;
  SellPrice: string;
}
@Component({
  selector: 'app-lien-management',
  templateUrl: './lien-management.component.html',
  styleUrls: ['./lien-management.component.css']
})

export class LienManagementComponent implements OnInit {
  LienConpaniesList = [] as LienConpanyModel[];
  LienConpaniesSubscription: Subscription | undefined;
  lienCompanyModel = {} as LienConpanyModel;

  totalRecords: number = 0;
  columnResizingMode: string;
  resizingModes: string[] = ['widget', 'nextColumn'];
  currentFilter: any;
  applyFilterTypes: any;
  showHeaderFilter: boolean;
  showFilterRow: boolean;

  LienCompFilter = {} as any;
  @ViewChild('f', { static: true }) f: NgForm | any;

  constructor(
    
    private readonly notificationService: NotificationService,

    private readonly _radPortalService: RadPortalService,
    private _modalService: NgbModal,
  ) {
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.showFilterRow = true;
    this.SetFilter();
  }

  ngOnInit(): void {
    this.GetLientCompanies(this.LienCompFilter);
  }
  //// Common Method Start
  SetFilter() {
    this.LienCompFilter = {
      PageNumber: 1,
      PageSize: 20,
    }
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
  GetLientCompanies(filter?: any) {
    this.ApiCallGetLienCompanies(filter);
  }
  ApiCallGetLienCompanies(filter?: any) {
    if (this.LienConpaniesSubscription) {
      this.LienConpaniesSubscription.unsubscribe();
    }
    this.LienConpaniesSubscription = this._radPortalService.GetLienCompanies(filter.PageNumber,filter.PageSize,0).subscribe((res) => {
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
  onPageChange(event: any) {
    this.LienCompFilter.PageNumber = event;
    this.GetLientCompanies(this.LienCompFilter);
  }
  addLienHoldingComp() {
    const modalReff = this._modalService.open(AddLienHoldingCompanyPopupComponent,
      { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme modal-small' });
    modalReff.componentInstance.lienCompInfo = null;
    modalReff.result.then((res: any) => {
      //on close
      let loadApi: any = res ? res : false
      if (loadApi) {
        this.GetLientCompanies(this.LienCompFilter);
      }
    }, (reson) => {
      //on dismiss
      let loadApi: any = reson ? reson : false
      if (loadApi) {
        this.GetLientCompanies(this.LienCompFilter);
      }
    })
  }
  editLienComp(oModel: any): void {
    const modalReff = this._modalService.open(AddLienHoldingCompanyPopupComponent,
      { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme' });
    modalReff.componentInstance.lienCompInfo = JSON.stringify(oModel.data);;
    modalReff.result.then((res: any) => {
      //on close
      let loadApi: any = res ? res : false
      if (loadApi) {
        this.GetLientCompanies(this.LienCompFilter);
      }
    }, (reson) => {
      //on dismiss
      let loadApi: any = reson ? reson : false
      if (loadApi) {
        this.GetLientCompanies(this.LienCompFilter);
      }
    })
  }

}
