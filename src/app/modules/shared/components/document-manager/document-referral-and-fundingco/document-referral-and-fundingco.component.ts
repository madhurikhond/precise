import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DocumentManagerModel, DocumentManagerAlert, AlertInfoPayload } from 'src/app/models/document.manager';
import { DocumentmanagerService } from 'src/app/services/document-manager-service/document.manager.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/common/storage.service';
import { DxFileManagerComponent } from 'devextreme-angular';
import { saveAs } from '@progress/kendo-file-saver';
import { formatDate } from '@angular/common';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { interval, observable, Subscription } from 'rxjs';
import { SendDocumentService } from 'src/app/services/send-document-service/Send.document.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
declare const $ : any;

@Component({
  selector: 'app-document-referral-and-fundingco',
  templateUrl: './document-referral-and-fundingco.component.html',
  styleUrls: ['./document-referral-and-fundingco.component.css'],
  providers: [DocumentmanagerService],
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None

})
export class DocumentReferralAndFundingcoComponent implements OnInit, AfterViewInit {

  @ViewChild(DxFileManagerComponent, { static: false }) fileManager: DxFileManagerComponent;
  @ViewChild('hiddenCommonMessagePopUpButtonFundingCo', { static: false }) hiddenCommonMessagePopUpButton: ElementRef;
  @ViewChild('hiddenShowSendDocumentPopUpFundingCo', { static: false }) hiddenShowSendDocumentPopUpFundingCo: ElementRef;
  @ViewChild('hiddenFileDeleteItemFundingCo', { static: false }) hiddenFileDeleteItem: ElementRef;
  @ViewChild('hiddenAlertInfoPopUpFundingCo', { static: false }) hiddenAlertInfoPopUp: ElementRef;
  @ViewChild('hiddenUploadFilePopUpFundingCo', { static: false }) hiddenUploadFilePopUp: ElementRef;
  @ViewChild('hiddenViewFileFundingCo', { static: false }) hiddenViewFile: ElementRef;
  @ViewChild('fileUpload', { static: false }) fileUploadElement: ElementRef;
  @ViewChild('hiddenFileRenamePopUpItem', { static: false }) hiddenFileRenamePopUpItem: ElementRef;

  fileData: SafeResourceUrl;
  fileName: string;
  path :any
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
  selectedFileItems: DocumentManagerModel[];
  documentManagerAlert: DocumentManagerAlert;
  alertInfo: AlertInfoPayload;
  selectedHasAlertId: number;
  currentReferreId: string = '';
  currentReferrerName: string = ''
  tabId: string = 'All'
  commonPopUpMessage: string = ''
  docTypeModelChange: boolean = false;
  currentDeleteItemRecord: any = {};
  fromPage: string = '';
  selectedFileForSendDocument: string = '';
  submitted = false;
  modelValue: string = "modal";
  renameForm: FormGroup;
  GetRenameFileExtension: string = '';
  currentRenameItemRecord: any = {};
  isfileSizeOk: boolean = false;
  headerTitle: string;
  downloadAllBasePath:any ;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  @HostListener('document:click', ['$event'])
  onClickEvent(event: MouseEvent) {
    let docManagerHeadertd = <HTMLElement>event.target;
    let spanElement = <HTMLElement>docManagerHeadertd.getElementsByClassName("dx-sort")[0];
    if (spanElement?.classList.contains("dx-sort") || docManagerHeadertd?.classList.contains("dx-sort")) {
      //this.setFileManagerRowColor();
      setTimeout(() => {
        this.setFileManagerRowColor();
      }, 400)
    }
  }

