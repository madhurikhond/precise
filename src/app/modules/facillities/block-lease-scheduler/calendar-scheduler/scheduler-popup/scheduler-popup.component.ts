import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/common/notification.service';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { DatePipe } from '@angular/common';
import {
  DxDateBoxModule
} from 'devextreme-angular';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { Console } from 'console';
import { CommonMethodService } from '../../../../../services/common/common-method.service';
import { AlertsRoutingModule } from 'src/app/modules/settings/RIS-settings/alerts/alerts-routing.module';

declare const $: any;

@Component({
  selector: 'app-scheduler-popup',
  templateUrl: './scheduler-popup.component.html',
  styleUrls: ['./scheduler-popup.component.css'],
  providers: [DatePipe]
})

export class SchedulerPopupComponent implements OnInit {
  @ViewChild('hiddenCheckFacilityPopupBtn', { static: false }) hiddenCheckFacilityPopupBtn: ElementRef;
  @ViewChild('hiddencheckAlreadyBlockedLeasePopup', { static: false }) hiddencheckAlreadyBlockedLeasePopup: ElementRef;
  @ViewChild('hiddenpastDateConfirm', { static: false }) hiddenpastDateConfirm: ElementRef;
  @ViewChild('hiddengreaterCreditTimePopUp', { static: false }) hiddengreaterCreditTimePopUp: ElementRef;
  @Input() isNew: boolean;
  @Input() event: Event;
  @Input() mode: any;
  @Input() data: any;
  @Output() saved: EventEmitter<Event> = new EventEmitter();
  @Output() deleted: EventEmitter<Event> = new EventEmitter();
  popupMessage: string = '';
  FacilityName: string = '';
  FacilityID: string = '';
  LeaseBlockId: number = 0;
  CreditId: number = 0;
  LeaseDetails: any[] = [];
  modalityResourcesList: any[] = [];
  schedulingDetailsList: any[] = [];
  CreditDetailsList: any[] = [];
  minutesList: any = [];
  checkFacilityHours: boolean = false;
  leaseForm: FormGroup;
  leaseBlockOffForm: FormGroup;
  now = new Date();
  form: FormGroup;
  validateMessage: string = '';
  isValidTimeAndClosedDays: boolean = true;
  isLeaseSigned: boolean = false;
  TotalCreditAvailable: string = '0';
  TotalBlockHours: string; TotalCreditHours: string;
  TotalLeaseHours: string;
  facilityClosedDaysJSON: any = [];
  FacilityTimesJSON: any = []; FacilityAutoBlockOffDays: any = [];
  creditReasonList: any = [];
  selectedresourceId = ""; selectedModality = ""; AlreadyBlockedLeaseList: any;
  selectedResourceName = '';
  selectedCreditReason = '';
  ResourceType = '';
  submitted: boolean = false;
  pastDate_start_date: string;
  modality_change = false;
  pastDate_end_date: string; IsAllModality: boolean = false;
  eventLeaseTime: any; isValidAlreadyBlockedLease: boolean = true; isBlockOffTime: boolean = true;
  dateTimeValidationMsg: string; LeaseId: string = ''; BlockOffDaysSubmitted: boolean = false;
  readonly dateTimeFormatCustom = DateTimeFormatCustom; isValidAlreadyBlockedOffLease: boolean = false;
  blockLeasePricingList: any = [];
  MriPrice: any = [];
  CtPrice: any = [];
  IsFacilityDetailsPopUpOpen: boolean = false;
  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private facilityService: FacilityService,
    private modalService: NgbModal,
    private readonly commonService: CommonMethodService,
    private fb: FormBuilder,
    private common: CommonMethodService
  ) { }

  ngOnInit(): void {
    // this.isLeaseSigned = true;
    this.createForm();
    this.leaseFormInitialization();
    if (this.data) {
      this.FacilityName = this.data.FacilityName;
      this.FacilityID = this.data.FacilityID;
      this.getModalityResourcesList();
      if (this.event) {
        if (this.event['LeaseBlockId']) {
          this.LeaseBlockId = this.event['LeaseBlockId'];
          document.getElementById('SaveBtn').style.display = 'none';
        } else {
          document.getElementById('SaveBtn').style.display = 'block';
        }
        this.getLeaseData();
      }
    }
    document.getElementById('deleteBtn').style.display = 'none';
    this.common.isFacilityDetailsPopUp.subscribe((value: any) => {
      if (value) {
        if (this.IsFacilityDetailsPopUpOpen) {
          this.IsFacilityDetailsPopUpOpen = !this.IsFacilityDetailsPopUpOpen;
          setTimeout(() => {
            document.body.className += ' modal-open';
          }, 1000);
        }
      }
    })
  }
  leaseFormInitialization() {
    var eTime = new Date(this.event['end_date']);
    eTime.setSeconds(eTime.getSeconds() + 1);
    this.leaseForm = this.formBuilder.group({
      //LeaseTitle: [this.event['text']],
      modalityType: [''],
      contrastType: [''],
      start_date: [this.event['start_date']],
      start_time: [this.event['start_date']],
      end_date: [this.event['end_date']],
      end_time: eTime,
      creditReasonID: [''],
      creditHours: [''],
      creditMinutes: [''],
      CreditReasonText: [''],
    });
    if (!this.event['LeaseBlockId']) {
      this.leaseBlockOffForm = this.formBuilder.group({
        modalityType: ['', Validators.required],
        start_date: [this.event['start_date'], Validators.required],
        start_time: [this.event['start_date'], Validators.required],
        end_date: [this.event['end_date'], Validators.required],
        end_time: [this.event['end_date'], Validators.required],
      });
    }
    if (this.mode == 'month') {
      this.leaseForm.patchValue({
        //  start_time: null,
        end_time: new Date("1/1/2019 12:05:00 AM")
      })
      if (!this.event['LeaseBlockId']) {
        this.leaseBlockOffForm.patchValue({
          start_time: null,
          end_time: null
        })
      }
    }
    this.setValidatorForleaseForm();
  }
  disableIt(event) {
    var which = event.which
    if (which === 13 || which === 9) {
      event.target.disabled = true
    }
  }
  getLeaseData() {

    this.blockLeaseSchedulerService.getBlockLeaseById(true, this.LeaseBlockId).subscribe((res) => {
      if (res.response != null) {
        if (res.response.CreditDetails != null) {
          this.CreditDetailsList = res.response.CreditDetails;
        }

        this.LeaseDetails = JSON.parse(res.response.LeaseDetails);

        if (this.LeaseDetails != null) {

          this.isLeaseSigned = this.LeaseDetails['LeaseSigned'] == '0' ? false : true;
          this.FacilityID = this.LeaseDetails['FacilityId'];
          this.selectedModality = this.LeaseDetails['ModalityType'];
          this.selectedresourceId = this.LeaseDetails['ResourceId'];
          this.ResourceType = this.LeaseDetails['Contrast'];
          // this.selectedResourceName = this.modalityResourcesList.filter(x => x.Modality == this.selectedModality).length > 0 ?
          //   this.modalityResourcesList.filter(x => x.Modality == this.selectedModality)[0].Resources.filter(x => x.INTERNALRESOURCEID == this.selectedresourceId).length > 0 ?
          //     this.modalityResourcesList.filter(x => x.Modality == this.selectedModality)[0].Resources.filter(x => x.INTERNALRESOURCEID == this.selectedresourceId)[0].RESOURCENAME : '' : ''
          this.selectedResourceName = this.LeaseDetails['RESOURCENAME'];
          this.LeaseId = this.LeaseDetails['leaseId'];
          this.setValidatorForleaseForm();
          if (this.LeaseId && !this.isLeaseSigned) {
            document.getElementById('deleteBtn').style.display = 'none';
            document.getElementById('SaveBtn').style.display = 'none';
          } else if (this.isLeaseSigned) {
            document.getElementById('SaveBtn').style.display = 'block';
            document.getElementById('deleteBtn').style.display = 'none';
          }
          else {
            document.getElementById('SaveBtn').style.display = 'block';
            document.getElementById('deleteBtn').style.display = 'block';
          }

          this.leaseForm.patchValue({
            // LeaseTitle: this.LeaseDetails['LeaseTitle'],
            modalityType: this.selectedresourceId,
            contrastType: this.LeaseDetails['Contrast'].toLocaleLowerCase(),
          });
          this.selectedresourceId = this.LeaseDetails['ResourceId'];
          $("optgroup#" + this.LeaseDetails['ModalityType'] + " > option[value='" + this.selectedresourceId + "']").attr("selected", "selected");
          this.getTotalLeaseAndCreditHours();
        }
        if (this.isLeaseSigned == true) {
          this.getCreditMins();
          this.getReasonData();
        }
        this.blockLeasePricingList = [];
        let data = [{ FacilityID: this.FacilityID, Operation: 5 }];
        this.facilityService.getBlockLeasePricing(true, data).subscribe((res) => {
          if (res.response != null) {
            this.MriPrice = [];
            this.CtPrice = [];
            this.blockLeasePricingList = res.response;
            this.addMriAndCtPrice(this.blockLeasePricingList);
          }
        });

      }
    }, (err: any) => {
      this.errorNotification(err);
    });

  }

  addMriAndCtPrice(data: any) {
    this.CtPrice = data.find(x => x.Modality == 'CT');
    this.MriPrice = data.find(x => x.Modality == 'MRI');
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
    this.leaseForm.updateValueAndValidity()
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

  changedOffDays(event: any) {
    this.selectedresourceId = event.target.value;
    this.selectedModality = "";
    this.IsAllModality = false;
    if (this.selectedresourceId != '0') {
      const selectedIndex = event.target.selectedIndex;
      this.modality_change = true;
      this.selectedModality = event.target.options[selectedIndex].parentNode.getAttribute('label');
    } else {
      this.modality_change = false;
      this.IsAllModality = true;
    }
    if (!this.isBlockOffTime)
      this.validateAutoBlockOffDays();

  }
  validateAutoBlockOffDays() {
    this.AlreadyBlockedLeaseList = [];
    let body =
    {
      'facilityId': this.FacilityID,
      'startDate': this.datePipe.transform(this.editBlockOffFormControls.start_date.value, 'yyyy-MM-dd'),
      'endDate': this.datePipe.transform(this.editBlockOffFormControls.end_date.value, 'yyyy-MM-dd'),
      'startTime': this.getTwentyFourHourTime(this.editBlockOffFormControls.start_time.value.toLocaleTimeString('en-US')),
      'endTime': this.getTwentyFourHourTime(this.editBlockOffFormControls.end_time.value.toLocaleTimeString('en-US')),
      'modality': this.selectedModality.toUpperCase(),
      'resourceId': this.selectedresourceId,
      'IsAllModality': this.IsAllModality
    }
    this.blockLeaseSchedulerService.getAlreadyBlockedOffDaysModalityBased(true, body).subscribe((res) => {
      if (res.response != null) {
        this.AlreadyBlockedLeaseList = res.response;
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  changed(event: any) {
    this.changedOffDays(event);
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
    this.IsFacilityDetailsPopUpOpen = true;
    //this.modal.dismiss(ModalResult.CLOSE);
  }
  MatchFacilityHours() {
    this.isValidTimeAndClosedDays = true;
    this.facilityClosedDaysJSON = []; this.FacilityTimesJSON = [];
    let body =
    {
      'facilityId': this.FacilityID,
      'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
      'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
      'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
      'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US')),
      'modality': this.selectedModality.toUpperCase(),
      'resourceId': this.selectedresourceId,
      'contrast': this.editFormControls.contrastType.value
    }
    this.blockLeaseSchedulerService.getAlreadyBlockedLease(true, body).subscribe((res) => {
      if (res.response != null) {
        this.AlreadyBlockedLeaseList = res.response;
        this.isValidAlreadyBlockedLease = false;
        if (this.LeaseBlockId) {
          if (this.AlreadyBlockedLeaseList.filter(a => a.LeaseBlockId != this.LeaseBlockId).length > 0) {
            this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
            this.isValidAlreadyBlockedLease = false;
          }
          else {
            this.isValidAlreadyBlockedLease = true;
            this.validateFacilityTimeAndClosedDays(body);
          }
        } else {
          this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
        }

      } else {
        this.isValidAlreadyBlockedLease = true;
        this.validateFacilityTimeAndClosedDays(body);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getTotalLeaseAndCreditHours() {
    let body =
    {
      'facilityId': this.FacilityID,
      'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
      'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
      'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
      'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US')),
      'leaseId': (this.LeaseBlockId) ? this.LeaseBlockId : 0,
    }
    this.blockLeaseSchedulerService.getTotalLeaseAndCreditHoursOnEdit(true, body).subscribe((res) => {
      debugger
      if (res.response) {
        if (res.response[0].BlockHours)
          this.TotalBlockHours = JSON.parse(res.response[0].BlockHours).LeaseHoursDetail;
        if (res.response[0].TotalCreditHours && this.CreditDetailsList.length > 0)
          this.TotalCreditHours = JSON.parse(res.response[0].TotalCreditHours).TotalCreditHours;
        if (res.response[0].TotalLeaseHours)
          //  alert('Total hours value: ' + res.response[0].TotalLeaseHours);
          this.TotalLeaseHours = JSON.parse(res.response[0].TotalLeasedHours).TotalLeaseHours;


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
        this.facilityClosedDaysJSON = [];
        this.FacilityTimesJSON = [];
        this.FacilityAutoBlockOffDays = [];
        if (res.response[0].FacilityClosedDays) {
          this.facilityClosedDaysJSON = res.response[0].FacilityClosedDays;
        }
        if (res.response[0].FacilityTimes) {
          this.FacilityTimesJSON = res.response[0].FacilityTimes;
        }
        if (res.response[0].FacilityAutoBlockOffDays) {
          this.FacilityAutoBlockOffDays = res.response[0].FacilityAutoBlockOffDays;
        }
        if (this.facilityClosedDaysJSON.length > 0 || this.FacilityTimesJSON.length > 0 || this.FacilityAutoBlockOffDays.length > 0) {
          if (this.modality_change || this.LeaseBlockId) {
            this.isValidTimeAndClosedDays = false;
            this.hiddenCheckFacilityPopupBtn.nativeElement.click();
          }
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  saveBlockLeaseData() {
    if (this.selectedModality.toUpperCase() == 'CT' && (this.CtPrice == null || this.CtPrice.LeaseRatePerHour == null || this.CtPrice.LeaseRatePerHour == "")) {
      this.notificationService.showNotification({
        alertHeader: '',
        alertMessage: "Pricing of the selected modality is not added. Please add the price for this facility before creating a block/lease",
        alertType: null
      });
      return;
    }
    if (this.selectedModality.toUpperCase() == 'MRI' && (this.MriPrice == null || this.MriPrice.LeaseRatePerHour == null)) {
      this.notificationService.showNotification({
        alertHeader: '',
        alertMessage: 'Pricing of the selected modality is not added. Please add the price for this facility before creating a block/lease',
        alertType: null
      });
      return;
    }

    if (!this.isBlockOffTime) {
      if (this.AlreadyBlockedLeaseList.length > 0) {
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      } else {
        this.submitted = false;
        this.BlockOffDaysSubmitted = true;
        if (this.leaseBlockOffForm.invalid) {
          return;
        }
        let body = {
          'facilityId': this.FacilityID,
          'modality': this.selectedModality.toUpperCase(),
          'startDate': this.datePipe.transform(this.editBlockOffFormControls.start_date.value, 'yyyy-MM-dd'),
          'endDate': this.datePipe.transform(this.editBlockOffFormControls.end_date.value, 'yyyy-MM-dd'),
          'startTime': this.getTwentyFourHourTime(this.editBlockOffFormControls.start_time.value.toLocaleTimeString('en-US')),
          'endTime': this.getTwentyFourHourTime(this.editBlockOffFormControls.end_time.value.toLocaleTimeString('en-US')),
          'resourceId': this.selectedresourceId,
          'IsAllModality': this.IsAllModality
        }
        this.blockLeaseSchedulerService.saveAutoBlockOffData(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            if (res.response) {
              this.showNotificationOnSucess({
                message: res.response.message,
                responseCode: res.responseCode
              });
              this.modal.dismiss(ModalResult.SAVE);
            }
            else {
              this.showNotificationOnSucess(res);
            }
            this.modal.dismiss(ModalResult.SAVE);
            this.commonService.sendDataBlockLeaseScheduler('true');
          }
        }, (err: any) => {
          this.errorNotification(err);
        });
      }
    }
    else if (this.isValidTimeAndClosedDays && this.isValidAlreadyBlockedLease) {
      this.BlockOffDaysSubmitted = false;
      this.submitted = true;
      if (this.leaseForm.invalid) {
        return;
      }
      if (this.isLeaseSigned == true && this.LeaseBlockId != 0) {
        this.saveCreditInfo();
      } else {
        let body = {
          'LeaseId': this.LeaseBlockId,
          'facilityId': this.FacilityID,
          'modality': this.selectedModality.toUpperCase(),
          'Contrast': this.editFormControls.contrastType.value,
          // 'LeaseTitle': this.editFormControls.LeaseTitle.value,
          'startDate': this.datePipe.transform(this.editFormControls.start_date.value, 'yyyy-MM-dd'),
          'endDate': this.datePipe.transform(this.editFormControls.end_date.value, 'yyyy-MM-dd'),
          'startTime': this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')),
          'endTime': this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US')),
          'resourceId': this.selectedresourceId
        }
        this.blockLeaseSchedulerService.saveBlockLeaseData(true, body).subscribe((res) => {
          if (res.responseCode == 200) {
            if (res.response) {
              this.showNotificationOnSucess({
                message: res.response.message,
                responseCode: res.responseCode
              });


            }
            else {
              this.showNotificationOnSucess(res);
            }
            this.modal.dismiss(ModalResult.SAVE);
          }
        }, (err: any) => {
          this.errorNotification(err);
        });
      }
    } else {
      if (!this.isValidTimeAndClosedDays)
        this.hiddenCheckFacilityPopupBtn.nativeElement.click();
      else
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
    }
  }
  saveCreditInfo() {


    let body = {
      'facilityId': this.FacilityID,
      'LeaseBlockId': this.LeaseBlockId,
      'LeaseId': this.LeaseId,
      'CreditReasonId': this.editFormControls.creditReasonID.value,
      'CreditReasonText': this.editFormControls.CreditReasonText.value,
      'CreditHours': this.editFormControls.creditHours.value,
      'CreditMins': this.editFormControls.creditMinutes.value,
      'IsUseCredit': 0,
      'Operation': 1
      //'Operation': (this.CreditId) ? 2 : 1,
      //'ID': this.CreditId
    }
    this.blockLeaseSchedulerService.manageCredits(true, body).subscribe((res) => {

      if (res.responseCode === 200) {
        this.showNotificationOnSucess(res);

        this.leaseFormInitialization();
        this.submitted = false;
        this.getLeaseData();

      }
      else if (res.responseCode === 404) {
        if (res.message) {
          this.popupMessage = res.message;
          this.hiddengreaterCreditTimePopUp.nativeElement.click();
        }
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
    setTimeout(() => {
      this.handleValueChange(this.eventLeaseTime, '')
    }, 500);

  }
  handleBlockOffDaysChange(e: any, from: string) {   
    this.AlreadyBlockedLeaseList = []; 
    var start_date = new Date(this.editBlockOffFormControls.start_date.value);
    var end_date = new Date(this.editBlockOffFormControls.end_date.value);
    if (this.editBlockOffFormControls.end_date.value != null) {
      if (Date.parse(end_date.toDateString()) < Date.parse(start_date.toDateString())) {
        this.leaseBlockOffForm.patchValue({
          end_date: null,
          end_time: null
        });
        this.dateTimeValidationMsg = "End date should be greater than Start date";
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      } else if (Date.parse(end_date.toDateString()) == Date.parse(start_date.toDateString()) && ((this.getTwentyFourHourTime(this.editBlockOffFormControls.end_time.value.toLocaleTimeString('en-US'))) <= this.getTwentyFourHourTime(this.editBlockOffFormControls.start_time.value.toLocaleTimeString('en-US')))) {
        this.leaseBlockOffForm.patchValue({
          end_time: null
        });
        this.dateTimeValidationMsg = "End time should be greater than Start time";
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      } else {
        if (this.selectedModality && !this.isBlockOffTime) {
          this.validateAutoBlockOffDays();
        }
      }
    }
  }
  handleValueChange(e: any, from: string) {
    this.AlreadyBlockedLeaseList = [];
    this.TotalBlockHours = '';
    this.TotalLeaseHours = '';
    this.eventLeaseTime = e;
    var currentDate = new Date(); this.pastDate_start_date = '';
    this.pastDate_end_date = '';
    const previousValue = e.previousValue;
    const newValue = e.value;
    let isValid = true;
    const current_Date = new Date(currentDate.toLocaleDateString());
    const newValueDate = new Date(newValue);
    var start_date = new Date(this.editFormControls.start_date.value);
    var end_date = new Date(this.editFormControls.end_date.value);
    if (this.editFormControls.end_date.value != null) {
      if (Date.parse(end_date.toDateString()) < Date.parse(start_date.toDateString())) {
        this.leaseForm.patchValue({
          end_date: null,
          end_time: null
        });
        this.dateTimeValidationMsg = "End date should be greater than Start date";
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      } else if (Date.parse(end_date.toDateString()) == Date.parse(start_date.toDateString()) && ((this.getTwentyFourHourTime(this.editFormControls.end_time.value.toLocaleTimeString('en-US'))) <= this.getTwentyFourHourTime(this.editFormControls.start_time.value.toLocaleTimeString('en-US')))) {
        this.leaseForm.patchValue({
          end_time: null
        });
        this.dateTimeValidationMsg = "End time should be greater than Start time";
        this.hiddencheckAlreadyBlockedLeasePopup.nativeElement.click();
      } else {
        if (from == 'start_date' || from == 'end_date') {
          if (from == 'start_date' && newValueDate < current_Date) {
            this.pastDate_start_date = previousValue;
            isValid = false;
            this.hiddenpastDateConfirm.nativeElement.click();
          }
          else if (from == 'end_date' && newValueDate < current_Date) {
            this.pastDate_end_date = previousValue; isValid = false;
            this.hiddenpastDateConfirm.nativeElement.click();
          }
        }
        if ((previousValue != newValue) && isValid) {
          this.getTotalLeaseAndCreditHours();
          if (this.selectedresourceId && this.selectedModality) {
            this.MatchFacilityHours();
          }
        }
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
        if (res.response.length > 0) {
          this.IsAllModality = true;
          this.modalityResourcesList = res.response;
        }
        else
          this.IsAllModality = false;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  confirmFacilityPopup() {
    this.isValidTimeAndClosedDays = true;
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

  private createForm() {
    // $(document).keydown(function (event) {
    //   if (event.keyCode == 27) {
    //     this.modal.dismiss(ModalResult.CLOSE);
    //   }
    // });
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
      alertMessage: data.response ? data.response.message : data.message,
      alertType: data.responseCode
    });
  }
  save() {
    const event = this.form.value as Event;
    this.saved.emit({ ...event });
    this.modal.close(ModalResult.SAVE);
  }

  close() {
    if (this.LeaseBlockId)
      this.modal.dismiss(ModalResult.BACKDROP_CLICK);
    else
      this.modal.dismiss(ModalResult.CLOSE);
  }
  changeScheduleType(checked: any) {
    this.leaseForm.patchValue({
      modalityType: "",
      contrastType: "",
    });
    this.leaseBlockOffForm.patchValue({
      modalityType: "",
    });
    this.AlreadyBlockedLeaseList = [];
    if (checked == "true")
      this.isBlockOffTime = true;
    else
      this.isBlockOffTime = false;
  }
  confirmDelete() {
    const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
    modalRef.componentInstance.LeaseBlockId = this.LeaseBlockId;
    modalRef.result
      .then()
      .catch((reason: ModalResult | any) => {
        if ((reason == 6)) {
          this.modal.dismiss(ModalResult.DELETE);
        }
      })
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }

  ClosePopup(te) {
    setTimeout(() => {
      $('body').addClass('modal-open')
    }, 500);
  }
  get editFormControls() { return this.leaseForm.controls; }
  get editBlockOffFormControls() { return this.leaseBlockOffForm.controls; }
}
export enum ModalResult {
  BACKDROP_CLICK = 0,
  ESC = 1,
  CLOSE = 3,
  CANCEL = 4,
  SAVE = 5,
  DELETE = 6,
  OTHER = 2
}
