import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/common/notification.service';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { LienConpanyModel } from '../lien-management/lien-management.component';

@Component({
  selector: 'app-add-lien-holding-company-popup',
  templateUrl: './add-lien-holding-company-popup.component.html',
  styleUrls: ['./add-lien-holding-company-popup.component.css']
})
export class AddLienHoldingCompanyPopupComponent implements OnInit {
  lienCompanyModel = {} as LienConpanyModel;
  LienConpaniesSubscription: Subscription | undefined;
   
   phoneNoPattern=  "^\\d{10}$";   
  @Input() public lienCompInfo: any;
  @ViewChild('f', { static: true }) f: NgForm | any;
  
  constructor(
    private activeModal: NgbActiveModal,
   
    private readonly notificationService: NotificationService,
  
    private readonly _radPortalService: RadPortalService,
  ) { }

  ngOnInit(): void {
    let _formData = JSON.parse(this.lienCompInfo);
    if (_formData) {
      this.lienCompanyModel = _formData

    } else {
      this.lienCompanyModel = {} as LienConpanyModel;

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
  onSubmit() {
    this.f.submitted=true;
    if(this.f.valid){
    const oModel: any = this.lienCompanyModel;
    this.ApiCallSubmitLienCompany(oModel, true);
  } else {
      return;
  }
  }
  ApiCallSubmitLienCompany(oModel: LienConpanyModel, loader: boolean) {
    if (this.LienConpaniesSubscription) {
      this.LienConpaniesSubscription.unsubscribe();
    }
    this.LienConpaniesSubscription = this._radPortalService.postLienHoldingCompany(loader, oModel).subscribe((res) => {
      if (res.response != null) {

        let result: any = res.response && res.response.josnData ? res.response.josnData : [];
        let _result = result && result[0].status ? result[0].status : '';
        if (_result === 'Success') {
          this.close(true);
        }
      }
      else {
        this.unSuccessNotification(res);
        return;
      }
    }, (err: any) => {
      this.errorNotification(err);
      return;
    });
  }
  close(loadApi: Boolean = false): void {
    this.activeModal.dismiss(loadApi);
  }
}
