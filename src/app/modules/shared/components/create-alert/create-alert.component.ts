import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { CreateAlertService } from 'src/app/services/create-alert/createalert.service';
import { ckeConfig } from 'src/app/constants/Ckeditor';
import { StorageService } from 'src/app/services/common/storage.service';
import { CommonRegex } from 'src/app/constants/commonregex';
declare const $: any;

@Component({
  selector: 'app-create-alert',
  templateUrl: './create-alert.component.html',
  styleUrls: ['./create-alert.component.css'],
  providers: [],
})
export class CreateAlertComponent implements OnInit {

  alertList: any = [];
  reasonFilter: any = [];
  reasonList: any = [];
  patientIdExists: any = [];
  addPhoneChecked: boolean = false
  patientIdModel: string = '';
  smsTextModel: string = '';
  attInfoList: any = [];
  refPhyInfoList: any = [];
  brokerInfoList: any = [];
  patientInfoList: any = [];
  retainInfoList: any = [];
  submitted = false;
  isContactModelShow: boolean = false;
  userList: any = [];
  contactInfoForm: FormGroup;
  attFax: boolean = false;
  faxSend: string;
  emailSend: string;
  phoneSend: string;
  modalValue: string = 'modal';
  patientFieldDisable: boolean = false;
  alertButtonClick: boolean = false;
  readonly CkeConfig = ckeConfig;
  Issubmitted: boolean = false;
  IsPatientPhoneSent = false;
  name = 'ng2-ckeditor';
  //ckeConfig: CKEDITOR.config;
  ckeConfig: any;
  ckConfig: any;
  mycontent: string;
  Alert: any;
  Reason: any;
  smsBody: any;
  log: string = '';
  defaultContactBody: any;
  doctorAsDefaultContact: any;
  attorneyAsDefaultContact: any;
  slackSend : any ;
  UserSlackId :any ;
  slackUserName : any ;
  IsSendSlackChecked :any 
  isEmailSentSuccessfully : any ;
  isFaxSentSuccessfully : any ;
  isSlackSentSuccessfully  : any ;
  isSmsSentSuccessfully : any;
  readonly commonRegex=CommonRegex;
  @ViewChild('hiddenCreateAlertPopUpButton', { static: false }) hiddenCreateAlertPopUpButton: ElementRef;
  @ViewChild('CheckSmsEmailSlackFax', { static: false }) CheckSmsEmailSlackFax: ElementRef;
  constructor(private fb: FormBuilder,
    private readonly commonService: CommonMethodService, private readonly storageService: StorageService,
    private readonly notificationService: NotificationService,
    private readonly CreateAlertService: CreateAlertService) { }

