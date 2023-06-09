import { Component, ElementRef, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { SignaturePad } from 'angular2-signaturepad';
import { CommonRegex } from 'src/app/constants/commonregex';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { PatientPortalStatusCode } from 'src/app/constants/patient-portal-status-code.enum';
import {
  patientPortalResponseStatus,
  PatientPortalStatusMessage,
  PatientPortalURL,
} from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { ViewportScroller } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-esignrequest',
  templateUrl: './esignrequest.component.html',
  styleUrls: ['./esignrequest.component.css'],
})
export class EsignrequestComponent implements OnInit {

  isShown: boolean = true;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('hiddenSignPopUp', { static: false }) hiddenSignPopUp: ElementRef;
  @ViewChild('hiddenSignDownloadModel', { static: false })
  hiddenSignDownloadModel: ElementRef;
  // @ViewChild('hiddentechLienSignModelModel', { static: false })
  // hiddentechLienSignModelModel: ElementRef;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('closeDownloadModelBtn') closeDownloadBtn: ElementRef;
  @ViewChild('hiddenAlreadyExistsDriverNamePopUp')
  hiddenAlreadyExistsDriverNamePopUp: ElementRef;
  @ViewChild('f', { static: true }) f: NgForm | any;
  model: any = { firstName: '', driverFirstName: '', signature: '' };
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  signaturePadOptions: Object = {
    // passed through to szimek/signature_pad constructor
    minWidth: 2,
    pecColor: 'rgb(66,133,244)',
    backgroundcolor: 'rgb(255,255,255)',
    canvasWidth: 750,
    canvasHeight: 200,
  };

  submitted = false;
  modelValue: string = 'modal';
  esignbodyDisabled: boolean = false;
  alreadySignedbodyDisabled: boolean = false;
  elecAgree: string;
  agreeCheck: boolean = false;
  AgreeEsignData: boolean = false;
  patientid: string = '';
  token: string;
  emailSendForm: FormGroup;
  allSignData: SignDataItem;
  allreferrerData: ReferrerDataItem;
  patientSignature: any = '';
  currFFZoom: any = 1;
  currIEZoom: any = 100;
  Name: string = '';
  firstNamePattern = '^\\W*(?:\\w+\\b\\W*){2,}$';
  isSignSuccessflyyMessage: boolean = false;
  isAlreadyExistsDriverName: boolean = false;
  message: string = '';
  readonly commonRegex = CommonRegex;

  fileList: File[] = [];
  listOfFiles: any[] = [];
  isLoading = false;
  selectedInputColor = 'black';
  selectedInputFont = '';
  selectedLanguageText = 'Choose Font';
  typeSignature = '';
  selectedModOfSignature = 'Type';
  eSignFromImage: any;
  selectedFile: any;
  fileName: any;
  pFirstSign: any;
  completedFirstSignature = false;
  completedSecondSignature = false;
  pSecondSign: any;
  signatureBox = 0;
  showNewSignImage: boolean = true;
  submittedSignature: boolean = false;
  textToImageSign: string;
  attorneySignature: string;
  attorneySigend: boolean = false;
  isDropdownLanguageVisible: boolean = false;
  isValidSignature: boolean = false;

  isRadAssigned: boolean;
  istechlienSigned: boolean;
  isradlienSigned: boolean;

