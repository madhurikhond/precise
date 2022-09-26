import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { SendDocumentService } from 'src/app/services/send-document-service/Send.document.service';
import { SendDocumentInput, AttorneySDDetails, BrokerSDDetails, CoverPage, FacilitySDDetails, PatientSDDetail, SendPostMailToUser, PostMail } from 'src/app/models/SendDocument';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonRegex } from 'src/app/constants/commonregex';


@Component({
  selector: 'app-send-document',
  templateUrl: './send-document.component.html',
  styleUrls: ['./send-document.component.css'],
})



export class SendDocumentComponent implements OnInit, AfterViewInit {

  sendDocumentInput: SendDocumentInput;
  coverPage: CoverPage
  fileName: string = '';
  patientId: string = '';
  docId: number = 0;
  docType: string = '';
  fromPage:string='';
  attorneyList: any[] = [];
  brokerList: any[] = [];
  referrerPhysicianList: any[] = [];
  readingPhysicianList: any[] = [];
  facilityList: any[] = [];
  patientList: any[] = [];
  stateList: any = [];
  selectedstate = '';
  readonly commonRegex=CommonRegex;
  isShowAttorneyNameList: boolean = false;
  isShowAttorneyEmailList: boolean = false;
  isShowAttorneyFaxList: boolean = false;
  isShowAttorneyAddressList: boolean = false;

  isShowReferrerPhyNameList: boolean = false;
  isShowReferrerPhyEmailList: boolean = false;
  isShowReferrerPhyFaxList: boolean = false;
  isShowReferrerPhyAddressList: boolean = false;

  isShowReadingPhyNameList: boolean = false;
  isShowReadingPhyEmailList: boolean = false;
  isShowReadingPhyFaxList: boolean = false;
  isShowReadingPhyAddressList: boolean = false;

  isShowFacilityNameList: boolean = false;
  isShowFacilityEmailList: boolean = false;
  isShowFacilityFaxList: boolean = false;
  isShowFacilityAddressList: boolean = false;

  isShowBrokerNameList: boolean = false;
  isShowBrokerEmailList: boolean = false;
  isShowBrokerFaxList: boolean = false;
  isShowBrokerAddressList: boolean = false;

  isShowPatientNameList: boolean = false;
  isShowPatientEmailList: boolean = false;
  isShowPatientFaxList: boolean = false;
  isShowPatientAddressList: boolean = false;


  chkSendToAttorneyModel: boolean = false;
  chkSendToReferrerPhyModel: boolean = false;
  chkSendToBrokerModel: boolean = false;
  chkSendToFacilityModel: boolean = false;
  chkSendToReadingPhyModel: boolean = false;
  chkSendToPatientModel: boolean = false;

  chkSendMethodEmailModel: boolean = false;
  chkSendMethodFaxModel: boolean = false;
  chkSendMethodMailModel: boolean = false;
  chkSendMethodCoverPageModel: boolean = false;