  ngOnInit(): void {
    this.commonService.createAlertPopUpObservable.subscribe((res) => {

      this.alertButtonClick = res;
      this.hiddenCreateAlertPopUpButton.nativeElement.click();
      this.getDropdown();

    }, (err: any) => {
    })
    this.contactInfoForm = this.fb.group({
      emailSubModel: ['', Validators.required],
      emailBodyModel: ['', Validators.required],
      notesModel: '',
      patientHeaderModel: ['', Validators.required],
      patientID: ['', Validators.required],
      alertType: ['', Validators.required],
      reason: ['', Validators.required],
      infoAttorneyName: 'N/A',
      infoAttorneyFax: 'N/A',
      IsAttorneyFax: false,
      infoAttorneyPhone: 'N/A',
      isAttorneyPhone: false,
      infoAttorneyEmail: 'N/A',
      IsAttorneyEmail: false,
      infoRefPhyName: 'N/A',
      InfoRefPhyFax: 'N/A',
      IsRefPhyFax: false,
      infoRefPhyPhone: 'N/A',
      isRefPhyPhone: false,
      infoRefPhyEmail: 'N/A',
      IsRefPhyEmail: false,
      InfoPatientName: 'N/A',
      InfoPatientFax: 'N/A',
      IsPatientFax: false,
      infoPatientPhone: 'N/A',
      IsPatientPhone: false,
      infoPatientEmail: 'N/A',
      IsPatientEmail: [''],
      infoBrokerName: 'N/A',
      InfoBrokerMainEmail: 'N/A',
      IsBrokerMainEmail: false,
      InfoBrokerBillingEmail: 'N/A',
      IsBrokerBillingEmail: false,
      InfoBrokerAPEmail: 'N/A',
      IsBrokerAPEmail: false,
      InfoBrokerMainFax: 'N/A',
      IsBrokerMainFax: false,
      InfoBrokerBillingFax: 'N/A',
      IsBrokerBillingFax: false,
      InfoBrokerAPFax: 'N/A',
      IsBrokerAPFax: false,
      infoAdditionalFax1:['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      infoAdditionalFax2: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      infoAdditionalFax3: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      infoAdditionalEmail1: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      infoAdditionalEmail2: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      infoAdditionalEmail3: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      infoAdditionalPhone1:  ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      infoAdditionalPhone2:['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      infoAdditionalPhone3: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      SmsTextModel: ['', Validators.required],
      AddtionalDeskFax: false,
      AddtionalDeskEmail: false,
      AddtionalDeskSms: false
    });

    this.isContactModelShow = false;
    setTimeout(() => {
      $('.ck-editor__editable').focus()
    }, 200
    );
  }
  onClickToolbarButton() {
    $('#cke_editor1').remove()
    $('#cke_1_top').remove()
  }
  onChange($event: any): void {

    //this.log += new Date() + "<br />";
  }


  updatePatientAttRefData() {
    let emailBody = {
      'Alert': this.Alert,
      'Reason': this.Reason
    }
    this.CreateAlertService.patientAttRefData(JSON.stringify(JSON.stringify(emailBody))).subscribe((res) => {
      if (res.responseCode === 200) {
        this.defaultContactBody = JSON.parse(res.response)[0].defaultContact;
        if (this.defaultContactBody == "Doctor") {
          this.doctorAsDefaultContact = true;
        }
        else if (this.defaultContactBody == "Attorney") {
          this.attorneyAsDefaultContact = true;
        }
        else {
          this.doctorAsDefaultContact = true;
          this.attorneyAsDefaultContact = true;
        }
      }
    },
      (err: any) => {

      });
  }
  onPaste($event: any): void {

    //this.log += new Date() + "<br />";
  }
  getDropdown() {
    this.CreateAlertService.getAlertTypes(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.alertList = data.response.alertList;
        this.reasonFilter = data.response.reasonList;
        this.userList = data.response.userList;
      }
      else {
      }
    },
      (err: any) => {

      });
  }
  onAlertChange(Alert) {
    this.Alert = Alert;
    this.reasonList = '';
    this.contactInfoForm.patchValue({ alertType: Alert });
    if (Alert != '' || Alert != null) {
      this.reasonList = this.reasonFilter.filter(function (el) {
        return el.Alerttype == Alert;
      });
    }
    else {

    }
  }
  onReasonChange(Reason) {
    this.Reason = Reason;
    this.contactInfoForm.patchValue({ reason: Reason });
    var a;
    if (Reason != '' || Reason != null) {
      a = this.reasonList.filter(function (el) {
        return el.Reason == Reason;
      });
      var emailSubject: string = a[0].DefaultEmailSubject;
      this.smsBody = a[0].DefaultSms;
      var emailBody: string = a[0].DefaultBody;
      this.contactInfoForm.patchValue({
        emailSubModel: a[0].DefaultEmailSubject,
        emailBodyModel: a[0].DefaultBody,
      })
      this.updateSubjectBody();
      this.updatePatientAttRefData()
    }
    else {
    }
  }
  showContactInfo(PatientID) {
    PatientID = PatientID.toLowerCase().includes('pre') ? PatientID : 'PRE' + PatientID;
    if (this.contactInfoForm.get('patientID').value != PatientID) {
      if (PatientID && this.alertButtonClick) {
        this.patientFieldDisable = true;
      } else {
        this.patientFieldDisable = false;
      }
      this.contactInfoForm.patchValue({ patientID: PatientID })
      this.CreateAlertService.getPatientRefAttInfoForAlert(true, PatientID).subscribe((res) => {
        var data: any = res;
        if (data.response != null) {
          this.ClearInfoList();
          if (data.response.attInfoList != null) { this.attInfoList = data.response.attInfoList[0]; }
          if (data.response.refPhyList != null) { this.refPhyInfoList = data.response.refPhyList[0]; }
          if (data.response.brokerInfoList != null) { this.brokerInfoList = data.response.brokerInfoList[0] }
          if (data.response.patientInfoList != null) { this.patientInfoList = data.response.patientInfoList[0]; }
          if (data.response.retainInfoList != null) { this.retainInfoList = data.response.retainInfoList[0]; }
          this.FillContactInfo();
          this.updateSubjectBody();
          this.isContactModelShow = true;
        }
        else {
          this.isContactModelShow = false;
        }
      },
        (err: any) => {

        });
    }
  }
  updateSubjectBody() {
    var emailSubject: string = this.contactInfoForm.get('emailSubModel').value
    var emailBody: string = this.contactInfoForm.get('emailBodyModel').value
    if (this.patientInfoList != 0 && emailSubject) {
      emailSubject = emailSubject.replace('{{PatientID}}', this.patientInfoList.ID)
      emailSubject = emailSubject.replace('{{PatientFirstName}}', this.patientInfoList.Firstname)
      emailSubject = emailSubject.replace('{{PatientLastName}}', this.patientInfoList.LastName)
      emailSubject = emailSubject.replace('{{DOB}}', this.patientInfoList.DOB)
      emailBody = emailBody.replace('{{PatientID}}', this.patientInfoList.ID)
      emailBody = emailBody.replace('{{PatientFirstName}}', this.patientInfoList.Firstname)
      emailBody = emailBody.replace('{{PatientLastName}}', this.patientInfoList.LastName)
      emailBody = emailBody.replace('{{PatientDOB}}', this.patientInfoList.DOB)
    }

    this.contactInfoForm.patchValue({
      emailSubModel: (this.patientIdModel == '' ? emailSubject : emailSubject.replace('{{PatientID}}', this.patientIdModel)),
      emailBodyModel: (this.patientIdModel == '' ? emailBody : emailBody.replace('{{PatientID}}', this.patientIdModel)),
      // smsTextModel :  (this.patientIdModel == '' ? smsBody : smsBody.replace('{{PatientID}}', this.patientIdModel)),
    })
  }
  FillContactInfo() {
    if (this.brokerInfoList.length != 0) {
      this.contactInfoForm.patchValue({
        infoBrokerName: this.brokerInfoList.Name,
        InfoBrokerMainEmail: this.brokerInfoList.MainEmail,
        InfoBrokerBillingEmail: this.brokerInfoList.BillingEmail,
        InfoBrokerAPEmail: this.brokerInfoList.APEmail,
        InfoBrokerMainFax: this.brokerInfoList.MainFax,
        InfoBrokerBillingFax: this.brokerInfoList.BillingFax,
        InfoBrokerAPFax: this.brokerInfoList.APFax
      })
    }
    (this.contactInfoForm.get('InfoBrokerMainEmail').value == 'N/A' ? this.contactInfoForm.get('IsBrokerMainEmail').disable() : this.contactInfoForm.get('IsBrokerMainEmail').enable());
    (this.contactInfoForm.get('InfoBrokerBillingEmail').value == 'N/A' ? this.contactInfoForm.get('IsBrokerBillingEmail').disable() : this.contactInfoForm.get('IsBrokerBillingEmail').enable());
    (this.contactInfoForm.get('InfoBrokerAPEmail').value == 'N/A' ? this.contactInfoForm.get('IsBrokerAPEmail').disable() : this.contactInfoForm.get('IsBrokerAPEmail').enable());
    (this.contactInfoForm.get('InfoBrokerMainFax').value == 'N/A' ? this.contactInfoForm.get('IsBrokerMainFax').disable() : this.contactInfoForm.get('IsBrokerMainFax').enable());
    (this.contactInfoForm.get('InfoBrokerBillingFax').value == 'N/A' ? this.contactInfoForm.get('IsBrokerBillingFax').disable() : this.contactInfoForm.get('IsBrokerBillingFax').enable());
    (this.contactInfoForm.get('InfoBrokerAPFax').value == 'N/A' ? this.contactInfoForm.get('IsBrokerAPFax').disable() : this.contactInfoForm.get('IsBrokerAPFax').enable());
    if (this.attInfoList.length != 0) {
      this.contactInfoForm.patchValue({
        infoAttorneyName: this.attInfoList.Name,
        infoAttorneyFax: this.attInfoList.Fax,
        infoAttorneyPhone: this.attInfoList.Phone,
        infoAttorneyEmail: this.attInfoList.Email,
      })
    }
    (this.contactInfoForm.get('infoAttorneyFax').value == 'N/A' ? this.contactInfoForm.get('IsAttorneyFax').disable() : this.contactInfoForm.get('IsAttorneyFax').enable());
    (this.contactInfoForm.get('infoAttorneyEmail').value == 'N/A' ? this.contactInfoForm.get('IsAttorneyEmail').disable() : this.contactInfoForm.get('IsAttorneyEmail').enable());
    if (this.patientInfoList.length != 0) {
      this.contactInfoForm.patchValue({
        patientHeaderModel: this.patientInfoList.HeaderName,
        InfoPatientName: this.patientInfoList.Name,
        InfoPatientFax: this.patientInfoList.Fax,
        infoPatientPhone: this.patientInfoList.phone,
        infoPatientEmail: this.patientInfoList.Email
      })
      if (this.retainInfoList.length != 0) {
        this.contactInfoForm.patchValue({
          IsAttorneyFax: this.retainInfoList.IsAttorenyFaxSend == '0' || this.retainInfoList.IsAttorenyFaxSend === null ? false : true,
          IsAttorneyEmail: this.retainInfoList.IsAttorenyEmailSend == '0' || this.retainInfoList.IsAttorenyEmailSend === null ? false : true,
          IsRefPhyFax: this.retainInfoList.IsRefPhyFaxSend == '0' || this.retainInfoList.IsRefPhyFaxSend === null ? false : true,
          IsRefPhyEmail: this.retainInfoList.IsRefPhyEmailSend == '0' || this.retainInfoList.IsRefPhyEmailSend === null ? false : true,
          IsBrokerMainFax: this.retainInfoList.IsBrokerMainFaxSend == '0' || this.retainInfoList.IsBrokerMainFaxSend === null ? false : true,
          IsBrokerMainEmail: this.retainInfoList.IsBrokerMainEmailSend == '0' || this.retainInfoList.IsBrokerMainEmailSend === null ? false : true,
          IsPatientFax: this.retainInfoList.IsPatientFaxSend == '0' || this.retainInfoList.IsPatientFaxSend === null ? false : true,
          IsPatientEmail: this.retainInfoList.IsPatientEmailSend == '0' || this.retainInfoList.IsPatientEmailSend === null  ? false : true,
          IsPatientPhone: this.retainInfoList.IsPatientSmsSend == '0' || this.retainInfoList.IsPatientSmsSend === null ? false : true,
          AddtionalDeskFax: this.retainInfoList.IsAddionalDeskFaxSend  == '0' || this.retainInfoList.IsAddionalDeskFaxSend === null  ? false : true,
          AddtionalDeskEmail: this.retainInfoList.IsAddionalDeskEmailSend == '0' || this.retainInfoList.IsAddionalDeskEmailSend === null  ? false : true,
          AddtionalDeskSms: this.retainInfoList.IsAddionalDeskPhoneSend == '0' || this.retainInfoList.IsAddionalDeskPhoneSend === null ? false : true
        });
        if(this.retainInfoList.IsAddionalDeskPhoneSend == "1" ||
        this.retainInfoList.IsPatientSmsSend == "1"){
          this.smsTextModel = this.smsBody;
        }
      }
    }

    (this.contactInfoForm.get('infoPatientPhone').value == 'N/A' ? this.contactInfoForm.get('IsPatientPhone').disable() : this.contactInfoForm.get('IsPatientPhone').enable());
    (this.contactInfoForm.get('infoPatientEmail').value == 'N/A' ? this.contactInfoForm.get('IsPatientEmail').disable() : this.contactInfoForm.get('IsPatientEmail').enable());

    if (this.refPhyInfoList.length != 0) {
      this.contactInfoForm.patchValue({
        infoRefPhyName: this.refPhyInfoList.Name,
        InfoRefPhyFax: this.refPhyInfoList.Fax,
        infoRefPhyPhone: this.refPhyInfoList.Phone,
        infoRefPhyEmail: this.refPhyInfoList.Email
      })
    }
    (this.contactInfoForm.get('InfoRefPhyFax').value == 'N/A' ? this.contactInfoForm.get('IsRefPhyFax').disable() : this.contactInfoForm.get('IsRefPhyFax').enable());
    (this.contactInfoForm.get('infoRefPhyEmail').value == 'N/A' ? this.contactInfoForm.get('IsRefPhyEmail').disable() : this.contactInfoForm.get('IsRefPhyEmail').enable());
  }
  onchkUserChange(id) {
    this.IsSendSlackChecked = id.target.checked ;
    if (id.target.checked) {
      document.getElementById('inputUser').hidden = false;
    } else {
      document.getElementById('inputUser').hidden = true;
    }
  }
  onUserChange(selectedUser:any){
    this.slackUserName = selectedUser.target.value ;
   this.UserSlackId = this.userList.filter(obj => obj.UserName === selectedUser.target.value)[0].UserSlackID
   
  }
  onchkFaxChange(id) {
    if (id.target.checked) {
      document.getElementById('AddFax1').hidden = false;
      document.getElementById('AddFax2').hidden = false;
      document.getElementById('AddFax3').hidden = false;
    } else {
      document.getElementById('AddFax1').hidden = true;
      document.getElementById('AddFax2').hidden = true;
      document.getElementById('AddFax3').hidden = true;
    }
  }
  onchkEmailChange(id) {
    if (id.target.checked) {
      document.getElementById('AddEmail1').hidden = false;
      document.getElementById('AddEmail2').hidden = false;
      document.getElementById('AddEmail3').hidden = false;
    } else {
      document.getElementById('AddEmail1').hidden = true;
      document.getElementById('AddEmail2').hidden = true;
      document.getElementById('AddEmail3').hidden = true;
    }
  }
  onchkPhoneChange(id) {
    this.addPhoneChecked = id.target.checked;
    if (this.addPhoneChecked == true) {
      this.smsTextModel = this.smsBody;
    }

    // this.contactInfoForm.patchValue({
    //   SmsTextModel :   this.smsBody 
    // })
    if (id.target.checked) {
      document.getElementById('AddPhone1').hidden = false;
      document.getElementById('AddPhone2').hidden = false;
      document.getElementById('AddPhone3').hidden = false;
    } else {
      document.getElementById('AddPhone1').hidden = true;
      document.getElementById('AddPhone2').hidden = true;
      document.getElementById('AddPhone3').hidden = true;
    }
  }
  onchkPatientPhoneChange(id) {
    this.IsPatientPhoneSent = id.target.checked;
    if (this.IsPatientPhoneSent == true) {
      this.smsTextModel = this.smsBody;
    }
    //   this.contactInfoForm.patchValue({
    //     SmsTextModel :   this.smsBody 
    //  })
  }
  ClearInfoList() {
    this.brokerInfoList = [];
    this.attInfoList = [];
    this.refPhyInfoList = [];
    this.patientInfoList = [];
    this.contactInfoForm.patchValue({
      patientHeaderModel: 'N/A',
      infoAttorneyName: 'N/A',
      infoAttorneyFax: 'N/A',
      infoAttorneyPhone: 'N/A',
      infoAttorneyEmail: 'N/A',
      infoRefPhyName: 'N/A',
      InfoRefPhyFax: 'N/A',
      infoRefPhyPhone: 'N/A',
      infoRefPhyEmail: 'N/A',
      InfoPatientName: 'N/A',
      InfoPatientFax: 'N/A',
      infoPatientPhone: 'N/A',
      infoPatientEmail: 'N/A',
      infoBrokerName: 'N/A',
      InfoBrokerMainEmail: 'N/A',
      InfoBrokerBillingEmail: 'N/A',
      InfoBrokerAPEmail: 'N/A',
      InfoBrokerMainFax: 'N/A',
      InfoBrokerBillingFax: 'N/A',
      InfoBrokerAPFax: 'N/A',
      IsAttorneyFax: false,
      isAttorneyPhone: false,
      IsAttorneyEmail: false,
      IsRefPhyFax: false,
      isRefPhyPhone: false,
      IsRefPhyEmail: false,
      IsPatientFax: false,
      IsPatientPhone: false,
      IsPatientEmail: false,
      IsBrokerMainEmail: false,
      IsBrokerBillingEmail: false,
      IsBrokerAPEmail: false,
      IsBrokerMainFax: false,
      IsBrokerBillingFax: false,
      IsBrokerAPFax: false,
      AddtionalDeskFax: false,
      AddtionalDeskEmail: false,
      AddtionalDeskSms: false
    })
    this.faxSend = '';
    this.emailSend = '';
    this.phoneSend = '';
  }
  btnCreateSendAlert() {
    this.btnCreateAlert();
    this.getSendInfo();
    if (this.contactInfoForm.get('IsBrokerMainEmail').value == true ||
    this.contactInfoForm.get('IsRefPhyEmail').value == true ||
    this.contactInfoForm.get('IsPatientEmail').value == true ||
    this.contactInfoForm.get('AddtionalDeskEmail').value == true ||
    this.contactInfoForm.get('IsBrokerAPEmail').value == true ||
    this.contactInfoForm.get('IsBrokerBillingEmail').value == true
    ) {
      this.sendEmail();
  }

    if (this.contactInfoForm.get('IsBrokerMainFax').value == true ||
      this.contactInfoForm.get('IsPatientFax').value == true ||
      this.contactInfoForm.get('AddtionalDeskFax').value == true ||
      this.contactInfoForm.get('IsRefPhyFax').value == true ||
      this.contactInfoForm.get('IsBrokerAPFax').value == true ||
      this.contactInfoForm.get('IsBrokerBillingFax').value == true) {
      this.sendFax();
    }

    if (this.contactInfoForm.get('AddtionalDeskSms').value == true ||
      this.contactInfoForm.get('isRefPhyPhone').value == true ||
      this.contactInfoForm.get('isAttorneyPhone').value == true) {
      this.sendSMS();
    }
    if(this.IsSendSlackChecked == true)
    this.sendSlack()

  }

  btnCreateAlert() {
    if (this.addPhoneChecked == false && this.IsPatientPhoneSent == false) {
      this.contactInfoForm.get('SmsTextModel').setErrors(null);
    }
    var PatientID = this.contactInfoForm.get('patientID').value;
    var patientId = PatientID.toLowerCase().includes('pre') ? PatientID : 'PRE' + PatientID;
    this.contactInfoForm.get('patientID').setValue(patientId);
    this.Issubmitted = true;
    if (this.contactInfoForm.invalid) {
      this.modalValue = '';
      return;
    } this.modalValue = 'modal'
    this.CreateAlertService.createAlert(this.contactInfoForm.value, true).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.alertList = data.response.alertList;
        this.reasonFilter = data.response.reasonList;
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: 'Alert Created',
          alertType: 200
        });
        this.close();
        if (this.alertButtonClick) {
          this.commonService.loadCreateAlertRecords('true');
        }
      }
    },
      (err: any) => {

      });
  }
  getSendInfo() {

    if (this.contactInfoForm.get('IsAttorneyFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('infoAttorneyFax').value + ', ')
    if (this.contactInfoForm.get('isAttorneyPhone').value == true) this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoAttorneyPhone').value + ', ')
    if (this.contactInfoForm.get('IsAttorneyEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('infoAttorneyEmail').value + ', ')
    if (this.contactInfoForm.get('IsRefPhyFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('InfoRefPhyFax').value + ', ')
    if (this.contactInfoForm.get('isRefPhyPhone').value == true) this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoRefPhyPhone').value + ', ')
    if (this.contactInfoForm.get('IsRefPhyEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('infoRefPhyEmail').value + ', ')
    if (this.contactInfoForm.get('IsPatientFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('InfoPatientFax').value + ', ')
    if (this.contactInfoForm.get('IsPatientPhone').value == true) this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoPatientPhone').value + ', ')
    if (this.contactInfoForm.get('IsPatientEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('infoPatientEmail').value + ', ')
    if (this.contactInfoForm.get('IsBrokerMainEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('InfoBrokerMainEmail').value + ', ')
    if (this.contactInfoForm.get('IsBrokerBillingEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('InfoBrokerBillingEmail').value + ', ')
    if (this.contactInfoForm.get('IsBrokerAPEmail').value == true) this.emailSend = (this.emailSend + this.contactInfoForm.get('InfoBrokerAPEmail').value + ', ')
    if (this.contactInfoForm.get('IsBrokerMainFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('InfoBrokerMainFax').value + ', ')
    if (this.contactInfoForm.get('IsBrokerBillingFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('InfoBrokerBillingFax').value + ', ')
    if (this.contactInfoForm.get('IsBrokerAPFax').value == true) this.faxSend = (this.faxSend + this.contactInfoForm.get('InfoBrokerAPFax').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalFax1').value != '') this.faxSend = (this.faxSend + this.contactInfoForm.get('infoAdditionalFax1').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalFax2').value != '') this.faxSend = (this.faxSend + this.contactInfoForm.get('infoAdditionalFax2').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalFax3').value != '') this.faxSend = (this.faxSend + this.contactInfoForm.get('infoAdditionalFax3').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalPhone1').value != '') this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoAdditionalPhone1').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalPhone2').value != '') this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoAdditionalPhone2').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalPhone3').value != '') this.phoneSend = (this.phoneSend + this.contactInfoForm.get('infoAdditionalPhone3').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalEmail1').value != '') this.emailSend = (this.emailSend + this.contactInfoForm.get('infoAdditionalEmail1').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalEmail2').value != '') this.emailSend = (this.emailSend + this.contactInfoForm.get('infoAdditionalEmail2').value + ', ')
    if (this.contactInfoForm.get('infoAdditionalEmail3').value != '') this.emailSend = (this.emailSend + this.contactInfoForm.get('infoAdditionalEmail3').value + ', ')
  }
  sendSMS() {
    if (this.contactInfoForm.invalid) {
      this.modalValue = '';
      return;
    } this.modalValue = 'modal'
    //this.phoneSend = '9888793469';
    this.contactInfoForm.patchValue({ smsTextModel: this.smsTextModel });
    if (this.phoneSend.length > 0) {
      var data = {
        'patientid': this.patientInfoList.ID,
        'phoneNumber': this.phoneSend,
        'message': this.contactInfoForm.controls.SmsTextModel.value,
        //'message': this.smsTextModel,
        'LastName': this.patientInfoList.LastName,
        'FirstName': this.patientInfoList.Firstname,
        'FromUser': this.patientInfoList.ID,
        'CurrentUserID': this.storageService.user.UserId,
        'FromPage': 'Created Alert'
      };
    }

    this.CreateAlertService.sendSMS(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
      if (res.responseCode == 200) {
        this.isSmsSentSuccessfully = true; 
        var data: any = res;
        this.ClearInfoList();
      }
    },
      (err: any) => {

      });
  }
  close() {
    // this.getDropdown();
    this.ClearInfoList();
    this.isContactModelShow = false;
    this.patientIdModel = '';
    $('#alertSelect').prop('selectedIndex', 0);
    $('#reasonSelect').prop('selectedIndex', 0);
    $('.modal-body').scrollTop(0);
    this.contactInfoForm.reset();
    this.Issubmitted = false;
    this.modalValue = ''
    this.patientFieldDisable = false;
    this.addPhoneChecked = false;
    this.IsPatientPhoneSent = false;
    this.doctorAsDefaultContact = false;
    this.attorneyAsDefaultContact = false;
  }
  sendEmail() {
    if (this.emailSend.length > 0) {
      let data = {
        'patientid': this.patientInfoList.ID,
        'firstName': this.patientInfoList.Firstname,
        'lastName': this.patientInfoList.LastName,
        'MailTo': this.emailSend,
        'FromPage': 'CreateAlert',
        'EmailSubject': this.contactInfoForm.get('emailSubModel').value,
        'EmailBody': this.contactInfoForm.get('emailBodyModel').value,
        'CurrentUserID': this.storageService.user.UserId
      }
      this.CreateAlertService.sendEmail(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res.responseCode == 200) {
          this.isEmailSentSuccessfully = true ;
          this.ClearInfoList();
        }
        else {
        }
      }, (err: any) => {
      });
    }
  }

  sendFax() {
    if (this.faxSend.length > 0) {
      let data = {
        'patientid': this.patientInfoList.ID,
        'faxNumber': this.faxSend,
        'firstName': this.patientInfoList.Firstname,
        'lastName': this.patientInfoList.LastName,
        // 'MailTo': this.emailSend,
        'FromPage': 'CreateAlert',
        // 'EmailSubject': this.contactInfoForm.get('emailSubModel').value,
        'CurrentUserID': this.storageService.user.UserId,
         'EmailBody': this.contactInfoForm.get('emailBodyModel').value
      }
      this.CreateAlertService.sendFax(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res.responseCode == 200) {
          this.isFaxSentSuccessfully = true ;
          this.ClearInfoList();
        }
        else {
        }
      }, (err: any) => {
      });
    }
  }

  sendSlack() {
    if (this.UserSlackId.length > 0 && this.IsSendSlackChecked == true) {
      let data = {
        'PatientID': this.patientInfoList.ID,
        'UserSlackID': this.UserSlackId,
        'SlackUserName' : this.slackUserName,
        'CurrentUserID': this.storageService.user.UserId,
        'UserName':this.storageService.user.FullName,
        'Type':this.Alert,
        'Reason':this.Reason,
        'InternalNotes':this.contactInfoForm.controls.notesModel.value
      }
      this.CreateAlertService.sendSlack(JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res.responseCode == 200) {
          this.isSlackSentSuccessfully = true ;
          this.ClearInfoList();
        }
        else {
        }
      }, (err: any) => {
      });
    }
  }
  get contactInfoFormRef() { return this.contactInfoForm.controls; }
}    
