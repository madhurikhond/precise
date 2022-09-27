import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { AutoRouteV2Service } from 'src/app/services/AutoRouteV2/auto-route-v2.service';
import { HttpClient } from '@angular/common/http';
import { async } from '@angular/core/testing';
import { find } from 'rxjs/operators';
import { Router } from '@angular/router';
import { letProto } from 'rxjs-compat/operator/let';
import { map } from 'rxjs/operators';
import { CommonMethodService } from 'src/app/services/common/common-method.service';


@Component({
  selector: 'app-auto-route-v2',
  templateUrl: './auto-route-v2.component.html',
  styleUrls: ['./auto-route-v2.component.css']
})
export class AutoRouteV2Component implements OnInit, OnDestroy {
  @ViewChild('hiddenFileDeleteItem', { static: false }) hiddenFileDeleteItem: ElementRef;
  actionList: any = [
    { id: '1', action: 'Delete All' },
    { id: '2', action: 'Delete files with missing PatientID' },
    { id: '3', action: 'Delete files with missing Doc Type' },
    { id: '4', action: 'Delete Selected Files' },
    { id: '5', action: 'Copy filename to PatientID' },
    { id: '6', action: 'Merg PDFs' },
  ]
  _selectedAction: number = 0;
  fileData: any = [];
  _selectedFiles = [] as any;
  _selectedUploadFile: File = null;
  _fileMessage: string = '';
  _fileExtension: string = '';
  _isFileAllowed: boolean = false;
  _matchExtension: boolean = false;
  images: string[] = [];
  name: string;
  viewUrl: any;
  docId: number; RadiologistId: number;
  docType: string; Radiologist: string;
  Radiologistsubscribe: Subscription; Documentsubscribe: Subscription; FileExtensionsubscribe: Subscription; SplitBarCodessubscribe: Subscription;
  MergsPdfsubscribe: Subscription; UploadFileSubscribe: Subscription; AlertSubscribe: Subscription; EmptyDirectorySubscribe: Subscription;
  PatientID: string;
  fileInfo: any;
  Abbreviation: string;
  patientList: Array<{ name: string, viewUrl: string, is_selected: boolean, DocId: number, Dtype: string, Abbreviation: string, ReferreId: string, fileInfo: any, RadiologistId: number, Radiologist: string }> = [];
  MasterDocumentList: any = [];
  RadiologistList: any = [];
  reasonList: any = [];
  select_all = false;
  isAlertShown: boolean = false;
  isUploadShown: boolean = false;
  totalCheckCount: number = 0;
  totalAlertCheckCount: number = 0;
  DisPlayCount: number = 0;
  DisPlayAlertCount: number = 0;
  updateAlertList: Array<{ is_alertSelected: boolean; PatientID: string, LogType: string, UserDetail: string, UserID: string, AlertID: string, Addedby: string, DateAdded: string }> = [];
  encript: string; Documentdata: any = []; Radiologistdata: any = []; selectedDocType: any = [];
  splitFiles: boolean = false; barCodes: boolean = false;
  indexNumber: number = null;