  constructor(
    private Activatedroute: ActivatedRoute,
    private readonly patientService: PatientService,
    private readonly patientPortalService: PatientPortalService,
    private readonly storageService: StorageService,
    private fb: FormBuilder,
    private readonly notificationService: NotificationService,
    private readonly router: Router,
    protected sanitizer: DomSanitizer,
    private scroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.emailSendForm = this.fb.group({
      emailTxt: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.commonRegex.EmailRegex),
        ],
      ],
    });
    this.patientid = this.Activatedroute.snapshot.queryParams['patientid'];
    this.token = this.Activatedroute.snapshot.queryParams['Token'];
    if (this.patientid && this.token) {
      this.getEsignData();
    }
  }

  previewShow() {
    this.isShown = !this.isShown;
  }
  previewClose() {
    this.isShown = false;
  }

  selectLanguageOption() {
    document.getElementById('ChooseLanguageOption').classList.toggle("show");
  }

  onFileChanged(event: any) {
    this.isLoading = true;
    this.selectedFile = event.target.files[0];
    let selectedFileSize = event.target.files[0].size;
    if (selectedFileSize < 4096000) {
      this.fileName = this.selectedFile.name;
      this.signLien();
    }
    else {
      this.CodeErrorNotification('File size must be less than 4 mb');
    }
  }

  getEsignData(fromSign = true) {
    this.patientService.getEsignData(this.patientid, this.token).subscribe(
      (res) => {
        if (res.responseCode === 200) {
          this.elecAgree = res.response['elecAgree'];

          if (res.response['signData'].length > 0)
            this.allSignData = res.response['signData'][0];

          if (res.response['referrerDetail'].length > 0)
            this.allreferrerData = res.response['referrerDetail'][0];

          if (this.allSignData.PatientSignature) {
            this.patientSignature =
              this.sanitizer.bypassSecurityTrustResourceUrl(
                this.allSignData.PatientSignature
              );
          }
          if (this.allreferrerData.ReadingPhysician) {
            this.isRadAssigned = true;
          } else {
            this.isRadAssigned = false;
          }
          this.Name = this.allSignData.FullNameLF.toString();
          if (this.Name) {
            var splits = this.allSignData.FullNameLF.toString().split(' ');
            if (splits.length > 1) this.Name = splits.slice(1).join(' ');
          }
          if (this.allSignData.PSL_TC && !this.allSignData.psl_p) {
            this.completedFirstSignature = true;
            this.istechlienSigned = true;
            this.isradlienSigned = false;
            if (this.isRadAssigned) {
              this.showNewSignImage = true;
            }
            else {
              this.showNewSignImage = false;
            }
            this.pFirstSign = this.allSignData.PatientSignature;
            this.model.signature = this.pFirstSign;
            this.textToImageSign = this.pFirstSign;
            this.eSignFromImage = this.pFirstSign;
          }
          if (this.allSignData.asaslesign || this.allSignData.ASL_TC) {
            if (this.allSignData.AttorneySignature) {
              this.attorneySigend = true;
              this.attorneySignature = this.allSignData.AttorneySignature;
            }
          }
          if (this.allSignData.pslesign) {
            this.alreadySignedbodyDisabled = true;
            this.submittedSignature = true;
            this.istechlienSigned = true;
            this.isradlienSigned = true;
            if (this.allSignData.PatientSignature) {
              this.completedFirstSignature = true;
              this.completedSecondSignature = true;
              this.showNewSignImage = false;
              this.pFirstSign = this.allSignData.PatientSignature;
              if (this.isRadAssigned)
                this.pSecondSign = this.allSignData.PatientSignature;
            }
          }
          else {
            if (!fromSign) {
              this.hiddenSignPopUp.nativeElement.click();
            }
          }
          this.updateDriverName();
          if (fromSign) {
            this.patientService.sendDataToEsignrequestKeeper.subscribe(
              (res) => {
                this.agreeCheck = res;
                this.AgreeEsignData = res;
                if (!res) {
                  if (!this.allSignData.pslesign) {
                    this.esignbodyDisabled = true;
                  }
                }
              }
            );
          }
        } else {
          this.error(res);
        }
      },
      (err: any) => {
        this.error(err);
      }
    );
  }

  updateDriverName() {
    if (this.allSignData.AttorneyDriverName && this.allSignData.DriverName) {
      this.model.driverFirstName = this.allSignData.DriverName;
      this.isAlreadyExistsDriverName = true;
    } else if (this.allSignData.AttorneyDriverName) {
      this.model.driverFirstName = this.allSignData.AttorneyDriverName;
      this.isAlreadyExistsDriverName = true;
    } else if (this.allSignData.DriverName) {
      this.model.driverFirstName = this.allSignData.DriverName;
      this.isAlreadyExistsDriverName = true;
    }
  }

  confirmDriverName(isTrue) {
    if (isTrue) {
      this.isAlreadyExistsDriverName = false;
      this.model.driverFirstName = '';
    } else {
      this.updateDriverName();
    }
  }

  checkdriverFirstName() {
    if (this.model.driverFirstName && this.isAlreadyExistsDriverName) {
      this.hiddenAlreadyExistsDriverNamePopUp.nativeElement.click();
    }
  }

  signConfirm(isConfirmSign: boolean) {
    this.emailSendForm.reset();
    this.f.resetForm();
    this.signaturePad.clear();
    this.model.signature = '';
  }

  downloadSignFile() {
    this.patientService
      .download(this.patientid, this.Name, 'esignrequest')
      .subscribe(
        (res) => {
          if (res.responseCode === 200) {
            let response = JSON.parse(res.response);
            this.downloadFile(response['FileName'], response['filebytes']);
            this.successNotification(res);
            //this.closeDownloadBtn.nativeElement.click();
          } else {
            this.error(res);
          }
        },
        (err: any) => {
          this.error(err);
        }
      );
  }

  plus() {
    var step = 0.02;
    this.currFFZoom += step;
    $('body').css('MozTransform', 'scale(' + this.currFFZoom + ')');
    var stepie = 2;
    this.currIEZoom += stepie;
    $('body').css('zoom', ' ' + this.currIEZoom + '%');
  }
  minus() {
    var step = 0.02;
    this.currFFZoom -= step;
    $('body').css('MozTransform', 'scale(' + this.currFFZoom + ')');
    var stepie = 2;
    this.currIEZoom -= stepie;
    $('body').css('zoom', ' ' + this.currIEZoom + '%');
  }

  submitSign(isItemSign: boolean) {
    if (this.isRadAssigned) {
      if (this.completedFirstSignature === true &&
        this.completedSecondSignature === true) {
        if (this.selectedModOfSignature === 'Draw') {
          if (this.f.valid) {
            let data = {
              patientid: this.allSignData.PATIENTID,
              AttorneyName: this.allSignData.AttorneyFullName,
              attorneysignature: this.allSignData.AttorneySignature,
              patientsignature: this.model.signature,
              Name: this.model.firstName ? this.model.firstName : this.allSignData.SignatureName,
              DriverName: this.model.driverFirstName,
            };

            this.patientService
              .insertESignatureLien(data, 'esignrequest')
              .subscribe(
                (res) => {
                  if (res.response === true) {
                    this.submittedSignature = true;
                    this.hiddenSignDownloadModel.nativeElement.click();
                    this.message = res.message;
                  } else {
                    this.error(res);
                  }
                },
                (err: any) => {
                  this.error(err);
                }
              );
            this.f.submitted = false;
          }
        } else if (this.selectedModOfSignature === 'Type') {
          let data = {
            patientid: this.allSignData.PATIENTID,
            AttorneyName: this.allSignData.AttorneyFullName,
            attorneysignature: this.allSignData.AttorneySignature,
            patientsignature: this.textToImageSign,
            Name: this.typeSignature ? this.typeSignature : this.allSignData.SignatureName,
            DriverName: this.model.driverFirstName,
          };

          this.patientService
            .insertESignatureLien(data, 'esignrequest')
            .subscribe(
              (res) => {
                if (res.response === true) {
                  this.hiddenSignDownloadModel.nativeElement.click();
                  this.submittedSignature = true;
                  this.message = res.message;
                } else {
                  this.error(res);
                }
              },
              (err: any) => {
                this.error(err);
              }
            );

          this.f.submitted = false;
        } else {
          let data = {
            patientid: this.allSignData.PATIENTID,
            AttorneyName: this.allSignData.AttorneyFullName,
            attorneysignature: this.allSignData.AttorneySignature,
            patientsignature: this.eSignFromImage,
            Name: this.model.firstName ? this.model.firstName : this.allSignData.SignatureName,
            DriverName: this.model.driverFirstName,
          };
          this.patientService
            .insertESignatureLien(data, 'esignrequest')
            .subscribe(
              (res) => {
                if (res.response === true) {
                  this.hiddenSignDownloadModel.nativeElement.click();
                  this.submittedSignature = true;
                  this.message = res.message;
                } else {
                  this.error(res);
                }
              },
              (err: any) => {
                this.error(err);
              }
            );
          this.f.submitted = false;
        }
        this.istechlienSigned = true;
        this.isradlienSigned = true;
        this.alreadySignedbodyDisabled = true;
      } else {
        this.CodeErrorNotification('Please sign In both Places');
      }
    }
    else {
      if (this.selectedModOfSignature === 'Draw') {
        if (this.f.valid) {
          let data = {
            patientid: this.allSignData.PATIENTID,
            AttorneyName: this.allSignData.AttorneyFullName,
            attorneysignature: this.allSignData.AttorneySignature,
            patientsignature: this.model.signature,
            Name: this.model.firstName,
            DriverName: this.model.driverFirstName,
          };

          this.patientService
            .insertESignatureLien(data, 'esignrequest')
            .subscribe(
              (res) => {
                if (res.response === true) {
                  this.submittedSignature = true;
                  this.completedFirstSignature = true;
                  // this.hiddentechLienSignModelModel.nativeElement.click();
                  this.hiddenSignDownloadModel.nativeElement.click();
                  this.istechlienSigned = true;
                  this.message = res.message;
                } else {
                  this.error(res);
                }
              },
              (err: any) => {
                this.error(err);
              }
            );
          this.f.submitted = false;
        }
      } else if (this.selectedModOfSignature === 'Type') {
        let data = {
          patientid: this.allSignData.PATIENTID,
          AttorneyName: this.allSignData.AttorneyFullName,
          attorneysignature: this.allSignData.AttorneySignature,
          patientsignature: this.textToImageSign,
          Name: this.typeSignature,
          DriverName: this.model.driverFirstName,
        };

        this.patientService
          .insertESignatureLien(data, 'esignrequest')
          .subscribe(
            (res) => {
              if (res.response === true) {
                // this.hiddentechLienSignModelModel.nativeElement.click();
                this.hiddenSignDownloadModel.nativeElement.click();
                this.submittedSignature = true;
                this.completedFirstSignature = true;
                this.istechlienSigned = true;
                this.message = res.message;
              } else {
                this.error(res);
              }
            },
            (err: any) => {
              this.error(err);
            }
          );

        this.f.submitted = false;
      } else {
        let data = {
          patientid: this.allSignData.PATIENTID,
          AttorneyName: this.allSignData.AttorneyFullName,
          attorneysignature: this.allSignData.AttorneySignature,
          patientsignature: this.eSignFromImage,
          Name: this.model.firstName,
          DriverName: this.model.driverFirstName,
        };
        this.patientService
          .insertESignatureLien(data, 'esignrequest')
          .subscribe(
            (res) => {
              if (res.response === true) {
                // this.hiddentechLienSignModelModel.nativeElement.click();
                this.hiddenSignDownloadModel.nativeElement.click();
                this.istechlienSigned = true;
                this.completedFirstSignature = true;
                this.submittedSignature = true;
                this.message = res.message;
              } else {
                this.error(res);
              }
            },
            (err: any) => {
              this.error(err);
            }
          );
        this.f.submitted = false;
      }
      this.alreadySignedbodyDisabled = true;
    }
  }

  ngAfterViewInit() {
    if (this.signaturePad) {
      this.signaturePad.set('minWidth', 3);
      this.signaturePad.clear();
    }
  }
  clearSign(): void {
    this.signaturePad.clear();
    this.model.signature = '';
  }

  drawComplete() {
    this.model.signature = this.signaturePad.toDataURL();
  }
  drpactionChanges(event) {
    this.previewAndSave(event.target.value);
  }
  eventCheck(event) {
    this.agreeCheck = event.target.checked;
  }
  openlien() {
    if (this.agreeCheck) {
      this.esignbodyDisabled = false;
      this.AgreeEsignData = true;
    } else {
      this.CodeErrorNotification(
        'Please Agree to use electronics records and signature.'
      );
    }
  }

  previewAndSave(type: number) {
    this.patientService
      .printPreview(this.patientid, this.Name, 'esignrequest')
      .subscribe(
        (res) => {
          if (res.responseCode === 200) {
            let response = JSON.parse(res.response);
            if (type == 1) {
              this.print(response);
            } else if (type == 2) {
              this.downloadFile(response['FileName'], response['filebytes']);
            }
          } else {
            this.error(res);
          }
        },
        (err: any) => {
          this.error(err);
        }
      );
  }

  print(response: any) {
    let blobUrl = URL.createObjectURL(
      new Blob([this._base64ToArrayBuffer(response['filebytes'])], {
        type: 'application/pdf',
      })
    );
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = this.sanitizer.sanitize(
      SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl)
    );
    document.body.appendChild(iframe);
    iframe.contentWindow.print();
  }

  downloadFile(fileName, fileData) {
    var source;
    let fileExtension = fileName.split('.').pop();
    const link = document.createElement('a');
    if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
      source = 'data:image/' + fileExtension + ';base64,' + fileData;
    } else if (fileName.match(/.(pdf)$/i)) {
      source = 'data:application/pdf;base64,' + fileData;
    }
    link.href = source;
    link.download = `${fileName}`;
    link.click();
  }
  sendEmailbtn(isItemRename: boolean) {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.emailSendForm.invalid) {
      this.modelValue = '';
      return;
    }
    if (isItemRename) {
      let Email = this.refemailSendForm.emailTxt.value.trim();
      if (Email) {
        let data = {
          patientid: this.patientid,
          givenname: this.Name,
          MailTo: Email,
          FromPage: 'esignrequest',
        };
        this.patientService
          .sendEmail(JSON.stringify(JSON.stringify(data)))
          .subscribe(
            (res) => {
              if (res.responseCode === 200) {
                // this.isSignSuccessflyyMessage = true;
                this.closeDownloadBtn.nativeElement.click();
                this.onSuccessRedirect();
                // this.successNotification(res);
              } else {
                this.error(res);
              }
            },
            (err: any) => {
              this.error(err);
            }
          );
      }
    }
  }
  onSuccessClose() {
    this.onSuccessRedirect();
  }

  onSuccessRedirect() {
    if (
      localStorage.getItem('p_detail') !== null &&
      localStorage.getItem('p_detail') != undefined
    ) {
      if (this.isRadAssigned) {
        var data = {
          patientId: this.patientid,
          pageCompleted: PatientPortalStatusCode.LIEN_SIGNED,
          loggedPartnerId: this.storageService.PartnerId,
          jwtToken: this.storageService.PartnerJWTToken,
          patientPreferredLanguage: 'english',
        };
        this.patientPortalService.UpdatePatientPageCompleted(data, true).subscribe((res: any) => {
          if (res) {
            if (res.responseStatus == patientPortalResponseStatus.Success)
              this.router.navigate([PatientPortalURL.PATIENT_HOME]);
          }
        },
          (err: any) => {
            this.patientPortalService.errorNotification(
              PatientPortalStatusMessage.COMMON_ERROR
            );
          }
        );
      }
    } else {
      this.alreadySignedbodyDisabled = true;
    }
  }

  changelanguage(event) {
    if (event.target.checked === false) {
      this.router.navigate(['patient/esignrequests'], {
        queryParams: { patientid: this.patientid, Token: this.token },
      });
      this.patientService.sendDataToEsignrequestWindow(this.AgreeEsignData);
    }
  }

  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  }

  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  navigateToPage(number) {
    if (number == 1)
      document
        .getElementById('page1')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (number == 2)
      document
        .getElementById('page2')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  navigateToStartPage(number) {
    if (number == 1)
      document
        .getElementById('startPage1')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    if (number == 2)
      document
        .getElementById('startPage2')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  btnStartScroll() {
    if (this.isRadAssigned && this.istechlienSigned) {
      document
        .getElementById('startPage2')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
    } else {
      if(this.completedFirstSignature){
        document
        .getElementById('startPage2')
        .scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      else if(this.completedSecondSignature){
        document.getElementById('startPage1').scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      else{
      document.getElementById('startPage1').scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
  }

  switchLanguage(lan) {
    if (lan === 'Spanish') {
      this.router.navigate(['patient/esignrequests'], {
        queryParams: { patientid: this.patientid, Token: this.token },
      });
    } else {
      this.router.navigate(['patient/esignrequest'], {
        queryParams: { patientid: this.patientid, Token: this.token },
      });
    }
  }

  changeInputLanguage(inputLanguage: string) {
    if (inputLanguage === 'TheSuavity') {
      this.selectedInputFont = 'TheSuavity';
      this.selectedLanguageText = 'The Suavity';
    } else if (inputLanguage === 'MrDeHaviland') {
      this.selectedInputFont = 'MrDeHaviland';
      this.selectedLanguageText = 'MrDeHaviland';
    } else {
      this.selectedInputFont = 'HighSummit';
      this.selectedLanguageText = 'High Summit';
    }
    this.textToImageBase64();
  }

  changeInputColor(inputColor: string) {
    if (inputColor === 'black') {
      this.selectedInputColor = 'black';
    } else if (inputColor === 'blue') {
      this.selectedInputColor = 'blue';
    } else {
      this.selectedInputColor = 'red';
    }
    this.textToImageBase64();
  }

  selectedTab(selectedTab: string) {
    this.clearData();
    this.selectedModOfSignature = selectedTab;
  }

  textToImageBase64() {
    (this.typeSignature.length > 0)?this.typeSignature = ' '+ this.typeSignature.trimLeft() : this.typeSignature = '';
    let tCtx = this.canvas.nativeElement.getContext('2d');
    tCtx.canvas.width = tCtx.measureText(this.typeSignature).width;
    let font = '25px Arial';
    let color = 'black';
    let width = this.typeSignature.length * 10;
    this.canvas.nativeElement.width = width;
    if (this.selectedInputFont) {
      font = '25px ' + this.selectedInputFont;
    }
    if (this.selectedInputColor) {
      color = this.selectedInputColor;
    }
    tCtx.fillStyle = color;
    tCtx.font = font;
    tCtx.fillText(this.typeSignature, 0, 50, width);
    this.textToImageSign = tCtx.canvas.toDataURL();
  }

  signLien() {
    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);
    reader.onload = () => {
      this.eSignFromImage = reader.result;
    };
  }

  signatureClick(number) {
    this.signatureBox = number;
  }

  completeSignature() {
    if (this.isRadAssigned) {
      if (this.signatureBox === 1) {
        if (this.selectedModOfSignature === 'Draw') {
          this.pFirstSign = this.model.signature;
        } else if (this.selectedModOfSignature === 'Type') {
          this.pFirstSign = this.textToImageSign;
        } else {
          this.pFirstSign = this.eSignFromImage;
        }
        this.completedFirstSignature = true;
        this.closeBtn.nativeElement.click();
        document.getElementById('startPage2').scrollIntoView({ block: 'start', behavior: 'smooth' });
      } else {
        if (this.selectedModOfSignature === 'Draw') {
          this.pSecondSign = this.model.signature;
        } else if (this.selectedModOfSignature === 'Type') {
          this.pSecondSign = this.textToImageSign;
        } else {
          this.pSecondSign = this.eSignFromImage;
        }
        this.completedSecondSignature = true;
        this.closeBtn.nativeElement.click();
        document
          .getElementById('startPage1')
          .scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
    }
    else {
      if (this.selectedModOfSignature === 'Draw') {
        this.pFirstSign = this.model.signature;
      } else if (this.selectedModOfSignature === 'Type') {
        this.pFirstSign = this.textToImageSign;
      } else {
        this.pFirstSign = this.eSignFromImage;
      }
      this.submitSign(true);
      this.closeBtn.nativeElement.click();
      this.showNewSignImage = false;
    }
  }

  acceptCompletedSignature(number) {
    if (number === 1) {
      this.pFirstSign = this.pSecondSign;
      this.completedFirstSignature = true;
    } else {
      this.pSecondSign = this.pFirstSign;
      this.completedSecondSignature = true;
    }
    this.submitSign(true);
    this.showNewSignImage = false;
  }

  showLanguages(e: any) {
    this.isDropdownLanguageVisible = !this.isDropdownLanguageVisible;
    e.stopPropagation();
  }

  clearData() {
    this.model.signature = '';
    this.model.firstName = '';
    this.model.driverFirstName = this.allSignData.AttorneyDriverName ? this.allSignData.AttorneyDriverName : '';
    this.typeSignature = '';
    this.selectedModOfSignature = 'Type';
    this.selectedInputColor = 'black';
    this.selectedInputFont = 'HighSummit';
    this.selectedLanguageText = 'High Summit';
    this.eSignFromImage = '';
    this.selectedFile = '';
    this.fileName = '';
    this.signaturePad.clear();
  }

  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode,
    });
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: msg,
      alertType: 400,
    });
  }

  error(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.response,
      alertType: err.status,
    });
  }
  get refemailSendForm() {
    return this.emailSendForm.controls;
  }
}
export class SignDataItem {
  PATIENTID: string;
  STUDYDATETIME: string;
  FullNameLF: string;
  BIRTHDATE: string;
  AttorneyFullName: string;
  AttorneyAddress: string;
  AttorneyCityState: string;
  AttorneyDriverName: string;
  Currentdate: string;
  DriverName: string;
  BusinessPhoneNumber: string;
  AttorneyFaxNumber: string;
  InjuryDate: string;
  phone: string;
  pslesign: string;
  AttorneySignature: string;
  PatientSignature: string;
  signdate: string;
  asaslesign: string;
  smslink: string;
  fullname: string;
  psl_p: any;
  PSL_TC: any;
  ASL_P: any;
  ASL_TC: any;
  SignatureName: string;
}
export class ReferrerDataItem {
  patientBillName: string;
  RadEmail: string;
  RadAddress: string;
  RadPhone: string;
  RadFax: string;
  ReadingPhysician: string;
}