  addEmailForm: FormGroup;
  addFaxForm: FormGroup;
  addPostMailForm: FormGroup;
  addCoverPageForm: FormGroup;
  submitted = false;
  attorneySelected: any;
  selectedEmailAttorney: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedEmailPatient: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedEmailBroker: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedEmailFacility: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];


  selectedFaxAttorney: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedFaxPatient: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedFaxBroker: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedFaxFacility: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];

  selectedAddressAttorney: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedAddressPatient: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedAddressBroker: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];
  selectedAddressFacility: Array<{ Id: number, Email?: string, Fax?: string, Name: string, Address?: string }> = [];


  AttorneyDetailsList: AttorneySDDetails[] = [];
  PatientDetailsList: PatientSDDetail[] = [];
  BrokerDetailsList: BrokerSDDetails[] = [];
  FacilityDetailsList: FacilitySDDetails[] = [];
  SendPostMailToUser: SendPostMailToUser[] = [];
  postMail: PostMail
  //allEmail: any = [];


  popUpTitle: string = ''
  constructor(private readonly notificationService: NotificationService, private readonly storageService: StorageService,
    private readonly sendDocumentService: SendDocumentService, private fb: FormBuilder) {
    this.sendDocumentInput = new SendDocumentInput();
    this.coverPage = new CoverPage();
    this.postMail = new PostMail();

  }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.sendDocumentService.sendDocumentSubjectObservable.subscribe((data) => {
      
      if (data.patientId != '') {
        this.patientId = data.patientId;
        this.fileName = data.fileName;
        this.docId = data.docId;
        this.docType = data.docType;
        this.fromPage = data.fromPage;
        this.popUpTitle = 'Send Documents-' + data.patientFullName;
        this.clearList();
        this.setSendToAndSendMethodCheckBox();
        this.getUsers();
        this.getAllStates();
        this.selectedEmailAttorney = [];
        this.selectedEmailPatient = [];
        this.selectedEmailFacility = [];
        this.selectedEmailBroker = [];

      }
    })
    this.FormInitialization();
  }

  FormInitialization() {
    this.addEmailForm = this.fb.group({
      FirstEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      SecondEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
      ThirdEmail: ['', [Validators.pattern(this.commonRegex.EmailRegex)]],
    });
    this.addFaxForm = this.fb.group({
      FirstFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      SecondFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
      ThirdFax: ['', [Validators.pattern(this.commonRegex.FaxRegex)]],
    });
    this.addPostMailForm = this.fb.group({
      Name: [''],
      Address: [''],
      City: [''],
      StateID: [''],
      ZipCode: [''],
    });
    this.addCoverPageForm = this.fb.group({
      From: [''],
      Attention: [''],
      Body: [''],
    });
  }
  getAllStates() {
    this.sendDocumentService.getAllState(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.stateList = data.response
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
  setSendToAndSendMethodCheckBox() {

    this.chkSendToAttorneyModel = false;
    this.chkSendToReferrerPhyModel = false;
    this.chkSendToBrokerModel = false;
    this.chkSendToFacilityModel = false;
    this.chkSendToReadingPhyModel = false;
    this.chkSendToPatientModel = false;


    this.isShowAttorneyNameList = false;
    this.isShowAttorneyEmailList = false;
    this.isShowAttorneyFaxList = false;
    this.isShowAttorneyAddressList = false;

    this.isShowReferrerPhyNameList = false;
    this.isShowReferrerPhyEmailList = false;
    this.isShowReferrerPhyFaxList = false;
    this.isShowReferrerPhyAddressList = false;

    this.isShowReadingPhyNameList = false;
    this.isShowReadingPhyEmailList = false;
    this.isShowReadingPhyFaxList = false;
    this.isShowReadingPhyAddressList = false;

    this.isShowFacilityNameList = false;
    this.isShowFacilityEmailList = false;
    this.isShowFacilityFaxList = false;
    this.isShowFacilityAddressList = false;

    this.isShowBrokerNameList = false;
    this.isShowBrokerEmailList = false;
    this.isShowBrokerFaxList = false;
    this.isShowBrokerAddressList = false;

    this.isShowPatientNameList = false;
    this.isShowPatientEmailList = false;
    this.isShowPatientFaxList = false;
    this.isShowPatientAddressList = false;


    this.chkSendMethodEmailModel = false;
    this.chkSendMethodFaxModel = false;
    this.chkSendMethodMailModel = false;
  }
  getUsers() {
    this.sendDocumentService.getUsers(true, this.patientId).subscribe((res) => {
      if (res.response != null) {
        if (JSON.stringify(res.response[0][0].Attorney[0]) != '{}') {
          this.attorneyList = res.response[0][0].Attorney;
        }
        else {
          this.attorneyList = [];
        }
        if (JSON.stringify(res.response[1][0].Broker[0]) != '{}') {
          this.brokerList = res.response[1][0].Broker;
        }
        else {
          this.brokerList = [];
        }
        if (JSON.stringify(res.response[2][0].Facility[0]) != '{}') {
          this.facilityList = res.response[2][0].Facility;
        }
        else {
          this.facilityList = [];
        }
        if (JSON.stringify(res.response[3][0].ReferrerPhysician[0]) != '{}') {
          this.referrerPhysicianList = res.response[3][0].ReferrerPhysician;
        }
        else {
          this.referrerPhysicianList = [];
        }
        if (JSON.stringify(res.response[4][0].ReadingPhysician[0]) != '{}') {
          this.readingPhysicianList = res.response[4][0].ReadingPhysician;
        }
        else {
          this.readingPhysicianList = [];
        }
        if (JSON.stringify(res.response[5][0].PatientDetail[0]) != '{}') {
          this.patientList = res.response[5][0].PatientDetail;
        }
        else {
          this.patientList = [];
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  clearList() {
    this.attorneyList = [];
    this.brokerList = [];
    this.referrerPhysicianList = [];
    this.readingPhysicianList = [];
    this.facilityList = [];
    this.patientList = [];
    this.selectedFaxAttorney = []; this.selectedAddressAttorney = [];
    this.AttorneyDetailsList = []; this.BrokerDetailsList = []; this.FacilityDetailsList = []; this.PatientDetailsList = [];
  }
  sendToClick(evt: any, sendToUser: string) {
    if (sendToUser == 'Attorney') {
      if (this.chkSendMethodEmailModel) {
        this.isShowAttorneyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowAttorneyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowAttorneyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToUser == 'ReferringPhy') {
      if (this.chkSendMethodEmailModel) {
        this.isShowReferrerPhyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowReferrerPhyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowReferrerPhyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToUser == 'Broker') {
      if (this.chkSendMethodEmailModel) {
        this.isShowBrokerEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowBrokerFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowBrokerAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToUser == 'Facility') {
      if (this.chkSendMethodEmailModel) {
        this.isShowFacilityEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowFacilityFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowFacilityAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToUser == 'ReadingPhy') {
      if (this.chkSendMethodEmailModel) {
        this.isShowReadingPhyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowReadingPhyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowReadingPhyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToUser == 'Patient') {
      if (this.chkSendMethodEmailModel) {
        this.isShowPatientEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodFaxModel) {
        this.isShowPatientFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendMethodMailModel) {
        this.isShowPatientAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
  }
  sendMethodClick(evt: any, sendToMethodType: string) {
    if (sendToMethodType == 'Email') {
      if (this.chkSendToAttorneyModel) {
        this.isShowAttorneyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToReferrerPhyModel) {
        this.isShowReferrerPhyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToBrokerModel) {
        this.isShowBrokerEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToFacilityModel) {
        this.isShowFacilityEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToReadingPhyModel) {
        this.isShowReadingPhyEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToPatientModel) {
        this.isShowPatientEmailList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToMethodType == 'Fax') {
      if (!evt.currentTarget.checked) {
        this.chkSendMethodCoverPageModel = false;
        this.clearCoverPageValidation();
        this.addCoverPageForm.reset();
      } else { this.addCoverPageForm.reset(); }
      if (this.chkSendToAttorneyModel) {
        this.isShowAttorneyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToReferrerPhyModel) {
        this.isShowReferrerPhyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToBrokerModel) {
        this.isShowBrokerFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToFacilityModel) {
        this.isShowFacilityFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToReadingPhyModel) {
        this.isShowReadingPhyFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToPatientModel) {
        this.isShowPatientFaxList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToMethodType == 'Mail') {
      if (evt.currentTarget.checked) {
        this.addPostMailForm.reset();
        if (this.addGetPostMailForm.Name.value || this.addGetPostMailForm.Address.value || this.addGetPostMailForm.City.value || this.addGetPostMailForm.StateID.value || this.addGetPostMailForm.ZipCode.value) {
          this.addPostMailForm.get('Name').setValidators([Validators.required]); this.addPostMailForm.get('Name').updateValueAndValidity();
          this.addPostMailForm.get('Address').setValidators([Validators.required]); this.addPostMailForm.get('Address').updateValueAndValidity();
          this.addPostMailForm.get('City').setValidators([Validators.required]); this.addPostMailForm.get('City').updateValueAndValidity();
          this.addPostMailForm.get('StateID').setValidators([Validators.required]); this.addPostMailForm.get('StateID').updateValueAndValidity();
          this.addPostMailForm.get('ZipCode').setValidators([Validators.required]); this.addPostMailForm.get('ZipCode').updateValueAndValidity();
        } else {
          this.clearPostMailValidation();
          this.addPostMailForm.reset();
        }
      } else { this.clearPostMailValidation(); this.addPostMailForm.reset(); }
      if (this.chkSendToAttorneyModel) {
        this.isShowAttorneyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToReferrerPhyModel) {
        this.isShowReferrerPhyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToBrokerModel) {
        this.isShowBrokerAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToFacilityModel) {
        this.isShowFacilityAddressList = evt.currentTarget.checked;
      }
      if (this.chkSendToReadingPhyModel) {
        this.isShowReadingPhyAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
      if (this.chkSendToPatientModel) {
        this.isShowPatientAddressList = evt.currentTarget.checked;
        this.hideShowNameList();
      }
    }
    else if (sendToMethodType == 'CoverPage') {
       this.addCoverPageForm.reset();
      if (evt.currentTarget.checked) {       
        if (this.addGetCoverPageForm.From.value || this.addGetCoverPageForm.Attention.value || this.addGetCoverPageForm.Body.value) {
          this.addCoverPageForm.get('From').setValidators([Validators.required]); this.addCoverPageForm.get('From').updateValueAndValidity();
          this.addCoverPageForm.get('Attention').setValidators([Validators.required]); this.addCoverPageForm.get('Attention').updateValueAndValidity();
          this.addCoverPageForm.get('Body').setValidators([Validators.required]); this.addCoverPageForm.get('Body').updateValueAndValidity();
        } else {
          this.clearCoverPageValidation();
        }
      } else { this.clearCoverPageValidation(); }
    }
  }
  setRequired() {
    if (1 == 1) {
      return [Validators.required];
    } else {
      return [];
    }
  }
  hideShowNameList() {
    if (this.chkSendToAttorneyModel) {
      if (this.isShowAttorneyEmailList || this.isShowAttorneyFaxList || this.isShowAttorneyAddressList) {
        this.isShowAttorneyNameList = true;
      }
      else {
        this.isShowAttorneyNameList = false;
      }
    }
    if (this.chkSendToReferrerPhyModel) {
      if (this.isShowReferrerPhyEmailList || this.isShowReferrerPhyFaxList || this.isShowReferrerPhyAddressList) {
        this.isShowReferrerPhyNameList = true;
      }
      else {
        this.isShowReferrerPhyNameList = false;
      }
    }
    if (this.chkSendToBrokerModel) {
      if (this.isShowBrokerEmailList || this.isShowBrokerFaxList || this.isShowBrokerAddressList) {
        this.isShowBrokerNameList = true;
      }
      else {
        this.isShowBrokerNameList = false;
      }
    }
    if (this.chkSendToFacilityModel) {
      if (this.isShowFacilityEmailList || this.isShowFacilityFaxList || this.isShowFacilityAddressList) {
        this.isShowFacilityNameList = true;
      }
      else {
        this.isShowFacilityNameList = false;
      }
    }
    if (this.chkSendToReadingPhyModel) {
      if (this.isShowReadingPhyEmailList || this.isShowReadingPhyFaxList || this.isShowReadingPhyAddressList) {
        this.isShowReadingPhyNameList = true;
      }
      else {
        this.isShowReadingPhyNameList = false;
      }
    }

    if (this.chkSendToPatientModel) {
      if (this.isShowPatientEmailList || this.isShowPatientFaxList || this.isShowPatientAddressList) {
        this.isShowPatientNameList = true;
      }
      else {
        this.isShowPatientNameList = false;
      }
    }
  }
  getEmail(evt: any, email: string, Name: string = '', Id: number = 0, from: string = '') {
    if (evt.currentTarget.checked) {
      if (Id != 0) {
        if (from == 'attorney')
          this.selectedEmailAttorney.push({ Id: Id, Name: Name, Email: email, Address: '', Fax: '' });
        else if (from == 'patient')
          this.selectedEmailPatient.push({ Id: Id, Name: Name, Email: email, Address: '', Fax: '' });
        else if (from == 'broker')
          this.selectedEmailBroker.push({ Id: Id, Name: Name, Email: email, Address: '', Fax: '' });
        else if (from == 'facility')
          this.selectedEmailFacility.push({ Id: Id, Name: Name, Email: email, Address: '', Fax: '' });
      }
    }
    else {
      if (from == 'attorney') {
        this.selectedEmailAttorney.forEach((item, index) => {
          if (item.Email == email) this.selectedEmailAttorney.splice(index, 1);
        });
      }
      else if (from == 'patient') {
        this.selectedEmailPatient.forEach((item, index) => {
          if (item.Email == email) this.selectedEmailPatient.splice(index, 1);
        });
      }
      else if (from == 'broker') {
        this.selectedEmailBroker.forEach((item, index) => {
          if (item.Email == email) this.selectedEmailBroker.splice(index, 1);
        });
      }
      else if (from == 'facility') {
        this.selectedEmailFacility.forEach((item, index) => {
          if (item.Email == email) this.selectedEmailFacility.splice(index, 1);
        });
      }
    }
  }
  getFax(evt: any, fax: string, Name: string = '', Id: number = 0, from: string = '') {
    if (evt.currentTarget.checked) {
      if (Id != 0) {
        if (from == 'attorney')
          this.selectedFaxAttorney.push({ Id: Id, Name: Name, Fax: fax, Address: '', Email: '' });
        else if (from == 'patient')
          this.selectedFaxPatient.push({ Id: Id, Name: Name, Fax: fax, Address: '', Email: '' });
        else if (from == 'broker')
          this.selectedFaxBroker.push({ Id: Id, Name: Name, Fax: fax, Address: '', Email: '' });
        else if (from == 'facility')
          this.selectedFaxFacility.push({ Id: Id, Name: Name, Fax: fax, Address: '', Email: '' });
      }
    }
    else {
      if (from == 'attorney') {
        this.selectedFaxAttorney.forEach((item, index) => {
          if (item.Fax == fax) this.selectedFaxAttorney.splice(index, 1);
        });
      }
      else if (from == 'patient') {
        this.selectedFaxPatient.forEach((item, index) => {
          if (item.Fax == fax) this.selectedFaxPatient.splice(index, 1);
        });
      }
      else if (from == 'broker') {
        this.selectedFaxBroker.forEach((item, index) => {
          if (item.Fax == fax) this.selectedFaxBroker.splice(index, 1);
        });
      }
      else if (from == 'facility') {
        this.selectedFaxFacility.forEach((item, index) => {
          if (item.Fax == fax) this.selectedFaxFacility.splice(index, 1);
        });
      }

    }
  }
  getAddress(evt: any, address: string, Name: string = '', Id: number = 0, from: string = '') {
    if (evt.currentTarget.checked) {
      if (Id != 0) {
        if (from == 'attorney')
          this.selectedAddressAttorney.push({ Id: Id, Name: Name, Address: address });
        else if (from == 'patient')
          this.selectedAddressPatient.push({ Id: Id, Name: Name, Address: address });
        else if (from == 'broker')
          this.selectedAddressBroker.push({ Id: Id, Name: Name, Address: address });
        else if (from == 'facility')
          this.selectedAddressFacility.push({ Id: Id, Name: Name, Address: address });
      }
    }
    else {
      if (from == 'attorney') {
        this.selectedAddressAttorney.forEach((item, index) => {
          if (item.Address == address) this.selectedAddressAttorney.splice(index, 1);
        });
      }
      else if (from == 'patient') {
        this.selectedAddressPatient.forEach((item, index) => {
          if (item.Address == address) this.selectedAddressPatient.splice(index, 1);
        });
      }
      else if (from == 'broker') {
        this.selectedAddressBroker.forEach((item, index) => {
          if (item.Address == address) this.selectedAddressBroker.splice(index, 1);
        });
      }
      else if (from == 'facility') {
        this.selectedAddressFacility.forEach((item, index) => {
          if (item.Address == address) this.selectedAddressFacility.splice(index, 1);
        });
      }
    }
  }
  insertPostMailValidation() {
    if (this.chkSendMethodMailModel) {
      if (this.addGetPostMailForm.Name.value || this.addGetPostMailForm.Address.value || this.addGetPostMailForm.City.value || this.addGetPostMailForm.StateID.value || this.addGetPostMailForm.ZipCode.value) {
        this.addPostMailForm.get('Name').setValidators([Validators.required]); this.addPostMailForm.get('Name').updateValueAndValidity();
        this.addPostMailForm.get('Address').setValidators([Validators.required]); this.addPostMailForm.get('Address').updateValueAndValidity();
        this.addPostMailForm.get('City').setValidators([Validators.required]); this.addPostMailForm.get('City').updateValueAndValidity();
        this.addPostMailForm.get('StateID').setValidators([Validators.required]); this.addPostMailForm.get('StateID').updateValueAndValidity();
        this.addPostMailForm.get('ZipCode').setValidators([Validators.required]); this.addPostMailForm.get('ZipCode').updateValueAndValidity();
      } else {
        this.clearPostMailValidation();
      }
    } else { this.clearPostMailValidation(); }
  }
  clearPostMailValidation() {
    this.addPostMailForm.get('Name').clearValidators(); this.addPostMailForm.get('Name').updateValueAndValidity();
    this.addPostMailForm.get('Address').clearValidators(); this.addPostMailForm.get('Address').updateValueAndValidity();
    this.addPostMailForm.get('City').clearValidators(); this.addPostMailForm.get('City').updateValueAndValidity();
    this.addPostMailForm.get('StateID').clearValidators(); this.addPostMailForm.get('StateID').updateValueAndValidity();
    this.addPostMailForm.get('ZipCode').clearValidators(); this.addPostMailForm.get('ZipCode').updateValueAndValidity();
  }
  insertCoverPageValidation(input: any, from: String) {
    if (this.chkSendMethodCoverPageModel && this.chkSendMethodFaxModel) {
      if (this.addGetCoverPageForm.From.value || this.addGetCoverPageForm.Attention.value || this.addGetCoverPageForm.Body.value) {
        this.addCoverPageForm.get('From').setValidators([Validators.required]); this.addCoverPageForm.get('From').updateValueAndValidity();
        this.addCoverPageForm.get('Attention').setValidators([Validators.required]); this.addCoverPageForm.get('Attention').updateValueAndValidity();
        this.addCoverPageForm.get('Body').setValidators([Validators.required]); this.addCoverPageForm.get('Body').updateValueAndValidity();
      } else {
        this.clearCoverPageValidation();
      }
    } else { this.clearCoverPageValidation(); }
  }
  clearCoverPageValidation() {
    this.addCoverPageForm.get('From').clearValidators(); this.addCoverPageForm.get('From').updateValueAndValidity();
    this.addCoverPageForm.get('Attention').clearValidators(); this.addCoverPageForm.get('Attention').updateValueAndValidity();
    this.addCoverPageForm.get('Body').clearValidators(); this.addCoverPageForm.get('Body').updateValueAndValidity();
  }

  sendDocuments() {
    this.submitted = true;   
    if (this.addEmailForm.invalid) {
      return;
    }
    if (this.addFaxForm.invalid) {
      return;
    }
    if (this.addPostMailForm.invalid) {
      return;
    }
    if (this.addCoverPageForm.invalid) {
      return;
    }
    this.getPostMail();
    this.getCoverPage();

    if (this.selectedEmailAttorney)
      this.updateInsertArray(this.AttorneyDetailsList, this.selectedEmailAttorney, 'email');
    if (this.selectedFaxAttorney)
      this.updateInsertArray(this.AttorneyDetailsList, this.selectedFaxAttorney, 'fax');
    if (this.selectedAddressAttorney)
      this.updateInsertArray(this.AttorneyDetailsList, this.selectedAddressAttorney, 'address');


    if (this.selectedEmailPatient)
      this.updateInsertArray(this.PatientDetailsList, this.selectedEmailPatient, 'email');
    if (this.selectedFaxPatient)
      this.updateInsertArray(this.PatientDetailsList, this.selectedFaxPatient, 'fax');
    if (this.selectedAddressPatient)
      this.updateInsertArray(this.PatientDetailsList, this.selectedAddressPatient, 'address');

    if (this.selectedEmailBroker)
      this.updateInsertArray(this.BrokerDetailsList, this.selectedEmailBroker, 'email');
    if (this.selectedFaxBroker)
      this.updateInsertArray(this.BrokerDetailsList, this.selectedFaxBroker, 'fax');
    if (this.selectedAddressBroker)
      this.updateInsertArray(this.BrokerDetailsList, this.selectedAddressBroker, 'address');

    if (this.selectedEmailFacility)
      this.updateInsertArray(this.FacilityDetailsList, this.selectedEmailFacility, 'email');
    if (this.selectedFaxFacility)
      this.updateInsertArray(this.FacilityDetailsList, this.selectedFaxFacility, 'fax');
    if (this.selectedAddressFacility)
      this.updateInsertArray(this.FacilityDetailsList, this.selectedAddressFacility, 'address');

    this.sendDocumentInput.Email = this.emailList();
    this.sendDocumentInput.Fax = this.faxList();
    this.sendDocumentInput.PostMail = this.postMail; 
    this.sendDocumentInput.IsIncludeCoverPage = this.chkSendMethodCoverPageModel
    this.sendDocumentInput.PatientId = this.patientId
    this.sendDocumentInput.FileName = this.fileName
    this.sendDocumentInput.DocType = this.docType
    this.sendDocumentInput.DocId = this.docId
    this.sendDocumentInput.CurrentUserId = this.storageService.user.UserId
    this.sendDocumentInput.FromPage = this.fromPage
    this.sendDocumentInput.CoverPage = this.coverPage
    this.sendDocumentInput.IsEmail=this.chkSendMethodEmailModel
    this.sendDocumentInput.IsFax=this.chkSendMethodFaxModel
    this.sendDocumentInput.IsPostMail=this.chkSendMethodMailModel
    this.sendDocumentInput.FromPageID=''
    this.sendDocumentInput.AttorneyDetails = this.AttorneyDetailsList
    this.sendDocumentInput.PatientDetails = this.PatientDetailsList
    this.sendDocumentInput.BrokerDetails = this.BrokerDetailsList
    this.sendDocumentInput.FacilityDetails = this.FacilityDetailsList
    this.sendDocumentInput.SendPostMailToUser = this.SendPostMailToUser
    this.sendDocumentService.sendDocumentToUser(true, this.sendDocumentInput).subscribe((res) => {
      var data: any = res;
      if (res != null) {
        console.log(res);
      }
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: data.responseCode == ResponseStatusCode.OK ? data.message : data.message,
        alertType: data.responseCode
      });
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getPostMail() {
    this.postMail.Name = this.addGetPostMailForm.Name.value
    this.postMail.Address = this.addGetPostMailForm.Address.value
    this.postMail.City = this.addGetPostMailForm.City.value
    this.postMail.State = this.addGetPostMailForm.StateID.value
    this.postMail.ZIP = this.addGetPostMailForm.ZipCode.value
  }
  getCoverPage() {
    this.coverPage.Attention = this.addGetCoverPageForm.Attention.value
    this.coverPage.Body = this.addGetCoverPageForm.Body.value
    this.coverPage.From = this.addGetCoverPageForm.From.value
    this.coverPage.PageCount = 0

  }
  emailList(): string[] {
    let allEmail: any = [];
    if (this.addGetEmailForm.FirstEmail.value)
      allEmail.push(this.addGetEmailForm.FirstEmail.value);
    if (this.addGetEmailForm.SecondEmail.value)
      allEmail.push(this.addGetEmailForm.SecondEmail.value);
    if (this.addGetEmailForm.ThirdEmail.value)
      allEmail.push(this.addGetEmailForm.ThirdEmail.value);
    return allEmail;
  }
  faxList(): string[] {
    let allFax: any = [];
    if (this.addGetFaxForm.FirstFax.value)
      allFax.push(this.addGetFaxForm.FirstFax.value);
    if (this.addGetFaxForm.SecondFax.value)
      allFax.push(this.addGetFaxForm.SecondFax.value);
    if (this.addGetFaxForm.ThirdFax.value)
      allFax.push(this.addGetFaxForm.ThirdFax.value);
    return allFax;
  }


  updateInsertArray(array, element, from) {
    element.forEach(item1 => {
      var itemFromArr2 = array.find(item2 => item2.Id == item1.Id);
      if (itemFromArr2) {
        if (from == 'email')
          itemFromArr2.Email = item1.Email;
        else if (from == 'fax')
          itemFromArr2.Fax = item1.Fax;
        else if (from == 'address')
          itemFromArr2.Address = item1.Address;
      } else array.push.apply(array, element.filter(item => item.Id == item1.Id));
    }
    )
  }

  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  unSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: '',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  get addGetEmailForm() { return this.addEmailForm.controls; }
  get addGetFaxForm() { return this.addFaxForm.controls; }
  get addGetPostMailForm() { return this.addPostMailForm.controls; }
  get addGetCoverPageForm() { return this.addCoverPageForm.controls; }

}