  constructor(private readonly documentmanagerService: DocumentmanagerService, private readonly notificationService: NotificationService,
    private readonly commonService: CommonMethodService, private sanitizer: DomSanitizer, private readonly storageService: StorageService,
    private elementRef: ElementRef, private router: Router, private readonly sendDocumentService: SendDocumentService, private fb: FormBuilder) {
    this.alertInfo = new AlertInfoPayload();
    this.documentManagerAlert = new DocumentManagerAlert();
    this.commonPopUpMessage = '';
    this.CustomMenuItem = {
      items: [{ text: "Open" }, { text: "Send Document" }, { text: "Delete" }, { text: "Rename" }, { text: "Upload" }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.CustomToolBarItem1 = {
      items: [{ text: "Upload" }, { text: "Scan" }, { text: "Download All Files" }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.CustomToolBarItem2 = {
      items: [{ text: "Download Selected" }],
      onItemClick: this.onItemClick.bind(this)
    };
    this.onItemClick = this.onItemClick.bind(this);
  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    this.submitted = false;
    this.commonService.docManagerSubjectObservableForDocCompforRefAndFundingCo.subscribe((data) => {
      this.headerTitle = '';
      this.fromPage = this.getPageName();
      this.currentReferrerName = '';
      this.getPatientDocument(data);
      this.getDocumentType();
    });
    this.renameForm = this.fb.group({
      renameTxt: ['', [Validators.required]]
    });
  }
  getPageName(): string {

    let fromPage: string = this.router.url.split("/").pop();
    if (fromPage == 'dashboard') {
      return 'Patient';
    }
    else {
      return fromPage;
    }
  }

  getPatientDocument(data: any) {
    this.fileItems = [];
    this.currentReferrerName = data['ReferrerName'];
    this.currentReferreId = data['ReferreId'];
    this.fromPage = data['UploadedPage'];
    if (this.currentReferrerName) {
      this.currentReferrerName = this.currentReferrerName.replace(/[*/,.:]/g, '').trim();
    }

    this.documentmanagerService.GetUploadedDocumentsForReferrarAndFundingCo(true, this.currentReferreId, this.fromPage, this.currentReferrerName).subscribe((res) => {
      this.headerTitle = this.currentReferrerName ? this.currentReferrerName + ' - ' : '';
      if (res.response != null) {
        this.fileItems = res.response;
      }
      else {
        this.fileItems = [];
      }
    }, (err) => {
      this.errorNotification(err);
    })
  }

  getFilesByKey(name: any, path:any,text:any){
    
    this.documentmanagerService.getFilesByKey(true,JSON.stringify(path)).subscribe((res) => { 
      if (res.response != null) {
        this.path = JSON.parse(res.response).Base64 ;  
        if(text == 'Open'){
          this.displayFile(name, this.path);
        }
        else if (text == 'Download Selected'){
          this.downloadFile(this.selectedFileNames, this.path);
        } 
      }
    }) 
  }

  getFilesByKeys(){
   
    var IdString: string = '';
    let paths =  this.fileItems.map(m => m.filePath);
    paths.forEach(res => {
      IdString = paths + "," 
     
    })
    this.documentmanagerService.getFilesByKeys(true,JSON.stringify(IdString)).subscribe((res) => { 
      if (res.response != null) {
          this.downloadAllBasePath = res.response
      }
    }) 
  }
  onItemClick(e) {
    if (e.itemData.text == 'Open') {
      if (this.selectedFileKeys.length == 1) {
        this.getFilesByKey(e.fileSystemItem.dataItem.name, e.fileSystemItem.dataItem.filePath, e.itemData.text)
       // this.displayFile(e.fileSystemItem.dataItem.name, this.path);
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
        this.getFilesByKey('',this.path, e.itemData.text)
        this.clearSelectedFields();
      }
      else if (this.selectedFileKeys.length > 1) {
        this.downloadAllFilesAsZipFile(this.selectedFileItems);
      }
      else {
        this.CodeErrorNotification('Please select file to download.');
      }
    }
    else if (e.itemData.text == 'Download All Files') {
      this.downloadAllFilesAsZipFile(this.fileItems);
    }
    else if (e.itemData.text == 'Upload') {
      this.docTypeModelChange = false;
      this.selectedDocumentTypeId = '';
      this.selectedUploadFile = [];
      this.fileUploadElement.nativeElement.value = '';
      this.hiddenUploadFilePopUp.nativeElement.click();
    }
    else if (e.itemData.text == 'Scan') {
    }
    else if (e.itemData.text == 'Send Document') {
      if (this.selectedFileKeys.length == 1) {
        this.selectedFileForSendDocument = this.selectedFileKeys[0];
        this.hiddenShowSendDocumentPopUpFundingCo.nativeElement.click();
        let data: any = {
          'ReferreId': this.currentReferreId,
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
        this.CodeErrorNotification('Please select a single file for send.');
      }
    }
    else if (e.itemData.text == 'Delete') {
      if (this.selectedFileKeys.length == 1) {
        this.hiddenFileDeleteItem.nativeElement.click();
        this.currentDeleteItemRecord = null;
        this.currentDeleteItemRecord = { 'docId': e.fileSystemItem.dataItem.docId, 'name': e.fileSystemItem.dataItem.name, 'referrerId': e.fileSystemItem.dataItem.referreId }
        /////this.deleteFile(e.fileSystemItem.dataItem.docId,e.fileSystemItem.dataItem.name,e.fileSystemItem.dataItem.referreId);
      }
      else if (this.selectedFileKeys.length > 1) {
        this.CodeErrorNotification("only single file can delete at a time.");
      }
      else {
        this.CodeErrorNotification("please select a single file for delete.");
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
        this.currentRenameItemRecord = { 'docId': e.fileSystemItem.dataItem.docId, 'name': e.fileSystemItem.dataItem.name, 'referrerId': e.fileSystemItem.dataItem.referreId, 'docType': e.fileSystemItem.dataItem.docType, 'fileBase64': e.fileSystemItem.dataItem.fileBase64 }
      }
      else if (this.selectedFileKeys.length > 1) {
        this.CodeErrorNotification("only single file can rename at a time.");
      }
      else {
        this.CodeErrorNotification("Please select a single file for rename.");
      }
    }
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

    this.documentmanagerService.deleteBrokerandReferrerFile(true, fileName, patientId, docId, this.fromPage, this.currentReferrerName).subscribe((res) => {
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
    if(this.selectedFileNames){
      this.selectedFileKeys = e.selectedItemKeys;
      var fileExtension = this.selectedFileNames.split('.').pop();

      this.documentmanagerService.getFilesByKey(true,JSON.stringify(e.selectedItems[0].dataItem.filePath)).subscribe((res) => { 
        if (res.response != null) {
          this.path = JSON.parse(res.response).Base64 ;  
          if (this.selectedFileNames.match(/.(jpg|jpeg|png|gif)$/i)) {
            this.selectedFileBase64String = 'data:image/' + fileExtension + ';base64,' + this.path;
          }
          else if (this.selectedFileNames.match(/.(pdf)$/i)) {
            this.selectedFileBase64String = 'data:application/pdf;base64,' + this.path;
          }
        }
    }) 
   }
   
    if (e.selectedItems.length == 1) {
      this.selectedFileNames = e.selectedItems.map(m => m.name)[0];
      let fileExtension = this.selectedFileNames.split('.').pop();
      if (this.selectedFileNames.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.selectedFileBase64String = "data:image/" + fileExtension + ";base64," + e.selectedItems.map(f => f.dataItem).map(m => m.fileBase64)[0];;
      }
      else if (this.selectedFileNames.match(/.(pdf)$/i)) {
        this.selectedFileBase64String = "data:application/pdf;base64," + e.selectedItems.map(f => f.dataItem).map(m => m.fileBase64)[0];;
      }
    }
    else {
      this.selectedFileItems = e.selectedItems.map(m => m.dataItem) as DocumentManagerModel[];
    }
  }
  downloadFile(fileName, fileData) {
    const source = fileData;
    const link = document.createElement("a");
    link.href = source;
    link.download = `${fileName}`
    link.click();
  }
  selectedFileDisplay(e) {
    this.getFilesByKey( e.file.dataItem.name, e.file.dataItem.filePath,e.fileSystemItem.dataItem.text)
  }

  displayFile(fileName: string, fileData: any) {
    if (fileName.match(/.(jpg|jpeg|png|gif)$/i)) {
      fileData = "data:image/png;base64," + fileData;
    }
    else if (fileName.match(/.(pdf)$/i)) {
      fileData = "data:application/pdf;base64," + fileData;
    }
    this.fileName = fileName;
    this.fileData = this.sanitizer.bypassSecurityTrustResourceUrl(fileData);
    this.hiddenViewFile.nativeElement.click();
  }

  downloadAllFilesAsZipFile(fileItems: DocumentManagerModel[]) {
    let type: string = '';
    this.getFilesByKeys()
    let files = this.downloadAllBasePath.map(m => m.fileBase64);;
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
      this.commonPopUpMessage = "only single file upload at a time";
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
      this.commonPopUpMessage = "only single file upload at a time";
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
      //this.commonPopUpMessage = "file type not allowed";
      this.CodeErrorNotification('File type not allowed');
    }
  }
  uploadFile(file: any) {

    if (this.selectedUploadFile.length == 0) {
      return;
    }

    // let oModel: any = {
    //   'files': encodeURIComponent(this.selectedUploadFile[0].name),
    //   'docTypeId': this.selectedDocumentTypeId.DocId,
    //   'docType': this.selectedDocumentTypeId.DocType,
    //   'referreId': this.currentPatientId,
    //   'owner': this.storageService.user.UserId,
    //   'fromPage': this.fromPage,
    // }
    // let imgObj: any = {}
    // imgObj = oModel;
    // const formData = new FormData();
    // for (let key in imgObj) {
    //   if (imgObj.hasOwnProperty(key)) {
    //     if (imgObj[key]) {
    //       formData.append(key, imgObj[key]);
    //     }
    //   }
    // }
    // formData.append("Document", this.selectedUploadFile[0]);

    const formData = new FormData();
    let docTypeBody: any = {
      'files': encodeURIComponent(this.selectedUploadFile[0].name),
      'docTypeId': this.selectedDocumentTypeId.DocId,
      'docType': this.selectedDocumentTypeId.DocType,
      'referreId': this.currentReferreId,
      'owner': this.storageService.user.UserId,
      'fromPage': this.fromPage,
      'referrerName': this.currentReferrerName
    }
    formData.append("fileInfo", this.selectedUploadFile[0]);
    formData.append("body", JSON.stringify(docTypeBody));

    this.documentmanagerService.AddUpdateDocumentsForReferrarAndFundingCo(true, formData).subscribe((res) => {

      if (res != null) {
        if (res != null && res.response.selectedDocType == 'RX Document' && res.response.alertInfo.length > 0) {
          this.documentManagerAlert = res.response;
          this.alertInfo = this.documentManagerAlert.alertInfo[0];
          this.selectedHasAlertId = this.alertInfo.hasAlertId;
          this.hiddenAlertInfoPopUp.nativeElement.click();
        }
        else {
          this.fileItems.push(res.response);
          this.fileManager.instance.refresh();
          this.successNotification(res);
          this.setFileManagerRowColor();
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
      this.deleteFile(this.currentDeleteItemRecord.docId, encodeURIComponent(this.currentDeleteItemRecord.name), this.currentDeleteItemRecord.referrerId);
    }
    else {
      this.currentDeleteItemRecord = null;
    }
  }
  renameOrCancelItem(isItemRename: boolean) {
    this.submitted = true;
    this.modelValue = "modal";
    if (this.renameForm.invalid) {
      this.modelValue = "";
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
  renameFile(docId: any, OldFileName: any, NewfileName: any, patientId: any, docType: string, fileBase64: any) {
    this.documentmanagerService.renameFile(true, OldFileName, NewfileName, patientId, docId, Number(this.storageService.user.UserId), this.fromPage, this.currentReferrerName, docType).subscribe((res) => {
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
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: msg,
      alertMessage: msg,
      alertType: 400
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
  setFileManagerRowColor() {
    let intervalSubscription: Subscription;
    let second = interval(100);
    intervalSubscription = second.subscribe((sec) => {
      let docManager = document.getElementById("fileManager");
      let rows = docManager.getElementsByClassName("dx-row dx-data-row");
      if (rows != undefined && rows?.length == this.fileItems?.length) {
        intervalSubscription.unsubscribe();
        if (rows?.length > 0) {

          for (let i = 0; i <= rows?.length - 1; i++) {
            let currentRow = <HTMLElement>rows[i];
            let cellValue = (<HTMLTableCellElement>rows[i].childNodes.item(2)).innerText;
            currentRow.classList.remove('dx-row-focused', 'dx-cell-focus-disabled', 'dx-selection');

            if (cellValue.toLowerCase() == "drop letter") {
              currentRow.style.backgroundColor = "#add8e6";

            }
            else if (cellValue.toLowerCase() == "bill") {
              currentRow.style.backgroundColor = "#F5B7B1";
            }
            else if (cellValue.toLowerCase() == "ar payment") {
              currentRow.style.backgroundColor = "#ba8cd7";
            }
            else if (cellValue.toLowerCase() == "attorney signed lien") {
              currentRow.style.backgroundColor = "#fad4da";
            }
          }
        }
      }
    });
  }
  get refrenameForm() { return this.renameForm.controls; }
}

