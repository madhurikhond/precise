import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { SettingsService } from 'src/app/services/settings.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import { tabModel } from '../../reading-rad-portal/reading-rad-portal/reading-rad-portal.component';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-rad-portal-tab',
  templateUrl: './rad-portal-tab.component.html',
  styleUrls: ['./rad-portal-tab.component.css']
})
export class RadPortalTabComponent implements OnInit {
  financialTypeList: any = [];
  statusList: any = [];
  tab0Model = {} as tabModel;
  tab1Model = {} as tabModel;
  tab2Model = {} as tabModel;
  tab3Model = {} as tabModel;
  radPortalTabs = [] as any;
  @ViewChild('f', { static: true }) f: NgForm | any;
  @ViewChild('f1', { static: true }) f1: NgForm | any;
  @ViewChild('f2', { static: true }) f2: NgForm | any;
  @ViewChild('f3', { static: true }) f3: NgForm | any;
  selectedTab = 0;
  
  constructor(
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService,
    private readonly _radPortalService: RadPortalService,
    private readonly workFlowService: WorkflowService,
    private cdr: ChangeDetectorRef ,
    private readonly commonMethodService : CommonMethodService 
  ) { }

  ngOnInit(): void {
    this.getFinancialType();
    this.getDropdown();
    this.getRadPortalTabs();
    this.commonMethodService.setTitle('Rad Portal Settings');
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  getRadPortalTabs() {
    this._radPortalService.getRadPortalTabs().subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response ? res.response : [];
        this.radPortalTabs = result;
        this.tab0Model = this.radPortalTabs[0];
        this.tab1Model = this.radPortalTabs[1];
        this.tab2Model = this.radPortalTabs[2];
        this.tab3Model = this.radPortalTabs[3];
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getFinancialType() {
    this.settingsService.getMasterFinancialTypes().subscribe((res) => {

      if (res.response != null) {
        this.financialTypeList = res.response;
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getDropdown() {
    this.workFlowService.getActionNeededDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.statusList = data.response.statusList;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }
  //// Common Method Start
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
  onUpdate0Tab(): void {
    if (this.f.valid) {
      let oModel = {};
      oModel = this.tab0Model;
      this.ApiCallUpdateTab(oModel, true);
    }
    else {
      return;
    }
  }
  onUpdate1Tab(): void {
    if (this.f1.valid) {
      let oModel = {};
      oModel = this.tab1Model;
      this.ApiCallUpdateTab(oModel, true);
    }
    else { return }
  }
  onUpdate2Tab(): void {
    if (this.f2.valid) {
      let oModel = {};
      oModel = this.tab2Model;
      this.ApiCallUpdateTab(oModel, true);
    }
    else {
      return
    }
  }
  onUpdate3Tab(): void {
    
    if (this.f3.valid) {
      let oModel = {};
      oModel = this.tab3Model;
      this.ApiCallUpdateTab(oModel, true);
    }
    else {
      return
    }
  }
  ApiCallUpdateTab(oModel: any, loader: boolean) {
    this._radPortalService.updateRadPortalTab(loader, oModel).subscribe((res) => {
      if (res.response != null) {
        let result: any = res.response && res.response.jsonData ? res.response.jsonData[0] : {};
        if (result.error === 'Success') {
          this.successNotification(res);
        } else {
          this.errorNotification(res);
        }
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  selectTab(i: any) {
    this.selectedTab = i; 
  }
}