  constructor(
    private readonly notificationService: NotificationService,
    private http: HttpClient,
    private readonly storageService: StorageService,
    private readonly autoRouteV2Service: AutoRouteV2Service,
    private readonly commonMethodService: CommonMethodService,
    private readonly router: Router) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Auto Route V2');
    this.getDropdown();
    this.getRadiologistDropdown();
    this.EmptyFolder();
    this.GetUpdateDoNotSplitFilesReadBarCodes();
  }

  getDropdown() {
    this.Documentsubscribe = this.autoRouteV2Service.getAutoRouteMasterDocumentType(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.MasterDocumentList = data.response;
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
  getRadiologistDropdown() {
    this.Radiologistsubscribe = this.autoRouteV2Service.getRadiologistDropdown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.RadiologistList = data.response;
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


  EmptyFolder = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        this.EmptyDirectorySubscribe = this.autoRouteV2Service.getEmptyDirectory(true, this.storageService.user.UserId).subscribe((res) => { console.log(res); });
      }
    };
  })();





  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.select_all = false;

      var fileName = file['name'];
      var extension = fileName.split('.').pop().toLowerCase();
      var UserId = this.storageService.user.UserId;
      // this._selectedUploadFile=<File>event.target.files[0];
      this.FileExtensionsubscribe = this.autoRouteV2Service.getAutoRouteV2GetFileExtension(true).subscribe((res) => {
        if (res != null) {
          var selectedFiles = event.target.files;
          for (let i = 0; i < selectedFiles.length; i++) {
            this._fileExtension = res.response[0].FileExtension;
            if (this._fileExtension != null) {
              this._matchExtension = !!event.target.files[i].name.match(this._fileExtension);
              if (!this._matchExtension) {
                this.CodeErrorNotification('File type not allowed');
                return;
              }
              else {
                this.isUploadShown = true;
                if (event.target.files && event.target.files[i]) {
                  if (this.splitFiles === true && this.barCodes === true) {
                    var reader = new FileReader();
                    reader.onload = (e: any) => {
                      var blob = new Blob(event.target.files, { type: event.target.files[i].type });
                      var url = window.URL.createObjectURL(blob);
                      this.name = event.target.files[i]['name'];
                      this.viewUrl = reader.result;
                      this.patientList.push({ name: this.name, viewUrl: url, is_selected: false, DocId: 0, Dtype: 'Select Document File Type', Abbreviation: '', ReferreId: '', fileInfo: event.target.files[i], RadiologistId: 0, Radiologist: 'Select Document File Type' });
                    }
                    reader.readAsDataURL(event.target.files[i]);
                  } else {
                    let formData = new FormData();
                    formData.append('file', event.target.files[i]);
                    formData.append('UserId', this.storageService.user.UserId);
                    formData.append('splitFiles', <string><any>this.splitFiles);
                    formData.append('barCodes', <string><any>this.barCodes);
                    if (selectedFiles.length > 1) { this.MultipleSelectionSplit(formData); } else { this.saveWithSplit_BarCodeAttachDoc(formData); }
                  }

                }
              }
            }
          }
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }

  }



  async MultipleSelectionSplit(formData: any) {
    await this.autoRouteV2Service.MultipleFileSplitBarCodesRead(true, formData).then(async (res) => {
      var result = JSON.stringify(res);
      if (JSON.parse(result).response) {
        var totalMessages = Object.keys(JSON.parse(result).response).length;
        if (totalMessages > 0) {
          for (let i = 0; i < totalMessages; i++) {
            var Dta = JSON.parse(result).response[i];
            let ArrayBuff = this._base64ToArrayBuffer(Dta.fileBytes);
            let file = new Blob([ArrayBuff], { type: 'application/pdf' });
            let FileName = file['name'];
            this.patientList.push({ name: Dta.FileName, viewUrl: URL.createObjectURL(file), is_selected: false, DocId: Dta.DocID, Dtype: Dta.DocType, Abbreviation: Dta.Abbreviation, ReferreId: Dta.PatientID, fileInfo: Dta.Path, RadiologistId: Dta.RadiologistId, Radiologist: Dta.Radiologist });
          }

          this.updateDropDownArray();
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }


  async saveWithSplit_BarCodeAttachDoc(formData: any) {
    this.SplitBarCodessubscribe = await this.autoRouteV2Service.UploadFileSplitBarCodesRead(true, formData).subscribe(async (res) => {
      if (res.response != null) {
        if (res.response.length > 0) {
          for (let i = 0; i < res.response.length; i++) {
            let ArrayBuff = this._base64ToArrayBuffer(res.response[i].fileBytes);
            let file = new Blob([ArrayBuff], { type: 'application/pdf' });
            let FileName = file['name'];
            this.patientList.push({ name: res.response[i].FileName, viewUrl: URL.createObjectURL(file), is_selected: false, DocId: res.response[i].DocID, Dtype: res.response[i].DocType, Abbreviation: res.response[i].Abbreviation, ReferreId: res.response[i].PatientID, fileInfo: res.response[i].Path, RadiologistId: res.response[i].RadiologistId, Radiologist: res.response[i].Radiologist });
          }
          this.updateDropDownArray();
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }

  // common Error Method
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  getDocType(event: any, index: number, type: string) {
    if (type === 'DocumentList') {
      let Abbindex: number = event.target['selectedIndex'] - 1;
      this.docId = event.target.value;
      this.docType = event.target.options[event.target.options.selectedIndex].text;
      this.Abbreviation = this.MasterDocumentList[Abbindex].Abbreviation;
      const item = this.patientList[index];
      item.DocId = this.docId;
      item.Dtype = this.docType;
      item.Abbreviation = this.Abbreviation;
      console.log(item.Abbreviation);
      if (item.Abbreviation.toLowerCase() == 'p_psl' || item.Abbreviation.toLowerCase() == 'p_asl') {
        this.selectedDocType[index] = true;
      } else {
        this.selectedDocType[index] = false;
      }
    }
    else {
      const item = this.updateAlertList[index];
      item.AlertID = event.target.value;
      item.UserDetail = event.target.options[event.target.options.selectedIndex].text;
    }
  }

  getRadiologist(event: any, index: number) {
    let Abbindex: number = event.target['selectedIndex'] - 1;
    this.RadiologistId = event.target.value;
    this.Radiologist = event.target.options[event.target.options.selectedIndex].text
    const item = this.RadiologistList[index];
    item.RadiologistId = this.RadiologistId;
    item.Radiologist = this.Radiologist;
  }

  changeDDlAction(event: any) {
    this._selectedAction = event.target.value;
  }
  deleteFiles(isItemDelete: boolean, indexNumber) {
    if (isItemDelete) {
      if (this._selectedAction == 1) {
        this.updateAlertList = [];
        this.patientList = [];
        this.successNotification('Files deleted Successfully.')
      }
      else if (this._selectedAction == 2) {//Delete files with missing PatientID  
        while (this.patientList.findIndex(e => e.ReferreId === '') >= 0)
          this.patientList.splice(this.patientList.findIndex(f => f.ReferreId === ''), 1);
        this.successNotification('Files deleted Successfully.');
      }
      else if (this._selectedAction == 3) {//Delete files with missing Doc Type     
        while (this.patientList.findIndex(e => e.DocId === 0) >= 0)
          this.patientList.splice(this.patientList.findIndex(f => f.DocId === 0), 1);
        this.successNotification('Files deleted Successfully.');
        this.patientList = this.patientList.slice();
      }
      else if (this._selectedAction == 4) {//Delete Selected Files   
        let index = this.patientList.findIndex(patient => patient.is_selected === true);
        while (index !== -1) {
          this.patientList.splice(index, 1);
          index = this.patientList.findIndex(patient => patient.is_selected === true);
        }
        this.successNotification('Files deleted Successfully.');
      }
      if (indexNumber != null) {
        this.deleteDetail(indexNumber);
        this.indexNumber = null;
      }
      this.updateDropDownArray();
    }
  }
  updateDropDownArray() {
    for (let i = 0; i < this.patientList.length; i++) {
      this.Radiologistdata[i] = this.patientList[i].RadiologistId;
      this.Documentdata[i] = this.patientList[i].DocId;
    }
  }

  SelectAction() {
    this.indexNumber = null;
    if (this._selectedAction == 1 || this._selectedAction == 2 || this._selectedAction == 3 || this._selectedAction == 4) {
      if (this._selectedAction == 4) {
        let index = this.patientList.findIndex(patient => patient.is_selected === true);
        if (index === -1) {
          this.CodeErrorNotification('Please select a file for delete.');
        } else { this.hiddenFileDeleteItem.nativeElement.click(); }
      } else {
        this.hiddenFileDeleteItem.nativeElement.click();
      }
    }
    else if (this._selectedAction === 5) {//Copy filename to PatientID 
      for (let i = 0; i < this.patientList.length; i++) {
        if (this.patientList[i].is_selected === true) {
          let fileNameForPtId = this.patientList[i].name;
          fileNameForPtId = fileNameForPtId.substring(0, fileNameForPtId.lastIndexOf('.'));
          let FileNameExp = /^[0-9 ]+$/;
          if (FileNameExp.test(fileNameForPtId)) {
            this.patientList[i].ReferreId = fileNameForPtId;
          }
        }
      }

    }
    else if (this._selectedAction === 6) {//Merg PDFs  
      if (this.patientList) {
        var formData = new FormData();
        let JNum: number = 0;
        for (let i = 0; i < this.patientList.length; i++) {
          if (this.patientList[i].is_selected === true) {
            formData.append('file', this.patientList[i].fileInfo);
            formData.append('UserId', this.storageService.user.UserId);
            formData.append('DocId', this.patientList[i].DocId.toString());
            formData.append('Dtype', this.patientList[i].Dtype);
            formData.append('ReferreId', this.patientList[i].ReferreId);
            formData.append('FileName', this.patientList[i].name);
            formData.append('Abbreviation', this.patientList[i].Abbreviation);
            formData.append('splitFiles', <string><any>this.splitFiles);
            formData.append('barCodes', <string><any>this.barCodes);
            formData.append('RadiologistId', this.patientList[i].RadiologistId.toString());
            formData.append('Radiologist', this.patientList[i].Radiologist);
            JNum++;

          }
        }
        if (formData) {
          formData.append('FileCount', (JNum).toString());
          let MergPdfList: Array<{ name: string, viewUrl: string, is_selected: boolean, DocId: number, Dtype: string, Abbreviation: string, ReferreId: string, fileInfo: any }> = [];
          this.MergsPdfsubscribe = this.autoRouteV2Service.MergsPdfFiles_AutoRoute(true, formData).subscribe((res) => {
            if (res.response != null) {
              let index = this.patientList.findIndex(patient => patient.is_selected === true);
              let insert = index;
              let ArrayBuff = this._base64ToArrayBuffer(res.response[0].fileBytes);
              let file = new Blob([ArrayBuff], { type: 'application/pdf' });
              var fileURL = URL.createObjectURL(file);

              if (this.patientList.length > 0) {
                for (let i = 0; i < this.patientList.length; i++) {
                  if (insert == i) {

                    this.patientList.splice(index, 1, { name: res.response[0].FileName, viewUrl: fileURL, is_selected: false, DocId: res.response[0].DocID, Dtype: res.response[0].DocType, Abbreviation: res.response[0].Abbreviation, ReferreId: res.response[0].PatientID, fileInfo: res.response[0].Path, RadiologistId: res.response[i].RadiologistId, Radiologist: res.response[i].Radiologist });
                  }
                }
              }
              index = this.patientList.findIndex(patient => patient.is_selected === true);
              while (index !== -1) {
                this.patientList.splice(index, 1);
                index = this.patientList.findIndex(patient => patient.is_selected === true);
              }
            }
          });
        }

      }
    }
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



  async saveAttachDoc() {
    if (this.totalCheckCount != 0) {
      let CHckFields = true;
      for (let i = 0; i < this.patientList.length; i++) {
        if (this.patientList[i].is_selected === true) {
          if (this.patientList[i].DocId === 0 || this.patientList[i].ReferreId === '') {
            CHckFields = false;
          }
        }
      }
      if (CHckFields === false) { this.CodeErrorNotification('Fields cannot be empty.'); }
      else {
        for (let i = 0; i < this.patientList.length; i++) {
          if (this.patientList[i].is_selected === true) {
            let formData = new FormData();
            formData.append('file', this.patientList[i].fileInfo);
            formData.append('UserId', this.storageService.user.UserId);
            formData.append('DocId', this.patientList[i].DocId.toString());
            formData.append('Dtype', this.patientList[i].Dtype);
            formData.append('ReferreId', this.patientList[i].ReferreId);
            formData.append('FileName', this.patientList[i].name);
            formData.append('Abbreviation', this.patientList[i].Abbreviation);
            formData.append('splitFiles', <string><any>this.splitFiles);
            formData.append('barCodes', <string><any>this.barCodes);
            formData.append('RadiologistId', this.patientList[i].RadiologistId.toString());
            formData.append('Radiologist', this.patientList[i].Radiologist);
            if (this.patientList[i].name.toLowerCase().indexOf('mergerd.pdf') !== -1) {
              formData.append('MergedFile', 'true');
            } else { formData.append('MergedFile', 'false'); }
            await this.getData(formData, i, this.patientList[i].name);

          }
        }
      }

    } else {
      this.CodeErrorNotification('Please select File');
    }
  }
  onChangeSplit(e) {
    this.splitFiles = e.target.checked;
    this.GetUpdateDoNotSplitFilesReadBarCodes(true);
  }
  onChangebarCodes(e) {
    this.barCodes = e.target.checked;
    this.GetUpdateDoNotSplitFilesReadBarCodes(true);
  }
  GetUpdateDoNotSplitFilesReadBarCodes(isChecked = false) {
    let IsNotReadBarcode = this.barCodes?this.barCodes:false;
    let IsDoNotSplit = this.splitFiles?this.splitFiles:false;
    var data = { "IsNotReadBarcode": IsNotReadBarcode, "IsDoNotSplit": IsDoNotSplit, 'UserId': this.storageService.user.UserId, }
    if (isChecked) {
      this.autoRouteV2Service.UpdateDoNotSplitFilesReadBarCodes(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
      },
        (err: any) => {
          this.errorNotification(err);
        });
    } else {
      this.autoRouteV2Service.GetDoNotSplitFilesReadBarCodes(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res.response) {
          console.log(res.response[0].IsNotReadBarcode);   console.log(res.response[0].IsDoNotSplit);
          this.barCodes = res.response[0].IsNotReadBarcode;
          this.splitFiles = res.response[0].IsDoNotSplit;
        }
      },
        (err: any) => {
          this.errorNotification(err);
        });
    }
  }


  changed(type: string) {
    this.totalCheckCount = 0;
    if (type === 'patientList') {
      this.patientList.forEach(item => {
        if (item.is_selected) {
          this.totalCheckCount = this.totalCheckCount + 1
        }
      })

      if (this.totalCheckCount != 0 && this.totalCheckCount == this.patientList.length) {
        this.select_all = true;
      } else { this.select_all = false }
    } else {
      this.updateAlertList.forEach(item => {
        if (item.is_alertSelected) {
          this.totalAlertCheckCount = this.totalAlertCheckCount + 1
        }
      })
    }
  }
  async getData(formData: any, index: number, Filename: string) {
    this.UploadFileSubscribe = await this.autoRouteV2Service.UploadFileToAutoRoute(true, formData).subscribe((res) => {
      if (res.response != null) {
        this.DisPlayCount++;
        if (res.responseCode === 200) {
          if (this.DisPlayCount === this.totalCheckCount) {
            if (this.patientList.length === 1) {
              this.isUploadShown = false;
            }
            this.successNotification('All Files have been attached successfully');
            this.DisPlayCount = 0;
          }
          this.displayAlert(res.response);
          this.patientList.splice(index, 1);
          this.updateDropDownArray();
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
    // }else{


    // }

  }

  async updateAlert() {
    if (this.totalAlertCheckCount != 0) {
      for (let i = 0; i < this.updateAlertList.length; i++) {
        if (this.updateAlertList[i].is_alertSelected === true) {
          let data = {
            'PatientID': this.updateAlertList[i].PatientID,
            'AlertID': this.updateAlertList[i].AlertID,
            'UserId': this.storageService.user.UserId,
            'LogType': this.updateAlertList[i].LogType,
            'UserDetail': this.updateAlertList[i].UserDetail
          }
          await this.UpdateAlerts(data, i);
        }
      }
    }
    else {
      this.CodeErrorNotification('Please select Alert')
    }
  }

  async UpdateAlerts(data: any, index: number) {
    this.AlertSubscribe = await this.autoRouteV2Service.UpdateAlerts_AutoRoute(true, data).subscribe((res) => {
      if (res.response != null) {
        this.DisPlayAlertCount++;
        if (res.responseCode === 200) {
          if (this.DisPlayAlertCount == this.totalAlertCheckCount) {
            if (this.updateAlertList.length === 1) {
              this.isAlertShown = false;
            }
            this.CodeErrorNotification('Alerts have been updated successfully')
          }
          this.updateAlertList.splice(index, 1);
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });

  }
  closeUpdateAlert() {
    this.isAlertShown = false;
    this.updateAlertList = [];
  }

  displayAlert(getRes: any) {
    if (getRes.patientAlertReason && getRes.patientAlert) {
      if (getRes.patientAlertReason.length > 0) {
        this.isAlertShown = true;
        this.reasonList = getRes.patientAlertReason;
        this.select_all = false;
        for (let i = 0; i < getRes.patientAlert.length; i++) {
          this.updateAlertList.push({ is_alertSelected: false, PatientID: getRes.patientAlert[i]['HAPatientID'], LogType: getRes.patientAlert[i]['Alert'], UserDetail: getRes.patientAlert[i]['Reason'], UserID: this.storageService.user.UserId, AlertID: getRes.patientAlert[i]['CreatedAlertID'], Addedby: getRes.patientAlert[i]['Addedby'], DateAdded: getRes.patientAlert[i]['DateAdded'] });
        }
      }
    }
  }

  viewDetail(url: any) {
    window.open(url, '_blank');
  }
  setDeleteIndexNUmber(index: number) {
    this.indexNumber = index;
    this.hiddenFileDeleteItem.nativeElement.click();
  }
  deleteDetail(index: number) {
    let OtherList: any = [];
    for (let i = 0; i < this.patientList.length; i++) {
      if (i != index) {
        OtherList.push(this.patientList[i]);
      }
    }
    //this.getDropdown();
    //this.getRadiologistDropdown();
    this.patientList.splice(0, this.patientList.length)
    this.patientList = [];
    this.patientList = OtherList;
  }

  onSelectAll(e: any, type: string): void {
    if (type === 'patientList') {
      for (let i = 0; i < this.patientList.length; i++) {
        const item = this.patientList[i];
        item.is_selected = e;
        this.totalCheckCount = i + 1
      }
    }
    else {
      for (let i = 0; i < this.updateAlertList.length; i++) {
        const item = this.updateAlertList[i];
        item.is_alertSelected = e;
        this.totalAlertCheckCount = i + 1
      }
    }
  }
  removeSpecialCharacters(event: any, index: number) {
    this.PatientID = event.target.value.replace(/[^0-9]/g, '');
    this.patientList[index].ReferreId = this.PatientID;
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: '',
      alertMessage: msg,
      alertType: 400
    });
  }
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data,
      alertType: 200
    });
  }

  ngOnDestroy() {
    if (typeof this.Documentsubscribe !== 'undefined') { this.Documentsubscribe.unsubscribe(); }
    if (typeof this.Radiologistsubscribe !== 'undefined') { this.Radiologistsubscribe.unsubscribe(); }
    if (typeof this.FileExtensionsubscribe !== 'undefined') { this.FileExtensionsubscribe.unsubscribe(); }
    if (typeof this.SplitBarCodessubscribe !== 'undefined') { this.SplitBarCodessubscribe.unsubscribe(); }
    if (typeof this.MergsPdfsubscribe !== 'undefined') { this.MergsPdfsubscribe.unsubscribe(); }
    if (typeof this.UploadFileSubscribe !== 'undefined') { this.UploadFileSubscribe.unsubscribe(); }
    if (typeof this.AlertSubscribe !== 'undefined') { this.AlertSubscribe.unsubscribe(); }
    if (typeof this.EmptyDirectorySubscribe !== 'undefined') { this.EmptyDirectorySubscribe.unsubscribe(); }

  }

  //old Code
  chooseFile(files: any) {
    let localFileData: any = [];
    localFileData = Array.from(files.target.files);
    if (localFileData.length === 0) {
      return;
    }

    let totalSize: number = 0;
    for (var i = 0; i < localFileData.length; i++) {
      var mimeType = localFileData[i].type
      totalSize = totalSize + localFileData[i].size;
      if (mimeType === 'image/svg+xml') {
        localFileData = null;
        this.notificationService.showNotification({
          alertHeader: '',
          alertMessage: 'Unsupported file format.',
          alertType: 415
        });
        return;
      }
      if (!(mimeType.match(/image\/*/) != null)) {
        localFileData = null;
        // this.tostr.error('', AlertMessage.FileMimeTypeAlert);
        return;
      }
    }
    if (totalSize >= 10485760) {
      // 4MB -> 10 * 1024 * 1024
      localFileData = null;
      //this.tostr.error('', AlertMessage.FileUploadSize);
      return;
    }
    if (localFileData.length === 0) {
      return;
    } else {
      localFileData.forEach((res: any) => {
        let isExist: any = this.fileData.filter((e: any) => e.name === res.name);
        if (isExist.length > 0) {
          // this.tostr.warning('', res.name + AlertMessage.DuplicateFileAlert);
        } else {

          if (this.fileData && this.fileData.length >= 10) {
            // this.tostr.error('', AlertMessage.MaximumSelectedFileAlert);
            localFileData = null;
            return;
          }

          this.fileData.push(res);
          const file = res;
          const reader = new FileReader();
          reader.onload = e => this._selectedFiles.push(reader.result);
          reader.readAsDataURL(file);
        }
      })
    }
  }
  trackBy(index: number, patientList: any) {
    return patientList.name;
  }
}
