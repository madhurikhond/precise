import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-facility-billing',
  templateUrl: './facility-billing.component.html',
  styleUrls: ['./facility-billing.component.css']
})
export class FacilityBillingComponent implements OnInit {
  @ViewChild('searchBtn', { static: true }) searchBtnRef: ElementRef;
  pageNumber: number = 1;
  pageSize: number = 20;
  GridData: Array<object> = [];
  filterBody: any = {};
  totalFacility: number;
  public searchBtnModal: any;
  facilityBillingForm: FormGroup;
  dropdownListModiality: any = [];
  dropdownListFacility: any = [];
  facilityDepartment: any = [];
  isTodayAppointment: any = false;
  tabConstant: string;
  patientIdText: any = '';
  Modiality: string = '';
  Facility: string = '';



  constructor(private fb: FormBuilder,
    private readonly facilityService: FacilityService, private readonly storageService: StorageService, private readonly router: Router,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.getdropdownList();
    this.GetFacilityDepartment();
    this.facilityBillingForm = this.fb.group({
      patientIdText: [''],
      lastNameText: [''],
      firstNameText: [''],
      dobText: [''],
      Modiality: [''],
      Facility: ['']
    });
    this.commonMethodService.setTitle('Front Desk Portal');
  }

//Method To Get Drop Down list 
  getdropdownList() {
    this.facilityService.GetFrontDeskFacilityModalityDropDown(true).subscribe((res) => {
      if (res.response != null) {
        this.dropdownListFacility = res.response.facilityList;
        this.dropdownListModiality = res.response.modalityList;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  getApplyFilter(patientID: any, lastName: any, firstName: any, dob: any, isTodayAppointment: boolean,
    modality: any, facility: any): any {
    return {
      'patientID': patientID.toString(), 'lastName': lastName, 'firstName': firstName,
      'dob': dob, 'isTodayAppointment': isTodayAppointment, 'modality': modality, 'facility': facility
    }
  }

  GetFacilityDepartment() {
    //var usertype = JSON.parse(localStorage.getItem('_cr_u_infor')).usertype;
    // if (usertype.toLowerCase() === 'precise imaging employee' ){
    //   this.facilityDepartment=[]; 
    //   this.router.navigate([`facilities/facility-billing/radflow-billing`]);
    // }else{
    //     this.facilityService.GetFacilityDepartment(true).subscribe((res) => {
    //       console.log(res.response);
    //       if (res.response != null) {               
    //             var FacilityDId = this.facilityService.GetUserFacilityDept()[0];
    //             let AllData = res.response;  this.facilityDepartment=[];                 
    //             if(FacilityDId!='0'){
    //               for(let i=0;i<AllData.length;i++){                    
    //                 if(FacilityDId.indexOf(AllData[i].FacilityDId) == -1 ) {
    //                   AllData.splice(i,1);                 
    //                 }
    //               }
    //               this.tabConstant = AllData[0].FacilityConstant;              
    //               this.facilityDepartment = AllData;
    //               this.router.navigate([`facilities/facility-billing/${this.facilityDepartment[0].FacilityConstant}`]);
    //           }
    //           else{
    //             this.router.navigate(['dashboard']);
    //           }
    //       }
    //     }, (err: any) => {
    //       this.errorNotification(err);
    //     });
    //  }
    this.router.navigate([`facilities/facility-billing/front-desk`]);
  }

  getTabIndex(Constant: string) {
    this.tabConstant = Constant
  }


  searchFacility() {
    let patientId = this.facilityBillingForm.controls.patientIdText.value;
    let lastName = this.facilityBillingForm.controls.lastNameText.value;
    let firstName = this.facilityBillingForm.controls.firstNameText.value;
    let dob = this.facilityBillingForm.controls.dobText.value;
    let Modiality = this.facilityBillingForm.controls.Modiality.value;
    let Facility = this.facilityBillingForm.controls.Facility.value;
    // if (this.tabConstant === 'billing') {
    //   this.facilityService.getFacilityBillingFilterText(patientId, lastName, firstName, dob, this.isTodayAppointment, Modiality, Facility);
    // }
    // else if (this.tabConstant === 'front-desk') {
      this.facilityService.getFrontDeskFilterText(patientId, lastName, firstName, dob, this.isTodayAppointment, Modiality, Facility);
    // }
    // var usertype = JSON.parse(localStorage.getItem('_cr_u_infor')).usertype;
    // if (usertype.toLowerCase() === 'precise imaging employee') {
    //   this.facilityService.getRadFlowFacilityBillingFilterText(patientId, lastName, firstName, dob, this.isTodayAppointment, Modiality, Facility); // for RadFlow     
    // }
  }
  clearFacility() {
    this.facilityBillingForm.reset();
    this.searchFacility();
  }
}
