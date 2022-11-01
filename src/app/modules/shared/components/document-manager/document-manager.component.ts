import { AfterViewChecked, AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DocumentManagerModel, DocumentManagerAlert, AlertInfoPayload } from 'src/app/models/document.manager';
import { DocumentmanagerService } from 'src/app/services/document-manager-service/document.manager.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/common/storage.service';
import { DxFileManagerComponent } from 'devextreme-angular';
import { saveAs } from '@progress/kendo-file-saver';
import { DatePipe, formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { interval, observable, Subscription, Subject } from 'rxjs';
import { SendDocumentService } from 'src/app/services/send-document-service/Send.document.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { DwtService } from '../../../../services/dwt.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PatientService } from '../../../../services/patient/patient.service';
import { ConstantPool } from '@angular/compiler';
import { Console } from 'console';
import { environment } from '../../../../../environments/environment';
declare const $: any;

@Component({
  selector: 'app-document-manager',
  templateUrl: './document-manager.component.html',
  styleUrls: ['./document-manager.component.css'],
  providers: [DocumentmanagerService],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None

})
export class DocumentManagerComponent implements OnInit, AfterViewInit {
  eventsSubject: Subject<void> = new Subject<void>();
  apiUrl: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.eventsSubject.next(event);
  }
  @ViewChild('hiddenCommonMessagePopUpButton', { static: false }) hiddenCommonMessagePopUpButton: ElementRef;
  @ViewChild('hiddenShowSendDocumentPopUp', { static: false }) hiddenShowSendDocumentPopUp: ElementRef;
  @ViewChild(DxFileManagerComponent, { static: false }) fileManager: DxFileManagerComponent;
  @ViewChild('hiddenUploadFilePopUp', { static: false }) hiddenUploadFilePopUp: ElementRef;
  @ViewChild('hiddenFileDeleteItem', { static: false }) hiddenFileDeleteItem: ElementRef;
  @ViewChild('hiddenFileRenamePopUpItem', { static: false }) hiddenFileRenamePopUpItem: ElementRef;

  @ViewChild('hiddenAlertInfoPopUp', { static: false }) hiddenAlertInfoPopUp: ElementRef;
  @ViewChild('hiddenViewFile', { static: false }) hiddenViewFile: ElementRef;
  @ViewChild('fileUpload', { static: false }) fileUploadElement: ElementRef;
  @ViewChild('hiddenDynamsoftScannerPopUp', { static: false }) hiddenDynamsoftScannerPopUp: ElementRef;
  path: any
  fileData: SafeResourceUrl;
  fileName: string;
  popupVisible = false;
  CustomMenuItem: any;
  CustomToolBarItem1: any;
  CustomToolBarItem2: any;
  selectedFileKeys: any = [];
  selectedFileNames: any = [];
  selectedFileBase64String: any = [];
  documentTypeList: any = [];
  selectedDocumentTypeId: any = '';
  selectedUploadFile: any[] = [];
  fileItems: DocumentManagerModel[] = [];
  fileItemsSelectedx: DocumentManagerModel[] = [];
  selectedFileItems: DocumentManagerModel[];
  documentManagerAlert: DocumentManagerAlert;
  alertInfo: AlertInfoPayload;
  selectedHasAlertId: number;
  currentPatientId: string = '';
  tabId: string = 'All'
  downloadAllBasePath: any;
  commonPopUpMessage: string = ''
  docTypeModelChange: boolean = false;
  currentDeleteItemRecord: any = {};
  selectedDeletedDoc: any = [];
  fromPage: string = '';
  selectedFileForSendDocument: string = '';
  renameForm: FormGroup;
  currentRenameItemRecord: any = {};
  submitted = false;
  modelValue: string = 'modal';
  GetRenameFileExtension: string = '';
  isfileSizeOk: boolean = false;
  patientName: string = '';
  headerTitle: string = '';
  selectedFileData: any;
  billArray: any;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  show: boolean = false;
  @HostListener('document:click', ['$event'])
  onClickEvent(event: MouseEvent) {
    let docManagerHeadertd = <HTMLElement>event.target;
    let spanElement = docManagerHeadertd.classList.contains('dx-datagrid-text-content');
    if (!spanElement) { spanElement = docManagerHeadertd.classList.contains('dx-datagrid-action') }
    if (spanElement) {
      setTimeout(() => {
        this.setFileManagerRowColor();
      }, 500)
    }
    // let docManagerHeadertd = <HTMLElement>event.target;
    // let spanElement = <HTMLElement>docManagerHeadertd.getElementsByClassName('dx-sort')[0];
    // if(!spanElement){
    //    spanElement = <HTMLElement>docManagerHeadertd.getElementsByClassName('dx-sort-indicator')[0];
    // }
    // if (spanElement?.classList.contains('dx-sort') || docManagerHeadertd?.classList.contains('dx-sort')) {
    //   //this.setFileManagerRowColor();
    //   setTimeout(() => {
    //     this.setFileManagerRowColor();
    //   }, 400)
    // }
  }
  currentEnv = "";
  bStartUp = true;
  bNoInstall = false;
  bMobile = false;
  bShowCameraOption = false;
  bUseCameraViaDirectShow = false;
  startText = 'start Scanner';

  constructor(private readonly documentmanagerService: DocumentmanagerService, private readonly notificationService: NotificationService,
    private readonly commonService: CommonMethodService, private sanitizer: DomSanitizer, private readonly storageService: StorageService,
    private elementRef: ElementRef, private router: Router, private readonly sendDocumentService: SendDocumentService, private fb: FormBuilder, private datePipe: DatePipe, private readonly patientService: PatientService,) {
    this.alertInfo = new AlertInfoPayload();
    this.documentManagerAlert = new DocumentManagerAlert();
    this.commonPopUpMessage = '';
    this.CustomMenuItem = {
      items: [{ text: 'Open' }, { text: 'Send Document' }, { text: 'Delete' }, { text: 'Rename' }, { text: 'Upload' }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.CustomToolBarItem1 = {
      items: [{ text: 'Upload' }, { text: 'Scan' }, { text: 'Download All Files' }, { text: 'Delete Selected Files' }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.CustomToolBarItem2 = {
      items: [{ text: 'Download Selected' }, { text: 'Delete Selected Files' }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.onItemClick = this.onItemClick.bind(this);
    this.apiUrl = `${environment.baseUrl}/v${environment.currentVersion}/`;

  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.submitted = false;

    this.commonService.getListObservable.subscribe((patientId) => {
      this.headerTitle = '';
      this.fromPage = this.getPageName();
      this.currentPatientId = patientId;
      console.log('m ' + this.currentPatientId)
      this.getPatientDocument(this.currentPatientId, 'All');
      this.getDocumentType();

    });

    this.commonService.docManagerSubjectObservableForDocComp.subscribe((patientId) => {
      this.headerTitle = '';
      this.fromPage = this.getPageName();
      this.currentPatientId = patientId;
      console.log('m ' + this.currentPatientId)
      this.getPatientDocument(this.currentPatientId, 'All');
      this.getDocumentType();

    });
    this.renameForm = this.fb.group({
      renameTxt: ['', [Validators.required]]
    });

  }

  getPageName(): string {

    let fromPage: string = this.router.url.split('/').pop();
    if (fromPage == 'dashboard') {
      return 'Patient';
    }
    else {
      return fromPage;
    }

  }
  getUnique(arr, comp) {
    arr.forEach(x => x.uploadedOn === this.datePipe.transform(x.uploadedOn, DateTimeFormatCustom.DateTime))
    const unique = arr.map(e => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e]).map(e => arr[e]);
    return unique;
  }


  getPatientDocument(patientId: string, docTypeText: string) {
    this.fileItems = [];
    this.documentmanagerService.getPatientFileById(true, patientId, docTypeText).subscribe((res) => {
      if (res.response != null) {
        //this.fileItems = res.response;
        this.fileItems = this.getUnique(res.response, 'name');
        this.getBillDataInArray();
        this.fileItemsSelectedx = res.response;
        if (res.response[0].patientLastName || res.response[0].patientFirstName) {
          this.patientName = res.response[0].patientLastName + ', ' + res.response[0].patientFirstName;
          this.patientName = this.patientName.trim();
          this.headerTitle = this.currentPatientId + ' - ' + (this.patientName ? this.patientName + ' - ' : '');
        }
        setTimeout(() => {
          let that = this;
          $('#docManager').find('.dx-state-readonly').addClass('testSuresh').removeClass('dx-state-readonly');
          $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').unbind()
          $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').click(function (e) {
            that.getSelectedFiled($(this).parent().parent().index(), $(this).find('input').val())
          })

          if ($('#docManager').find('.dx-datagrid-adaptive-more').length > 0) {
            this.bindDocFromAttorneyDotsOnclick();
          }
          else {
            this.bindDocFromAttorneyOnclick();
          }
        }, 1000);
      }
      else {
        this.fileItems = [];
        this.documentmanagerService.getPatientName(true, patientId).subscribe((res) => {
          if (res.response) {
            if (res.response[0].PATIENTLASTNAME || res.response[0].PATIENTFIRSTNAME) {
              this.patientName = res.response[0].PATIENTLASTNAME + ', ' + res.response[0].PATIENTFIRSTNAME;
              this.patientName = this.patientName.trim();
              this.headerTitle = this.currentPatientId + ' - ' + (this.patientName ? this.patientName + ' - ' : '');
            }
            setTimeout(() => {
              let that = this;
              $('#docManager').find('.dx-state-readonly').addClass('testSuresh').removeClass('dx-state-readonly');
              $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').unbind()
              $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').click(function (e) {
                that.getSelectedFiled($(this).parent().parent().index(), $(this).find('input').val())
              })
              if ($('#docManager').find('.dx-datagrid-adaptive-more').length > 0) {
                this.bindDocFromAttorneyDotsOnclick();
              }
              else {
                this.bindDocFromAttorneyOnclick();
              }
            }, 1000);
          }
        }, (err: any) => {
          this.errorNotification(err);
        })
      }
    }, (err) => {
      this.errorNotification(err);
    })
  }
  bindDocFromAttorneyDotsOnclick() {

    let that = this;
    setTimeout(() => {
      //dx-datagrid-adaptive-more
      $('#docManager').find('.dx-datagrid-adaptive-more').unbind();
      $('#docManager').find('.dx-datagrid-adaptive-more').click(function () {
        that.bindDocFromAttorneyOnclick();
      })
    }, 1000);
  }

  bindDocFromAttorneyOnclick() {
    let that = this;
    setTimeout(() => {
      $('#docManager').find('.dx-state-readonly').addClass('testSuresh').removeClass('dx-state-readonly');
      $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').unbind()
      $('#docManager').find('#fileManager').find('.dx-datagrid-table .testSuresh').click(function (e) {
        that.getSelectedFiled($(this).parent().parent().index(), $(this).find('input').val())
      })
      that.makeRowhighlight();
    }, 100);
  }

  getSelectedFiled(index: number, value: any) {
    this.documentmanagerService.UpdateDocumentByDocId(this.fileItems[index].docId, value).subscribe((res) => {

      if (res.response != null) {
        if (res.responseCode == 200) {

          this.successNotification(res);
          //  alert(res.message);
        }
        else {
          this.errorNotification(res);
        }
      }
    }, (err: any) => {
      this.errorNotification(err);
    })

  }
  getFilesByKey(name: any, path: any, text: any, e: any) {
    this.documentmanagerService.getFilesByKey(true, JSON.stringify(path)).subscribe((res) => {
      if (res.response != null) {
        this.path = JSON.parse(res.response).Base64;
        if (text == 'Open') {
          this.displayFile(name, e.file.dataItem.filePath);
        }
        else if (text == 'Download Selected') {
          this.downloadFile(this.selectedFileNames, this.path);
        }
      }
      if (text == 'Download Selected') {
        this.downloadFile(this.selectedFileNames, this.selectedFileBase64String);
      }
    })
  }
  onItemClick(e) {
    if (e.itemData.text == 'Open') {
      if (this.selectedFileKeys.length == 1) {
       // this.getFilesByKey(e.fileSystemItem.dataItem.name, e.fileSystemItem.dataItem.filePath, e.itemData.text, e)
         this.displayFile(e.fileSystemItem.dataItem.name, this.path);
        // call the Api here. It takes 1 parameter the base64 string
      }
      else if (this.selectedFileKeys.length > 1) {
        this.CodeErrorNotification('Only single file can display.');
      }
      else {
        this.CodeErrorNotification('Please select a file to display.');
      }
    }
    else if (e.itemData.text == 'Download Selected') {

      if (this.selectedFileKeys.length == 1) {
        this.downloadFile(this.selectedFileNames, this.selectedFileBase64String)
        //this.getFilesByKey(this.selectedFileNames, this.path, e.itemData.text, e)
        //this.clearSelectedFields();
      }
      else if (this.selectedFileKeys.length > 1) {
        this.getFilesByKeys(e.itemData.text)
        //this.downloadAllFilesAsZipFile(this.selectedFileItems);
      }
      else {
        this.CodeErrorNotification('Please select file to download.');
      }
    }
    else if (e.itemData.text == 'Download All Files') {
      this.getFilesByKeys(e.itemData.text)
      //this.downloadAllFilesAsZipFile(this.fileItems);
    }
    else if (e.itemData.text == 'Upload') {
      this.docTypeModelChange = false;
      this.selectedDocumentTypeId = '';
      this.selectedUploadFile = [];
      this.fileUploadElement.nativeElement.value = '';
      this.hiddenUploadFilePopUp.nativeElement.click();
    }
    else if (e.itemData.text == 'Scan') {
      this.docTypeModelChange = false;
      this.selectedDocumentTypeId = '';
      this.selectedUploadFile = [];
      this.fileUploadElement.nativeElement.value = '';
      this.toggleStartDemo();
      this.hiddenDynamsoftScannerPopUp.nativeElement.click();

    }
    else if (e.itemData.text == 'Send Document') {
      if (this.selectedFileKeys.length == 1) {
        this.selectedFileForSendDocument = this.selectedFileKeys[0];
        this.hiddenShowSendDocumentPopUp.nativeElement.click();
        let data: any = {
          'patientId': this.currentPatientId,
          'fileName': this.selectedFileKeys[0],
          'patientFullName': this.fileItems[0].patientLastName + ',' + this.fileItems[0].patientFirstName,
          'docId': this.fileItems[0].docId,
          'docType': this.fileItems[0].docType,
          'fromPage': this.fromPage
        }
        this.sendDocumentService.sendDataToDocumentSendComponent(data);
      }
      else if (this.selectedFileKeys.length > 1) {
        //this.showCommonPopUp('only single file can send at a time.');
        this.CodeErrorNotification('only single file can send at a time.');
      }
      else {
        this.CodeErrorNotification('Please select a single file to send.');
      }
    }
    else if (this.selectedFileKeys.length > 1 && e.itemData.text == 'Delete Selected Files') {
      if (this.selectedFileKeys.length > 1) {
        this.selectedDeletedDoc = [];
        this.currentDeleteItemRecord = null;
        for (let i = 0; i < this.selectedFileItems.length; i++) {
          this.selectedDeletedDoc.push({
            docId: this.selectedFileItems[i].docId,
            Files: this.selectedFileItems[i].name,
            ReferreId: this.selectedFileItems[i].referreId,
          });
        }
        this.hiddenFileDeleteItem.nativeElement.click();
      }
    }
    else if (e.itemData.text == 'Delete' || e.itemData.text == 'Delete Selected Files') {
      if (this.selectedFileKeys.length == 1) {
        this.hiddenFileDeleteItem.nativeElement.click();
        this.currentDeleteItemRecord = null;
        this.selectedDeletedDoc = [];
        if (e.fileSystemItem)
          this.currentDeleteItemRecord = { 'docId': e.fileSystemItem.dataItem.docId, 'name': e.fileSystemItem.dataItem.name, 'referrerId': e.fileSystemItem.dataItem.referreId }
        else
          this.currentDeleteItemRecord = { 'docId': this.selectedFileItems[0].docId, 'name': this.selectedFileItems[0].name, 'referrerId': this.selectedFileItems[0].referreId }
      }
      else {
        this.CodeErrorNotification('Please select at least one file to delete');
      }
    }
    else if (e.itemData.text == 'Rename') {
      if (this.selectedFileKeys.length == 1) {
        this.hiddenFileRenamePopUpItem.nativeElement.click();
        this.currentRenameItemRecord = null;
        let FileNamewithoutExtension = e.fileSystemItem.dataItem.name.substring(0, e.fileSystemItem.dataItem.name.lastIndexOf('.')) || e.fileSystemItem.dataItem.name
        this.GetRenameFileExtension = e.fileSystemItem.dataItem.name.split('.').pop();
        this.renameForm.patchValue({
          renameTxt: FileNamewithoutExtension
        });
        this.currentRenameItemRecord = { 'docId': e.fileSystemItem.dataItem.docId, 'name': e.fileSystemItem.dataItem.name, 'referrerId': e.fileSystemItem.dataItem.referreId, 'docType': e.fileSystemItem.dataItem.docType, 'fileBase64': this.path }
      }
      else if (this.selectedFileKeys.length > 1) {
        this.CodeErrorNotification('only single file can rename at a time.');
      }
      else {
        //this.showCommonPopUp('please select a single file for rename.');
        this.CodeErrorNotification('Please select a single file for rename.');
      }
    }
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: '',
      alertMessage: msg,
      alertType: 400
    });
  }
  showCommonPopUp(msg: string) {
    this.commonPopUpMessage = msg;
    this.hiddenCommonMessagePopUpButton.nativeElement.click();
  }

  clearSelectedFields() {
    this.selectedFileNames = [];
    this.selectedFileBase64String = [];
  }
  getDocumentType() {
    this.documentTypeList = null;
    this.documentmanagerService.getDocumentType(false).subscribe((res) => {
      if (res.response != null) {
        this.documentTypeList = res.response;
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  deleteFile(docId: any, fileName: any, patientId: any) {
    this.documentmanagerService.deleteFile(true, fileName, patientId, docId).subscribe((res) => {
      if (res.response == true) {

        let index: number = this.fileItems.map(function (e) { return e.docId; }).indexOf(docId);
        if (index !== -1) {
          this.fileItems.splice(index, 1);
          this.fileManager.instance.refresh();
        }
        this.successNotification(res);
        this.setFileManagerRowColor();
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  fileManager_onSelectionChanged(e) {

    this.setFileManagerRowColor();
    this.selectedFileNames = e.selectedItems.map(m => m.name)[0];
    if (this.selectedFileNames) {
      this.selectedFileKeys = e.selectedItemKeys;
      var fileExtension = this.selectedFileNames.split('.').pop();
      this.documentmanagerService.getFilesByKey(true, JSON.stringify(e.selectedItems[0].dataItem.filePath)).subscribe((res) => {
        if (res.response != null) {
          console.log()
          this.path = JSON.parse(res.response).Base64;
        }
      })
      if (this.selectedFileNames.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.selectedFileBase64String = 'data:image/' + fileExtension + ';base64,' + this.path;
      }
      else if (this.selectedFileNames.match(/.(pdf)$/i)) {
        this.selectedFileBase64String = 'data:application/pdf;base64,' + this.path;
      }


    }


    if (e.selectedItems.length == 1) {
      //this.selectedFileNames = e.selectedItems.map(m => m.name)[0];
      // let fileExtension = this.selectedFileNames.split('.').pop();
      //   this.documentmanagerService.getFilesByKey(true,JSON.stringify(e.selectedItems.map(f => f.dataItem).map(m => m.filePath)[0])).subscribe((res) => { 
      //     if (res.response != null) {
      //       this.path = JSON.parse(res.response).Base64 ;  
      //       e.selectedItems.map(f => f.dataItem).map(m => m.fileBase64)[0]=this.path ;
      //       if (this.selectedFileNames.match(/.(jpg|jpeg|png|gif)$/i)) {
      //         this.selectedFileBase64String = 'data:image/' + fileExtension + ';base64,' + this.path;
      //       }
      //       else if (this.selectedFileNames.match(/.(pdf)$/i)) {
      //         this.selectedFileBase64String = 'data:application/pdf;base64,' + this.path;
      //       }
      //     }
      // }) 


    }
    // else {
    //   this.selectedFileItems = e.selectedItems.map(m => m.dataItem) as DocumentManagerModel[];
    // }
    this.selectedFileItems = e.selectedItems.map(m => m.dataItem) as DocumentManagerModel[];
  }
  downloadFile(fileName, fileData) {
    const source = fileData;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }
  selectedFileDisplay(e) {
    this.getFilesByKey(e.file.dataItem.name, e.file.dataItem.filePath, 'Open', e)
  }
  downloadFileFromUrl(fileName, fileData) {
    this.fileName = fileName;
    fileData = this.apiUrl + 'DocumentManager/Download?path=' + fileData;

    const source = fileData;
    const link = document.createElement('a');
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }

  displayFile(fileName: string, fileData: any) {
    //if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
    //  fileData = 'data:image/png;base64,' + fileData;
    //}
    //else if (fileName.match(/.(pdf)$/i)) {
    //  fileData = 'data:application/pdf;base64,' + fileData;
    //}
    this.fileName = fileName;
    fileData = this.apiUrl + 'DocumentManager/Download?path=' + fileData;
    this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
    this.hiddenViewFile.nativeElement.click();
  }

  downloadAllFilesAsZipFile(fileItems: DocumentManagerModel[]) {
    let type: string = '';
    //this.getFilesByKeys()
    let files = this.downloadAllBasePath.map(m => m.fileBase64);
    const jszip = new JSZip();
    for (let k = 0; k < files.length; k++) {
      var binary = atob(files[k]);
      var array = [];
      for (let j = 0; j < binary.length; j++) {
        array.push(binary.charCodeAt(j));
      }
      var fileName = fileItems.map(m => m.name)[k];
      let fileExtension = fileName.split('.').pop();
      if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
        type = 'image/' + fileExtension;
      }
      else if (fileName.match(/.(pdf)$/i)) {
        type = 'pdf/' + fileExtension;
      }
      let newFile = new Blob([new Uint8Array(array)], {
        type: type
      });
      let lastName = fileItems.map(m => m.patientLastName)[0]
      let firstName = fileItems.map(m => m.patientFirstName)[0];
      let dateInNumber = formatDate(new Date(), 'MMddyyyy', 'en');
      lastName = lastName == '' ? '' : lastName + '_';
      firstName = firstName == '' ? '__' : firstName + '__';
      let zipFileName = lastName + firstName + dateInNumber;
      jszip.file(fileName, newFile)
      if (k === (files.length - 1)) {
        jszip.generateAsync({ type: 'blob' }).then(function (content) {
          // see FileSaver.js
          saveAs(content, zipFileName);
        });
      }
    }
  }
  // File Method

  formatBytes(bytes, decimals) {

    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  ////
  deleteSelectedUploadFile(index: number) {
    this.selectedUploadFile.splice(index, 1);
    this.fileUploadElement.nativeElement.value = '';
  }
  onFileDropped($event) {

    this.selectedUploadFile = [];
    if ($event.length > 1) {
      this.hiddenCommonMessagePopUpButton.nativeElement.click();
      this.commonPopUpMessage = 'only single file upload at a time';
      return;
    }
    this.prepareFilesList($event);
  }
  prepareFilesList(files: Array<any>) {

    for (const item of files) {
      item.progress = 0;
      this.selectedUploadFile.push(item);
    }
    this.uploadFilesSimulator(0);
  }
  uploadFilesSimulator(index: number) {

    setTimeout(() => {
      if (index === this.selectedUploadFile?.length) {
        return;
      } else {

        const progressInterval = setInterval(() => {
          if (this.selectedUploadFile?.length > 0) {
            if (this.selectedUploadFile[index].progress === 100) {
              clearInterval(progressInterval);
              //this.uploadFilesSimulator(index + 1);
            } else {
              this.selectedUploadFile[index].progress += 5;
            }
          }
          else {
            clearInterval(progressInterval);
          }
        }, 200);
      }
    }, 1000);
  }
  fileBrowseHandler(files) {

    this.selectedUploadFile = [];
    if (files.length > 1) {
      this.hiddenCommonMessagePopUpButton.nativeElement.click();
      this.commonPopUpMessage = 'only single file upload at a time';
      return;
    }
    if (files[0].name.match(/.(jpg|jpeg|png|gif|bmp|txt|doc|docx|xlsx|xls|pdf)$/i)) {
      let fileSize = this.formatBytes(files[0].size, undefined);
      if (files[0].size < 4000000) {
        this.prepareFilesList(files);
        this.isfileSizeOk = false;
      } else {
        this.isfileSizeOk = true;
      }
    }
    else {
      //this.hiddenCommonMessagePopUpButton.nativeElement.click();
      //this.commonPopUpMessage = 'file type not allowed';
      this.CodeErrorNotification('File type not allowed');
    }

  }
  uploadFile(file: any) {

    if (this.selectedUploadFile.length == 0) {
      return;
    }
    const formData = new FormData();
    let docTypeBody: any = {
      'files': encodeURIComponent(this.selectedUploadFile[0].name),
      'docTypeId': this.selectedDocumentTypeId.DocId,
      'docType': this.selectedDocumentTypeId.DocType,
      'referreId': this.currentPatientId,
      'owner': this.storageService.user.UserId,
      'fromPage': this.fromPage
    }
    formData.append('fileInfo', this.selectedUploadFile[0]);
    formData.append('body', JSON.stringify(docTypeBody));
    this.documentmanagerService.uploadFile(true, formData).subscribe((res) => {
      if (res != null) {
        if (res != null && res.response.selectedDocType == 'RX Document' && res.response.alertInfo.length > 0) {
          this.documentManagerAlert = res.response;
          this.alertInfo = this.documentManagerAlert.alertInfo[0];
          this.selectedHasAlertId = this.alertInfo.hasAlertId;
          this.hiddenAlertInfoPopUp.nativeElement.click();
          this.updateTabId(this.tabId, true);
        }
        else {
          if (res.totalRecords == null && res.response == false) {
            this.unSuccessNotification(res);
          } else {
            this.fileItems.push(res.response);
            this.getBillDataInArray();
            this.fileManager.instance.refresh();
            this.successNotification(res);
            this.setFileManagerRowColor();
            this.updateTabId(this.tabId, true)
          }
        }
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  setUploadedFileDocType(docType: Event) {

    this.selectedDocumentTypeId = docType;
    this.docTypeModelChange = true;
  }
  docFromAttorneyCheckBox(e: any, value: any) {

  }
  onSaving(e) {
    console.log(e);
  }
  updateTabId(tabName: string, val: boolean) {
    this.tabId = tabName;
    if (val) {
      this.getPatientDocument(this.currentPatientId, tabName);
    }

  }
  updateDocumentAlertInfo(hasAlertId: number) {

    this.alertInfo = this.documentManagerAlert.alertInfo.find(f => f.hasAlertId == hasAlertId);
  }
  UploadedDocumentForRxOrSimpleUpload(isAlertClear: boolean) {

    this.documentManagerAlert.isClearAlert = isAlertClear;
    this.documentManagerAlert.owner = Number(this.storageService.user.UserId);
    this.documentManagerAlert.alertInfo = new Array<AlertInfoPayload>();
    this.documentManagerAlert.alertInfo.push(this.alertInfo);
    this.documentmanagerService.uploadedDocumentForRxOrSimpleUpload(true, this.documentManagerAlert).subscribe((res) => {

      if (res != null) {
        this.fileItems.push(res.response);
        this.fileManager.instance.refresh();
        this.successNotification(res);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  emptyAlertDoumentInfo() {

    this.documentManagerAlert = new DocumentManagerAlert();
    this.alertInfo = new AlertInfoPayload();
  }
  // common Notification Method
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
  deleteOrCancelItem(isItemDelete: boolean) {
    if (isItemDelete) {
      if (this.selectedDeletedDoc.length > 0) {
        this.documentmanagerService.deleteAllFiles(true, this.selectedDeletedDoc).subscribe((res) => {
          if (res.response == true) {
            this.selectedDeletedDoc.forEach(item => {
              let index: number = this.fileItems.map(function (e) { return e.docId; }).indexOf(item.docId);
              if (index !== -1) {
                this.fileItems.splice(index, 1);
                this.fileManager.instance.refresh();
              }
            });
            this.successNotification(res);
            this.setFileManagerRowColor();
          }
          else {
            this.unSuccessNotification(res);
          }
        }, (err) => {
          this.errorNotification(err);
        });
      } else {
        this.deleteFile(this.currentDeleteItemRecord.docId, encodeURIComponent(this.currentDeleteItemRecord.name), this.currentDeleteItemRecord.referrerId);
      }
    }
    else {
      this.currentDeleteItemRecord = null;
    }
  }
  renameOrCancelItem(isItemRename: boolean) {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.renameForm.invalid) {
      this.modelValue = '';
      return;
    }
    if (isItemRename) {
      let updatedNewFileName = this.refrenameForm.renameTxt.value + '.' + this.GetRenameFileExtension;
      if (updatedNewFileName != this.currentRenameItemRecord.name) {
        this.renameFile(this.currentRenameItemRecord.docId, encodeURIComponent(this.currentRenameItemRecord.name), encodeURIComponent(updatedNewFileName), this.currentRenameItemRecord.referrerId, this.currentRenameItemRecord.docType, this.currentRenameItemRecord.fileBase64);
      }
    }
    else {
      this.currentRenameItemRecord = null;
    }
  }
  getFilesByKeys(type: any) {
    var IdString: string = '';
    var paths = [];
    if (type == 'Download All Files') {
      paths = this.fileItems.map(m => m.filePath);
    }
    else if (type == 'Download Selected') {
      paths = this.selectedFileItems.map(m => m.filePath);
    }
    paths.forEach(res => {
      IdString = paths + ","
    })
    this.documentmanagerService.getFilesByKeys(true, JSON.stringify(IdString)).subscribe((res) => {
      if (res.response != null) {
        this.downloadAllBasePath = res.response
        if (type == 'Download All Files') {
          this.downloadAllFilesAsZipFile(this.fileItems);
        }
        if (type == 'Download Selected') {
          this.downloadAllFilesAsZipFile(this.selectedFileItems);
        }
      }
    })
  }
  renameFile(docId: any, OldFileName: any, NewfileName: any, patientId: any, docType: string, fileBase64: any) {
    this.documentmanagerService.renameFile(true, OldFileName, NewfileName, patientId, docId, Number(this.storageService.user.UserId), this.fromPage, null, docType).subscribe((res) => {
      if (res.responseCode == 200) {
        let index: number = this.fileItems.map(function (e) { return e.docId; }).indexOf(docId);
        if (index !== -1) {
          this.fileItems[index].name = res.response;
          this.fileManager.instance.refresh();
        }
        this.successNotification(res);
        this.setFileManagerRowColor();
      }
      else {
        this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  emptyCommonMessage() {
    this.commonPopUpMessage = '';
  }
  onOptionChanged(e) {
    this.setFileManagerRowColor();
  }
  onContentReady(e) {
    this.setFileManagerRowColor();
  }
  setFileManagerRowColorx() {
    let intervalSubscription: Subscription;
    let second = interval(100);
    intervalSubscription = second.subscribe((sec) => {
      let docManager = document.getElementById('fileManager');
      let rows = docManager.getElementsByClassName('dx-row');
      if (rows != undefined && this.fileItems?.length > 0) {
        intervalSubscription.unsubscribe();
        if (rows?.length > 0) {

          for (let i = 0; i <= rows?.length - 1; i++) {
            let currentRow = <HTMLElement>rows[i];
            let cellValue = (<HTMLTableCellElement>rows[i].childNodes.item(2)).innerText;

            currentRow.classList.remove('dx-row-focused', 'dx-cell-focus-disabled', 'dx-selection');
            if (cellValue.toLowerCase() == 'drop letter') {
              currentRow.style.backgroundColor = '#add8e6';

            }
            else if (cellValue.toLowerCase() == 'bill') {
              currentRow.style.backgroundColor = '#F5B7B1';
              currentRow.classList.add("mystyle");
            }
            else if (cellValue.toLowerCase() == 'ar payment') {
              currentRow.style.backgroundColor = '#ba8cd7';
            }
            else if (cellValue.toLowerCase() == 'attorney signed lien') {
              currentRow.style.backgroundColor = '#fad4da';
            }

          }
        }
      }
    });
  }
  setFileManagerRowColor() {
    let intervalSubscription: Subscription;
    let second = interval(100);
    intervalSubscription = second.subscribe((sec) => {
      let rows = $('.ccc #fileManager').find('.dx-row');
      if (rows != undefined && this.fileItems?.length > 0) {
        intervalSubscription.unsubscribe();
        if (rows?.length > 0) {
          for (let i = 0; i <= rows?.length; i++) {
            let cellValue = $(rows[i]).find('td').eq(2).text();
            if (cellValue.toLowerCase() == 'bill') {
              if (this.IsLatestBill($(rows[i]).find('td').eq(4).text())) {
                $(rows[i]).addClass("lightgreen");
              }
              else {
                $(rows[i]).addClass("lightred");
              }
            }

          }
        }
      }
    });
  }
  get refrenameForm() { return this.renameForm.controls; }

  makeRowhighlight() {
    $('#fileManager').find('.dx-data-row td').click(function () {
    })
  }

  getBillDataInArray() {
    this.billArray = [];
    this.billArray = this.fileItems.filter(a => a.docType == "Bill");
    this.billArray = this.billArray.sort(function (a, b) {
      var dateA = new Date(a.uploadedOn).getTime();
      var dateB = new Date(b.uploadedOn).getTime();
      return dateA < dateB ? 1 : -1; // ? -1 : 1 for ascending/increasing order
    })
  }
  IsLatestBill(uploadedDate: any) {
    console.log(this.billArray);
    // let uploadedDate_New 
    let uplDate = new Date(this.billArray[0].uploadedOn).getTime();
    let uploadedDate_New = new Date(uploadedDate).getTime();
    return uplDate == uploadedDate_New;
  }
  toggleStartDemo() {
    if (this.startText === 'start Scanner') {
      this.startText = 'Close Scanner'
      this.show = true;
    }
    else {
      this.startText = 'start Scanner'
      this.show = false
    }
    // this.bStartUp = !this.bStartUp;
    //this.dwtService.bUseService = !this.bNoInstall;
    //this.dwtService.bUseCameraViaDirectShow = this.bUseCameraViaDirectShow && !this.bNoInstall;

  }
  closeScannerPopup($event) {
    if ($event && this.startText == 'Close Scanner') {
      this.toggleStartDemo();
    }
  }

}




