import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/common/notification.service';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
//import { Event } from '../models/event';
//import { Type } from '../models/type';
//import { User } from '../models/user';
//import { dateTimeValidator, idValidator, keyValidator } from '../validators/validators';
//import { ModalResult } from '../models/enums';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { DatePipe } from '@angular/common';
import {
  DxDateBoxModule
} from 'devextreme-angular';
import { FacilityService } from 'src/app/services/facillities/facility.service';
declare const $: any;

@Component({
  selector: 'app-scheduler-popup',
  templateUrl: './scheduler-popup.component.html',
  styleUrls: ['./scheduler-popup.component.css'],
  providers: [DatePipe]
})

export class SchedulerPopupComponent implements OnInit {
  @ViewChild('hiddenDeleteLease', { static: false }) hiddenDeleteLease: ElementRef;
  @ViewChild('hiddenCheckFacilityPopupBtn', { static: false }) hiddenCheckFacilityPopupBtn: ElementRef;
  @ViewChild('hiddencheckAlreadyBlockedLeasePopup', { static: false }) hiddencheckAlreadyBlockedLeasePopup: ElementRef;
  @ViewChild('hiddenpastDateConfirm', { static: false }) hiddenpastDateConfirm: ElementRef;
  @Input() isNew: boolean;
  @Input() event: Event;
  @Input() mode: any;
  @Input() data: any;
  @Output() saved: EventEmitter<Event> = new EventEmitter();
  @Output() deleted: EventEmitter<Event> = new EventEmitter();
  FacilityName: string = '';
  FacilityID: string = '';
  LeaseId: number = 0;
  CreditId: number = 0;
  LeaseDetails: any[] = [];
  modalityResourcesList: any[] = [];
  schedulingDetailsList: any[] = [];
  CreditDetailsList: any[] = [];
  minutesList: any = [];
  checkFacilityHours: boolean = false;
  leaseForm: FormGroup;
  now = new Date();
  form: FormGroup;
  validateMessage: string = '';
  checkValidation: boolean = true;
  isLeaseSigned: boolean = false;
  TotalCreditAvailable: string = '0';
  TotalHoursLeased: string;
  facilityClosedDaysJSON: any = [];
  FacilityTimesJSON: any = [];
  creditReasonList: any = [];
  selectedresourceId = ""; selectedModality = ""; AlreadyBlockedLeaseList: any;
  selectedCreditReason = '';
  submitted: boolean = false;
  pastDate_start_date: string;
  pastDate_end_date: string;
  eventLeaseTime:any;

  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private facilityService: FacilityService
  ) { }

  ngOnInit(): void {
    //this.isLeaseSigned = true;
    this.createForm();
    this.leaseFormInitialization();
    if (this.data) {
      this.getTypes();
      this.FacilityName = this.data.FacilityName;
      this.FacilityID = this.data.FacilityID;
      //this.getfacilityClosedDaysSchdDetails();
      this.getModalityResourcesList();
      console.log(this.event);
      if (this.event) {
        if (this.event['LeaseId']) {
          this.LeaseId = this.event['LeaseId'];
          setTimeout(() => {
            this.getLeaseData();
          }, 300);
        } else {
          this.getTotalLeaseAndCreditHours();
        }
      }
    }
  }
  leaseFormInitialization() {
    this.leaseForm = this.formBuilder.group({
      LeaseTitle: [this.event['text']],
      modalityType: [''],
      contrastType: [''],
      start_date: [this.event['start_date']],
      start_time: [this.event['start_date']],
      end_date: [this.event['end_date']],
      end_time: [this.event['end_date']],
      creditReasonID: [''],
      creditHours: [''],
      creditMinutes: [''],
      CreditReasonText: [''],
    });
    this.setValidatorForleaseForm();
  }
  getLeaseData() {
    this.blockLeaseSchedulerService.getLeaseById(true, this.LeaseId).subscribe((res) => {
      if (res.response != null) {
        console.log(res.response)
        if (res.response.CreditDetails != null) {
          this.CreditDetailsList = res.response.CreditDetails[0];
          if (this.CreditDetailsList) {
            this.CreditId = this.CreditDetailsList['ID'];
            this.leaseForm.patchValue({
              creditReasonID: this.CreditDetailsList['CreditReasonId'],
              creditHours: this.CreditDetailsList['CreditHours'],
              creditMinutes: this.CreditDetailsList['CreditMins'],
              CreditReasonText: this.CreditDetailsList['CreditReasonText']
            });
          }
        }

        this.LeaseDetails = JSON.parse(res.response.LeaseDetails);
        if (this.LeaseDetails != null) {
          this.selectedresourceId = this.LeaseDetails['ResourceId'];

          if (this.LeaseDetails['TotalHoursLeased']) {
            this.TotalHoursLeased = this.LeaseDetails['TotalHoursLeased'].split(':')[0] + ' hours ' + this.LeaseDetails['TotalHoursLeased'].split(':')[1] + ' Minutes';
          }
          this.isLeaseSigned = this.LeaseDetails['LeaseSigned'] == '0' ? false : true;
          this.selectedModality = this.LeaseDetails['ModalityType'];
          console.log(this.LeaseDetails['Contrast'].toLocaleLowerCase());
          this.leaseForm.patchValue({
            LeaseTitle: this.LeaseDetails['LeaseTitle'],
            modalityType: this.selectedresourceId,
            contrastType: this.LeaseDetails['Contrast'].toLocaleLowerCase(),
          });
          $("optgroup#" + this.LeaseDetails['ModalityType'] + " > option[value='" + this.selectedresourceId + "']").attr("selected", "selected");

        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
    if (this.isLeaseSigned == true) {
      this.getCreditMins();
      this.getReasonData();
    }
  }
  setValidatorForleaseForm() {
    if (this.isLeaseSigned == true) {
      this.leaseForm.controls.creditReasonID.setValidators(this.setRequired());
      this.leaseForm.controls.creditHours.setValidators(this.setRequired());
      this.leaseForm.controls.creditMinutes.setValidators(this.setRequired());
      this.leaseForm.controls.CreditReasonText.setValidators(this.setRequired());

    } else {
      this.leaseForm.controls.modalityType.setValidators(this.setRequired());
      this.leaseForm.controls.contrastType.setValidators(this.setRequired());
      this.leaseForm.controls.start_date.setValidators(this.setRequired());
      this.leaseForm.controls.start_time.setValidators(this.setRequired());
      this.leaseForm.controls.end_date.setValidators(this.setRequired());
      this.leaseForm.controls.end_time.setValidators(this.setRequired());
    }
  }
  getReasonData() {
    this.creditReasonList = [];
    this.selectedCreditReason = '';
    let body = {
      Operation: 5
    }
    this.blockLeaseSchedulerService.addUpdateBlockLeaseCreditReason(true, body).subscribe((res) => {
      if (res.response != null) {
        this.creditReasonList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getCreditMins() {
    var x = 5;
    var tt = 0;
    for (var i = 0; tt < 60; i++) {
      var mm = (tt % 60);
      this.minutesList[i] = ("0" + mm).slice(-2);
      tt = tt + x;
    }
  }
  setRequired() {
    return [Validators.required];
  }
  changed(event: any) {
    this.selectedresourceId = event.target.value;
    const selectedIndex = event.target.selectedIndex;
    this.selectedModality = event.target.options[selectedIndex].parentNode.getAttribute('label');
    if (this.selectedModality) {
      this.MatchFacilityHours();
    }
  }
  senddatatoschd_facilities() {
    let body = {
      FacilityID: this.FacilityID,
      isShowSchedulingTab: true
    }
    this.facilityService.sendDataToschdFacilitiesWin(body);
    //this.modal.dismiss(ModalResult.CLOSE);
  }
  MatchFacilityHours() {
    this.checkValidation = true;
    if (Date.parse(this.editFormControls.end_date.value) < Date.parse(this.editFormControls.start_date.value)) {
      alert("End date should be greater than Start date"); this.checkValidation = false;
    }
    else if ((this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US'))) < this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US'))) {
      alert("End time should be greater than Start time"); this.checkValidation = false;
    } else {
      this.facilityClosedDaysJSON = []; this.FacilityTimesJSON = [];
      let body =
      {
        'facilityId': this.FacilityID,
        'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
        'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
        'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
        'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US')),
        'modality': this.selectedModality.toUpperCase(),
        'resourceId': this.selectedresourceId
      }
      this.blockLeaseSchedulerService.getAlreadyBlockedLease(true, body).subscribe((res) => {
        if (res.response != null) {
          this.checkValidation = false;
          this.AlreadyBlockedLeaseList = res.response;
          if (this.LeaseId) {
            if (this.AlreadyBlockedLeaseList.filter(a => a.leaseid != this.LeaseId).length > 0) {
              this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
              this.checkValidation = false;
            }
            else
              this.checkValidation = true;
          } else {
            this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
          }

        } else {
          this.validateFacilityTimeAndClosedDays(body);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }
  getTotalLeaseAndCreditHours() {
    let body =
    {
      'facilityId': this.FacilityID,
      'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
      'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
      'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
      'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US'))
    }
    this.blockLeaseSchedulerService.getTotalLeaseAndCreditHoursOnEdit(true, body).subscribe((res) => {
      if (res) {
        this.TotalHoursLeased = JSON.parse(res.response).LeaseHoursDetail;
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
  validateFacilityTimeAndClosedDays(body: any) {
    this.blockLeaseSchedulerService.validateFacilityTimeAndClosedDays(true, body).subscribe((res) => {
      if (res.response != null) {
        if (res.response[0].FacilityClosedDays) {
          this.facilityClosedDaysJSON = res.response[0].FacilityClosedDays;
        }
        if (res.response[0].FacilityTimes) {
          this.FacilityTimesJSON = res.response[0].FacilityTimes;
        }
        if (this.facilityClosedDaysJSON.length > 0 || this.FacilityTimesJSON.length > 0) {
          this.checkValidation = false;
          this.hiddenCheckFacilityPopupBtn.nativeElement.click();
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  saveBlockLeaseData() {
    if (this.checkValidation == true) {
      this.submitted = true;
      if (this.leaseForm.invalid) {
        return;
      }
      if (this.isLeaseSigned == true && this.LeaseId != 0) {
        this.saveCreditInfo();
      } else {
        let body = {
          'LeaseId': this.LeaseId,
          'facilityId': this.FacilityID,
          'modality': this.selectedModality.toUpperCase(),
          'Contrast': this.editFormControls.contrastType.value,
          'LeaseTitle': this.editFormControls.LeaseTitle.value,
          'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
          'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
          'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
          'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US')),
          'resourceId': this.selectedresourceId
        }
        this.blockLeaseSchedulerService.saveBlockLeaseData(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            this.showNotificationOnSucess(res);
            this.modal.dismiss(ModalResult.SAVE);
          }
        }, (err: any) => {
          this.errorNotification(err);
        });
      }
    }
  }
  saveCreditInfo() {
    let body = {
      'facilityId': this.FacilityID,
      'LeaseId': this.LeaseId,
      'CreditReasonId': this.editFormControls.creditReasonID.value,
      'CreditReasonText': this.editFormControls.CreditReasonText.value,
      'CreditHours': this.editFormControls.creditHours.value,
      'CreditMins': this.editFormControls.creditMinutes.value,
      'IsUseCredit': 0,
      'Operation': (this.CreditId) ? 2 : 1,
      'ID': this.CreditId
    }
    this.blockLeaseSchedulerService.manageCredits(true, body).subscribe((res) => {
      if (res.responseCode === 200) {
        this.showNotificationOnSucess(res);
        this.modal.close(ModalResult.SAVE);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getTotalHours(N: number) {
    return Array.from(Array(N), (_, i) => i + 1)
  }
  confirmPastDate(isValid: boolean) {
    if (!isValid) {
      if (this.pastDate_start_date) {
        this.leaseForm.patchValue({
          start_date: this.pastDate_start_date
        });
      }
      if (this.pastDate_end_date) {
        this.leaseForm.patchValue({
          end_date: this.pastDate_end_date
        });
      }
    }
    this.handleValueChange( this.eventLeaseTime,'')
  }
  handleValueChange(e: any, from: string) {
    this.eventLeaseTime = e;
    var currentDate = new Date(); this.pastDate_start_date = '';
    this.pastDate_end_date = '';
    const previousValue = e.previousValue;
    const newValue = e.value;
    const current_Date = new Date(currentDate.toLocaleDateString());
    const newValueDate = new Date(newValue.toLocaleDateString());
    if (from == 'start_date' || from == 'end_date') {
      if (from == 'start_date' && newValueDate < current_Date) {
        this.pastDate_start_date = previousValue;
        this.hiddenpastDateConfirm.nativeElement.click();
      }
      else if (from == 'end_date' && newValueDate < current_Date) {
        this.pastDate_end_date = previousValue;
        this.hiddenpastDateConfirm.nativeElement.click();
      }
    }
    if (previousValue != newValue) {
      this.getTotalLeaseAndCreditHours();
      if (this.selectedresourceId && this.selectedModality) {
        this.MatchFacilityHours();
      }
    }
  }

  compareById(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  compareByKey(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.key === c2.key : c1 === c2;
  }
  getModalityResourcesList() {
    this.modalityResourcesList = [];
    this.blockLeaseSchedulerService.getCalenderModalityResourceDropDownData(true, this.FacilityID).subscribe((res) => {
      if (res.response != null) {
        this.modalityResourcesList = res.response;
        console.log(this.modalityResourcesList);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  // getfacilityClosedDaysSchdDetails() {
  //   this.blockLeaseSchedulerService.getBlockLeasePopupData(true, this.FacilityID).subscribe((res) => {
  //     if (res.response != null) {
  //       this.schedulingDetailsList = res.response.schedulingDetails;
  //       this.facilityClosedDays = res.response.facilityClosedDays;
  //     }
  //   }, (err: any) => {
  //     this.errorNotification(err);
  //   });
  // }
  // oldMatchFacilityHours(Modality: string) {
  //   if (this.schedulingDetailsList) {
  //     var startColName, EndColName = '';
  //     var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  //     var start_dayName = days[this.editForm.start_date.value.getDay()];
  //     console.log(start_dayName);
  //     var end_dayName = days[this.editForm.end_date.value.getDay()];
  //     console.log(this.editForm.start_time.value);
  //     var leaseStart_Time = this.getTwentyFourHourTime(this.editForm.start_time.value);
  //     var leaseEnd_Time = this.getTwentyFourHourTime(this.editForm.end_time.value);
  //     if (Modality.toLocaleLowerCase() == 'mri') {
  //       startColName = `${start_dayName}OpenFrom`;
  //       EndColName = `${end_dayName}OpenTo`;
  //     }
  //     else if (Modality.toLocaleLowerCase() == 'xray') {
  //       startColName = `${start_dayName}XrayFrom`;
  //       EndColName = `${end_dayName}XrayTo`;
  //     }
  //     else if (Modality.toLocaleLowerCase() == 'ct') {
  //       startColName = `ct${start_dayName}OpenFrom`;
  //       EndColName = `ct${end_dayName}OpenTo`;
  //     }
  //     if (leaseStart_Time >= this.getTwentyFourHourTime(this.schedulingDetailsList[0][startColName]) && leaseEnd_Time <= this.getTwentyFourHourTime(this.schedulingDetailsList[0][EndColName])) {

  //       if (this.facilityClosedDays) {
  //         let dayName = this.editForm.start_date.value.toLocaleString('en-us', { weekday: 'long' }).toLocaleLowerCase();
  //         let dataClosed = this.facilityClosedDays.filter(get => get.Modality == Modality && get.day == dayName);
  //         if (dataClosed.length > 0) {
  //           if (dataClosed[0].IsClosed == true) {
  //             this.checkFacilityHours = false;
  //             this.hiddenCheckFacilityPopupBtn.nativeElement.click();
  //           }
  //           else
  //             this.checkFacilityHours = true;
  //         }
  //       }
  //     }
  //     else {
  //       this.checkFacilityHours = false;
  //       this.hiddenCheckFacilityPopupBtn.nativeElement.click();
  //     }
  //   }
  // }
  confirmFacilityPopup() {
    this.checkValidation = true;
  }
  getTwentyFourHourTime(time) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    const minutes = Number(time.match(/:(\d+)/)[1]);
    const AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && Number(hours) < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return `${sHours} : ${sMinutes}`;
  }



  private getTypes() {
    // this.offDays = [
    //   {
    //     "Id": 1,
    //     "Day": "Sunday",
    //     "Date": "2022-09-08"
    //   },
    //   {
    //     "Id": 2,
    //     "Day": "Monday",
    //     "Date": "2022-09-09"
    //   },     
    // ]
    // this.FacilityClosedDays = [
    //   {
    //     "Id": 1,
    //     "Day": "monday",
    //     "Date": "2022-09-08"
    //   },
    //   {
    //     "Id": 2,
    //     "Day": "Monday",
    //     "Date": "2022-09-09"
    //   },     
    // ]
    // this.typeService.get().subscribe((types: Type[]) => (this.types = types));
  }

  // private getUsers() {
  //   this.users = [
  //     {
  //       "id": 1,
  //       "name": "Leanne Graham",
  //       "username": "Bret",
  //       "email": "Sincere@april.biz",
  //       "address": {
  //         "street": "Kulas Light",
  //         "suite": "Apt. 556",
  //         "city": "Gwenborough",
  //         "zipcode": "92998-3874",
  //         "geo": {
  //           "lat": "-37.3159",
  //           "lng": "81.1496"
  //         }
  //       },
  //       "phone": "1-770-736-8031 x56442",
  //       "website": "hildegard.org",
  //       "company": {
  //         "name": "Romaguera-Crona",
  //         "catchPhrase": "Multi-layered client-server neural-net",
  //         "bs": "harness real-time e-markets"
  //       }
  //     },
  //     {
  //       "id": 2,
  //       "name": "Ervin Howell",
  //       "username": "Antonette",
  //       "email": "Shanna@melissa.tv",
  //       "address": {
  //         "street": "Victor Plains",
  //         "suite": "Suite 879",
  //         "city": "Wisokyburgh",
  //         "zipcode": "90566-7771",
  //         "geo": {
  //           "lat": "-43.9509",
  //           "lng": "-34.4618"
  //         }
  //       },
  //       "phone": "010-692-6593 x09125",
  //       "website": "anastasia.net",
  //       "company": {
  //         "name": "Deckow-Crist",
  //         "catchPhrase": "Proactive didactic contingency",
  //         "bs": "synergize scalable supply-chains"
  //       }
  //     },
  //     {
  //       "id": 3,
  //       "name": "Clementine Bauch",
  //       "username": "Samantha",
  //       "email": "Nathan@yesenia.net",
  //       "address": {
  //         "street": "Douglas Extension",
  //         "suite": "Suite 847",
  //         "city": "McKenziehaven",
  //         "zipcode": "59590-4157",
  //         "geo": {
  //           "lat": "-68.6102",
  //           "lng": "-47.0653"
  //         }
  //       },
  //       "phone": "1-463-123-4447",
  //       "website": "ramiro.info",
  //       "company": {
  //         "name": "Romaguera-Jacobson",
  //         "catchPhrase": "Face to face bifurcated interface",
  //         "bs": "e-enable strategic applications"
  //       }
  //     },
  //     {
  //       "id": 4,
  //       "name": "Patricia Lebsack",
  //       "username": "Karianne",
  //       "email": "Julianne.OConner@kory.org",
  //       "address": {
  //         "street": "Hoeger Mall",
  //         "suite": "Apt. 692",
  //         "city": "South Elvis",
  //         "zipcode": "53919-4257",
  //         "geo": {
  //           "lat": "29.4572",
  //           "lng": "-164.2990"
  //         }
  //       },
  //       "phone": "493-170-9623 x156",
  //       "website": "kale.biz",
  //       "company": {
  //         "name": "Robel-Corkery",
  //         "catchPhrase": "Multi-tiered zero tolerance productivity",
  //         "bs": "transition cutting-edge web services"
  //       }
  //     },
  //     {
  //       "id": 5,
  //       "name": "Chelsey Dietrich",
  //       "username": "Kamren",
  //       "email": "Lucio_Hettinger@annie.ca",
  //       "address": {
  //         "street": "Skiles Walks",
  //         "suite": "Suite 351",
  //         "city": "Roscoeview",
  //         "zipcode": "33263",
  //         "geo": {
  //           "lat": "-31.8129",
  //           "lng": "62.5342"
  //         }
  //       },
  //       "phone": "(254)954-1289",
  //       "website": "demarco.info",
  //       "company": {
  //         "name": "Keebler LLC",
  //         "catchPhrase": "User-centric fault-tolerant solution",
  //         "bs": "revolutionize end-to-end systems"
  //       }
  //     },
  //     {
  //       "id": 6,
  //       "name": "Mrs. Dennis Schulist",
  //       "username": "Leopoldo_Corkery",
  //       "email": "Karley_Dach@jasper.info",
  //       "address": {
  //         "street": "Norberto Crossing",
  //         "suite": "Apt. 950",
  //         "city": "South Christy",
  //         "zipcode": "23505-1337",
  //         "geo": {
  //           "lat": "-71.4197",
  //           "lng": "71.7478"
  //         }
  //       },
  //       "phone": "1-477-935-8478 x6430",
  //       "website": "ola.org",
  //       "company": {
  //         "name": "Considine-Lockman",
  //         "catchPhrase": "Synchronised bottom-line interface",
  //         "bs": "e-enable innovative applications"
  //       }
  //     },
  //     {
  //       "id": 7,
  //       "name": "Kurtis Weissnat",
  //       "username": "Elwyn.Skiles",
  //       "email": "Telly.Hoeger@billy.biz",
  //       "address": {
  //         "street": "Rex Trail",
  //         "suite": "Suite 280",
  //         "city": "Howemouth",
  //         "zipcode": "58804-1099",
  //         "geo": {
  //           "lat": "24.8918",
  //           "lng": "21.8984"
  //         }
  //       },
  //       "phone": "210.067.6132",
  //       "website": "elvis.io",
  //       "company": {
  //         "name": "Johns Group",
  //         "catchPhrase": "Configurable multimedia task-force",
  //         "bs": "generate enterprise e-tailers"
  //       }
  //     },
  //     {
  //       "id": 8,
  //       "name": "Nicholas Runolfsdottir V",
  //       "username": "Maxime_Nienow",
  //       "email": "Sherwood@rosamond.me",
  //       "address": {
  //         "street": "Ellsworth Summit",
  //         "suite": "Suite 729",
  //         "city": "Aliyaview",
  //         "zipcode": "45169",
  //         "geo": {
  //           "lat": "-14.3990",
  //           "lng": "-120.7677"
  //         }
  //       },
  //       "phone": "586.493.6943 x140",
  //       "website": "jacynthe.com",
  //       "company": {
  //         "name": "Abernathy Group",
  //         "catchPhrase": "Implemented secondary concept",
  //         "bs": "e-enable extensible e-tailers"
  //       }
  //     },
  //     {
  //       "id": 9,
  //       "name": "Glenna Reichert",
  //       "username": "Delphine",
  //       "email": "Chaim_McDermott@dana.io",
  //       "address": {
  //         "street": "Dayna Park",
  //         "suite": "Suite 449",
  //         "city": "Bartholomebury",
  //         "zipcode": "76495-3109",
  //         "geo": {
  //           "lat": "24.6463",
  //           "lng": "-168.8889"
  //         }
  //       },
  //       "phone": "(775)976-6794 x41206",
  //       "website": "conrad.com",
  //       "company": {
  //         "name": "Yost and Sons",
  //         "catchPhrase": "Switchable contextually-based project",
  //         "bs": "aggregate real-time technologies"
  //       }
  //     },
  //     {
  //       "id": 10,
  //       "name": "Clementina DuBuque",
  //       "username": "Moriah.Stanton",
  //       "email": "Rey.Padberg@karina.biz",
  //       "address": {
  //         "street": "Kattie Turnpike",
  //         "suite": "Suite 198",
  //         "city": "Lebsackbury",
  //         "zipcode": "31428-2261",
  //         "geo": {
  //           "lat": "-38.2386",
  //           "lng": "57.2232"
  //         }
  //       },
  //       "phone": "024-648-3804",
  //       "website": "ambrose.net",
  //       "company": {
  //         "name": "Hoeger LLC",
  //         "catchPhrase": "Centralized empowering task-force",
  //         "bs": "target end-to-end models"
  //       }
  //     }
  //   ]
  //   //this.userService.get().subscribe((users: User[]) => (this.users = users));
  // }

  private createForm() {
    this.form = this.formBuilder.group(
      {
        type: [null, [Validators.required]],
        user: [null, [Validators.required]],
        start_date: [this.now, [Validators.required]],
        end_date: [this.now, [Validators.required]],
        text: ['', Validators.required]
      },
      { updateOn: 'change' }
    );

    this.form.patchValue({ ...this.event });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  save() {
    const event = this.form.value as Event;
    this.saved.emit({ ...event });
    this.modal.close(ModalResult.SAVE);
  }

  close() {
    if (this.LeaseId)
      this.modal.dismiss(ModalResult.ESC);
    else
      this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    if (this.LeaseId)
      this.modal.dismiss(ModalResult.ESC);
    else
      this.modal.dismiss(ModalResult.CLOSE);
  }
  DeleteLease() {
    if (this.LeaseId != 0 && !this.isLeaseSigned) {
      this.blockLeaseSchedulerService.deleteLeaseById(true, this.LeaseId).subscribe((res) => {
        if (res.responseCode == 200) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.response.Message,
            alertType: res.responseCode
          });
          this.modal.dismiss(ModalResult.DELETE);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });

    }
  }
  confirmDelete() {
    this.hiddenDeleteLease.nativeElement.click();
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  get editFormControls() { return this.leaseForm.controls; }
}
export enum ModalResult {
  BACKDROP_CLICK = 0,
  ESC = 1,
  CLOSE = 3,
  CANCEL = 4,
  SAVE = 5,
  DELETE = 6
}
