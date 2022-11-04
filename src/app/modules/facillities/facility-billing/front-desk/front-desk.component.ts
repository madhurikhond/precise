import { compilePipeFromMetadata, ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/common/storage.service';
import { Subscription } from 'rxjs';
import { Observable, Subject } from 'rxjs'
import GroupSelectionHelper from './GroupSelectionHelper'
import { DxDataGridComponent } from 'devextreme-angular';
import { PageSizeArray } from 'src/app/constants/pageNumber';
declare const $: any;

@Component({
  selector: 'app-front-desk',
  templateUrl: './front-desk.component.html',
  styleUrls: ['./front-desk.component.css']
})

export class FrontDeskComponent implements OnInit, OnDestroy {
  @ViewChild('filefacility') filefacility: any;
  @ViewChild('uploaddatafacility') uploaddatafacility: any;
  @ViewChild('closebutton') File_closebutton: any;
  @ViewChild('closeAutoRouteBtn') closeAutoRouteBtn: any;
  @ViewChild('hiddenCommonMessagePopUpButton', { static: false }) hiddenCommonMessagePopUpButton: ElementRef;
  @ViewChild('gridContainer', { static: false }) dataGridContainer: DxDataGridComponent;
  @ViewChild('closeBtn', { static: false }) closeBtn: ElementRef;

  //@ViewChild(DxDataGridComponent) dataGrid:DxDataGridComponent;
  dataGrid: any;
  images = [];
  url1: any;
  defaultValue;
  imageUrl: any;
  pageNumber: number = 1;
  pageSize: number;
  GridData: [] = [];
  docId: number; docType: string;
  filterBody: any = {};
  user__Id: String;
  totalFacility: number;
  selectedItemKeys: any[] = []; selectedValue: any = [];
  UploadFileSubscribe: Subscription; PatientDocFacilityBilling: Subscription; VerifyPId: string; VerifyDocId: string; VerifyAbbreviation: string; VerifyFileName: string
  Abbreviation: string; DocBarcodeID: string; Tech_Lien: string; Radiologist_Lien: string; Patient_Demo: string; Patient_Identification: string; DocType: string; VerifyFilePath: string
  DocumentList: Array<{ DocID: number, DType: string, DocName: string, PatientId: string, UploadPreview: boolean, Abbreviation: string, DocBarcodeID: string, Main_row: any }> = [];
  VerifyDocList: Array<{ Match: string, Expecting: string, File_Upload: string, Status: boolean }> = [];
  VerifyDocCount: boolean = false; VerifyOldDoc: boolean = true;
  DocId_Upload: string; DocType_Upload: string; PreviewFile: Blob;
  getDataListSubScribe: Subscription;
  DeletePatientId: string;  DeleteDType: string;  DeleteRow: any

  //// Grid setting fields
  resizingModes: string[] = ["nextColumn", "widget"];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  ////
  patientID: any = "";
  lastName: any = "";
  firstName: any = "";
  dob: any = "";
  isTodayAppointment: boolean = false;
  modality: any = "";
  facility: any = "";
  //
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fileMessage: string = '';
  fileList: any[] = [];
  //fileList1: { imageName: string, image: any[], type: null }[] = [];
  fileListData: Array<{ fileName: string, viewUrl: string, DocId: number, Dtype: string, Abbreviation: string, DocBarcodeID: string, ReferreId: string, fileInfo: any, Duplicacy: boolean }> = [];
  fileobj: any = {};
  selectedFileBLOB: any;
  htdPatientid: string;
  formuploaddata: any;
  submitted: boolean = false;
  gridItemsUpdateList: any[];
  doctypeList: any[] = [];
  SearchOrWithout: boolean = true;
  helper: GroupSelectionHelper;
  dataSource: object;
  readonly pageSizeArray = PageSizeArray;





  @ViewChild('SUploadFile') SUploadFile: ElementRef
  constructor(
    private sanitizer: DomSanitizer,
    private readonly commonMethodService: CommonMethodService,
    private readonly facilityService: FacilityService,
    private readonly storageService: StorageService,
    private readonly notificationService: NotificationService, private readonly patientService: PatientService) {
    this.fileListData = [];
    this.facilityService.filterFrontDesk.subscribe((res: any) => {
      this.patientID = res.patientID;
      this.lastName = res.lastName;
      this.firstName = res.firstName;
      this.dob = res.dob;
      this.isTodayAppointment = res.isTodayAppointment;
      this.modality = res.modality;
      this.facility = res.facility;
      this.pageNumber = 1;
      this.SearchOrWithout = false;
      this.getDataList(this.getApplyFilter(res.patientId, res.lastName, res.firstName, res.dob, this.isTodayAppointment, res.Modiality, res.Facility, this.user__Id));
    });
    this.commonMethodService.setTitle('Front Desk');
  }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.setGridSetting();
    this.doctypeCtrl();
    this.EmptyFolder();
    this.user__Id = this.storageService.user.UserId;
    if (this.SearchOrWithout === true) {
      this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,
        this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id));
    }


  }
  onInitialized(e) {
    this.dataGrid = e.component;
  }

  getDataList(filterBody: any, reLoad: string = '') {
    this.facilityService.GetFrontDeskListForFacilityBilling(true, filterBody, this.pageNumber, this.pageSize).subscribe((res) => {
      this.GridData = [];
      this.dataSource = [];
      if (res.response != null && res.response.length > 0) {
        this.totalFacility = res.totalRecords;
        this.GridData = res.response;
        this.MakeGroupOfSelectors(res.response)
        if (reLoad != '') { this.callMultipleUpload(reLoad); }
        this.dataSource = {
          store: {
            type: 'array',
            key: "INTERNALSTUDYID",
            data: this.GridData
          }
        }
      }
      this.onInitialized = this.onInitialized.bind(this);
    }, (err: any) => {
      this.errorNotification(err);
    });


  }

  MakeGroupOfSelectors(gridData: any) {
    this.helper = new GroupSelectionHelper(this.dataGrid, gridData, "INTERNALSTUDYID");
  }

  FacilityFrontDeskPageChanged(event: any) {
    this.pageNumber = event;
    this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id));
  }

  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }


  todayAppointment(event: any) {
    this.isTodayAppointment = event.target.checked;
    this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName,
      this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id));
  }
  getFacilityDetail(PatientId: any, DocType: any, row: any) {
    if (DocType) {
      let Doc_Id = (DocType != null) ? (DocType.split(',')[1]) : null;
      if (Doc_Id) {
        this.FilePreview(PatientId, Doc_Id, row);
      }
    }
  }

  showImage(image) {
    if (image.target.files && image.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let blob = new Blob(image.target.files, { type: image.target.files[0].type });
        let url = window.URL.createObjectURL(blob);
        this.selectedFileBLOB = this.sanitizer.bypassSecurityTrustUrl(url);
      };
      reader.readAsDataURL(image.target.files[0]);
    }
  }

  ngOnDestroy() {
    if (typeof this.UploadFileSubscribe !== "undefined") { this.UploadFileSubscribe.unsubscribe(); }
    if (typeof this.PatientDocFacilityBilling != "undefined") { this.PatientDocFacilityBilling.unsubscribe(); }
  }


  async uploadFile(event: any) {

    if (event.target.files === 0) {
      return;
    }
    if (event.target.files && event.target.files[0]) {
      var fileLength = event.target.files.length;
      for (let i = 0; i < fileLength; i++) {
        let fileName = event.target.files[i].name.toLowerCase();
        let fileExtension = event.target.files[i].name.toLowerCase().split('.').pop();
        let isValidExt = fileName.match(/.(pdf|png|jpg|jpeg)$/i)
        if (!isValidExt) {
          this.fileMessage = "Allow Only file with (pdf|png|jpg|jpeg) extension."
          return;
        }
        else {
          this.readFile(event.target.files[i]).subscribe((output) => {
            let file = new Blob([output], { type: event.target.files[i].type });
            this.GetFileDocIdTypeBarCode(event.target.files[i], file);
          })
        }
      }
    }
  }

  async GetFileDocIdTypeBarCode(fileInfo: any, file: Blob) {
    let formData = new FormData();
    formData.append("file", fileInfo);
    formData.append("UserId", this.storageService.user.UserId);
    await this.facilityService.GetFileDocIdTypeBarCode(true, formData).subscribe((res) => {
      if (res.response != null) {
        if (res.response.length > 0) {
          let docId = 0; let docType = "Select Document File Type"; let abbreviation = ''; let DocBarcodeID = '';
          for (let i = 0; i < res.response.length; i++) {
            if (res.response[i].DocId != 0) {
              docId = res.response[i].docId; docType = res.response[i].docType; abbreviation = res.response[i].abbreviation; DocBarcodeID = res.response[i].docBarcodeID;
            }
            let ArrayBuff = this._base64ToArrayBuffer(res.response[i].fileBytes);
            let file = new Blob([ArrayBuff], { type: 'application/pdf' });
            this.fileListData.push({ fileName: res.response[i].filename, viewUrl: URL.createObjectURL(file), DocId: docId, Dtype: docType, Abbreviation: abbreviation, DocBarcodeID: DocBarcodeID, ReferreId: this.htdPatientid, fileInfo: fileInfo, Duplicacy: false });
          }
        }
      }
    });
  }


  readFile(file: File): Observable<string> {
    const sub = new Subject<string>();
    var reader = new FileReader();
    reader.onload = () => {
      const content: string = reader.result as string;
      sub.next(content);
      sub.complete();
    };
    reader.readAsArrayBuffer(file);
    return sub.asObservable();
  }


  deleteRow(d) {
    const index = this.fileListData.indexOf(d);
    this.fileListData.splice(index, 1);
    this.GetCheckDocTypeDuplicacy();
  }
  deleteClose() {
    this.fileListData = [];
  }
  uploadfileattach() {
    if (this.fileListData.length >= 1) {
      let CHckFields = true;
      let formData = new FormData();
      for (let i = 0; i < this.fileListData.length; i++) {
        if (this.fileListData[i].DocId === 0 || this.fileListData[i].ReferreId === '') {
          CHckFields = false;
        }
      }
      if (CHckFields === false) { this.CodeErrorNotification('Fields cannot be empty.') }
      else {
        let JNum: number = 0; let Duplicacy = false; let isDup = false; let uniq_values = []; let DuplicateDocId = [];
        for (let i = 0; i < this.fileListData.length; i++) {
          formData.append("file", this.fileListData[i].fileInfo);
          formData.append("UserId", this.storageService.user.UserId);
          formData.append("DocId", this.fileListData[i].DocId.toString());
          formData.append("Dtype", this.fileListData[i].Dtype);
          formData.append("ReferreId", this.fileListData[i].ReferreId);
          formData.append("FileName", this.fileListData[i].fileName);
          formData.append("Abbreviation", this.fileListData[i].Abbreviation.toString());
          formData.append("DocBarcodeID", this.fileListData[i].DocBarcodeID.toString());
          JNum++;
          if (uniq_values.indexOf(this.fileListData[i].DocId.toString()) != -1) {
            isDup = true
            DuplicateDocId.push(this.fileListData[i].DocId.toString())
          }
          else {
            uniq_values.push(this.fileListData[i].DocId.toString());
          }
        }
        if (isDup === false) {
          this.CheckduplicacyUpload(formData, JNum);
        } else {
          this.checkDuplicacyDocType(DuplicateDocId);
          this.CodeErrorNotification('More than one document with same document type is not allowed');
        }
      }
    } else {
      this.CodeErrorNotification('Please select file to upload.');
    }
  }

  checkDuplicacyDocType(DuplicateDocId: any) {
    if (DuplicateDocId.length > 0) {
      for (let i = 0; i < this.fileListData.length; i++) {
        for (let DocId of DuplicateDocId) {
          if (DocId === this.fileListData[i].DocId.toString()) {
            this.fileListData[i].Duplicacy = true;
            break;
          } else { this.fileListData[i].Duplicacy = false; }
        }
      }
    }
  }
  async CheckduplicacyUpload(formData: any, JNum: number) {
    formData.append("FileCount", (JNum).toString());
    this.UploadFileSubscribe = await this.facilityService.CheckduplicacyUpload(true, formData).subscribe((res) => {
      if (res.response !== null) {
        if (res.responseCode === 200) {
          this.customSuccessNotification('All Files have been attached successfully');
          this.ReloadGrid(this.htdPatientid);
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }

  ReloadGrid(PatientId: string) {
    this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id), PatientId);
  }
  callMultipleUpload(PatientId: string) {
    this.VerifyDocList = [];
    this.CloseFileUploadModal();
    let BtnId = `doc_${PatientId}`;
    this.sleep(BtnId);
    this.uploaddatafacility.nativeElement.setAttribute('class', 'modal fade modal-theme modal-small show');
    this.uploaddatafacility.nativeElement.setAttribute('style', 'display: block');
    this.dataGridContainer.instance.refresh();
  }

  VerifyDoc(AllDocList: any) {
    this.VerifyDocList = [];
    for (let i = 0; i < AllDocList.length; i++) {
      let ArrayBuff = this._base64ToArrayBuffer(AllDocList[i].fileBytes);
      let file = new Blob([ArrayBuff], { type: 'application/pdf' });
      this.PreviewFile = file;
      this.VerifyPId = AllDocList[i].pId;
      this.VerifyDocId = AllDocList[i].docId;
      this.VerifyAbbreviation = AllDocList[i].abbreviation;
      this.VerifyFileName = AllDocList[i].fileName;
      this.VerifyFilePath = AllDocList[i].filePath;
      let Expecting_Pid = AllDocList[i].pId; let Expecting_docType = AllDocList[i].docType; let File_Upload_docType = ""; let File_Upload_Pid = "";
      let Status_Pid = false; let Status_docType = false; let uploaded = false;
      if (!AllDocList[i].uploaded) {
        if ((!AllDocList[i].pdf_PIdBarcode) && (!AllDocList[i].pdf_DocBarcodeId)) { File_Upload_docType = "Missing Barcode"; File_Upload_Pid = "Missing Barcode"; }
        else if ((AllDocList[i].pdf_PIdBarcode) && (AllDocList[i].pdf_DocBarcodeId)) {
          File_Upload_Pid = AllDocList[i].pdf_PIdBarcode;
          if ((!AllDocList[i].pdf_DocType)) { File_Upload_docType = "Missing Barcode"; } else {
            File_Upload_docType = AllDocList[i].pdf_DocType;
          }
          if ((AllDocList[i].pdf_PIdBarcode.toLowerCase().replace("pre", "") != AllDocList[i].pId.toLowerCase().replace("pre", "")) && (AllDocList[i].pdf_DocBarcodeId != AllDocList[i].docType_Barcode)) { Status_docType = false; Status_Pid = false; }
          else if ((AllDocList[i].pdf_PIdBarcode.toLowerCase().replace("pre", "") != AllDocList[i].pId.toLowerCase().replace("pre", ""))) { Status_Pid = false; Status_docType = true; }
          else if ((AllDocList[i].pdf_DocBarcodeId != AllDocList[i].docType_Barcode) || (!AllDocList[i].pdf_DocType)) { Status_Pid = true; Status_docType = false; }
        }
        else if ((AllDocList[i].pdf_PIdBarcode)) {
          Status_docType = false; File_Upload_docType = "Missing Barcode"; File_Upload_Pid = AllDocList[i].pdf_PIdBarcode;
          if (AllDocList[i].pdf_PIdBarcode.toLowerCase().replace("pre", "") != AllDocList[i].pId.toLowerCase().replace("pre", "")) { Status_Pid = false; }
          else { Status_Pid = true; }
        }
        else if ((AllDocList[i].pdf_DocBarcodeId)) {
          Status_Pid = false; File_Upload_Pid = "Missing Barcode"; File_Upload_docType = AllDocList[i].pdf_DocType;
          if (AllDocList[i].pdf_DocBarcodeId != AllDocList[i].docType_Barcode) { Status_docType = false; }
          else { Status_docType = true; }
        }
        this.VerifyDocList.push({ Match: "Patient Id", Expecting: Expecting_Pid, File_Upload: File_Upload_Pid, Status: Status_Pid })
        this.VerifyDocList.push({ Match: "Doc Type", Expecting: Expecting_docType, File_Upload: File_Upload_docType, Status: Status_docType })
      }
      else {
        this.customSuccessNotification('All Files have been attached successfully');
        uploaded = true;
        this.CloseFileUploadModal();
        this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id));
      }
      if (uploaded === false) {
        this.VerifyDocCount = true;
        this.closeBtn.nativeElement.click();
        this.filefacility.nativeElement.setAttribute('class', 'modal fade modal-theme modal-small show');
        this.filefacility.nativeElement.setAttribute('style', 'display: block');
      }
    }
  }

  ViewFile(File: Blob) {
    window.open(URL.createObjectURL(File), '_blank');
  }

  CloseFileUploadModal() {
    this.File_closebutton.nativeElement.click();
    this.closeAutoRouteBtn.nativeElement.click();
    this.filefacility.nativeElement.setAttribute('style', 'display: none');
  }


  doctypeCtrl() {
    this.facilityService.GetMasterDocTypeFacilityBilling(true).subscribe((res) => {
      if (res.response) {
        this.doctypeList = res.response.filter((item) => {
          if (item.Abbreviation === 'ID')
            item.DocType = 'Patient ID';
          return item;
        });
      }
    })
  }

  getDocType(event: any, index: number) {
    let Abbindex: number = event.target["selectedIndex"] - 1;
    this.docId = event.target.value;
    this.docType = event.target.options[event.target.options.selectedIndex].text;
    this.Abbreviation = this.doctypeList[Abbindex].Abbreviation;
    this.DocBarcodeID = this.doctypeList[Abbindex].BarcodeID;
    const item = this.fileListData[index];
    item.DocId = this.docId;
    item.Dtype = this.docType;
    item.Abbreviation = this.Abbreviation;
    item.DocBarcodeID = this.DocBarcodeID;
    this.GetCheckDocTypeDuplicacy();
  }

  GetCheckDocTypeDuplicacy() {
    let isDup = false; let uniq_values = []; let DuplicateDocId = [];
    for (let i = 0; i < this.fileListData.length; i++) {
      if (this.fileListData[i].DocId.toString() != "0") {
        if (uniq_values.indexOf(this.fileListData[i].DocId.toString()) != -1) {
          isDup = true
          DuplicateDocId.push(this.fileListData[i].DocId.toString())
        }
        else {
          uniq_values.push(this.fileListData[i].DocId.toString());
        }
      }
      this.fileListData[i].Duplicacy = false;
    }
    if (isDup === true) {
      this.checkDuplicacyDocType(DuplicateDocId);
      this.CodeErrorNotification('More than one of the same document type is not allowed please resolve duplicate issues and then submit your files');
    }
  }

  onFileChange(event: any, PatientId: any, DType: any, DocName: string, Abbreviation: string, DocBarcodeID: string) {
    if (event.target.files && event.target.files[0]) {
      var fileLength = event.target.files.length;
      let formData = new FormData();
      let isValidExt = !!event.target.files[0].name.match(/(.pdf|.png|.jpg|.jpeg|)/);
      if (!isValidExt) {
        this.fileMessage = "Allow Only file with (pdf|png|jpg|jpeg) extension."
        return;
      }
      else {
        formData.append("file", event.target.files[0]);
        formData.append("UserId", this.storageService.user.UserId);
        formData.append("DType", DType);
        formData.append("DocName", DocName);
        formData.append("ReferreId", PatientId);
        formData.append("FileName", event.target.files[0]["name"]);
        formData.append("Abbreviation", Abbreviation);
        formData.append("DocBarcodeID", DocBarcodeID);
        this.getData(formData);
      }
    }
  }

  async getData(formData: any) {
    this.UploadFileSubscribe = await this.facilityService.UploadFilesForFacilityBilling(true, formData).subscribe((res) => {
      if (res.response !== null) {
        if (res.responseCode === 200) {
          this.fileListData = [];
          this.VerifyDoc(res.response);
        }
      }
    },
      (err: any) => {
        this.errorNotification(err);
      });
  }

  viewDetail(url: any) {
    window.open(url, '_blank');
  }

  goEventFire(selectedvalue) {
    this.hiddenCommonMessagePopUpButton.nativeElement.click();
  }



  getUploadAttachFile(row: any, buttonId: any) {

    this.DocumentList = [];

    var Tech_Lien = (row.data.TC_PSL != null) ? (row.data.TC_PSL.split(',')[1]) : null;
    var RAD_Lien = (row.data.P_PSL != null) ? (row.data.P_PSL.split(',')[1]) : null;
    //var Patient_Signed_Lien = (row.data.PSL != null) ? (row.data.PSL.split(',')[1]) : null;
    var Patient_Demo = (row.data.PATDEM != null) ? (row.data.PATDEM.split(',')[1]) : null;
    var Patient_Identification = (row.data.ID != null) ? (row.data.ID.split(',')[1]) : null;
    var UploadPreview = false;

    for (let i = 0; i < this.doctypeList.length; i++) {
      UploadPreview = false;

      (this.doctypeList[i]["DocID"] == Tech_Lien)? (UploadPreview=true):'';
      (this.doctypeList[i]["DocID"] == RAD_Lien)? (UploadPreview=true):'';
      //(this.doctypeList[i]["DocID"] == Patient_Signed_Lien) ? (UploadPreview = true) : '';
      (this.doctypeList[i]["DocID"] == Patient_Demo) ? (UploadPreview = true) : '';
      (this.doctypeList[i]["DocID"] == Patient_Identification) ? (UploadPreview = true) : '';
      const DocID = this.Get_MainDoc_IdUploadPreview(row, this.doctypeList[i]["DocID"])[0];
      this.DocumentList.push({ DocID: Number(DocID), DType: this.doctypeList[i]["DocID"], DocName: this.doctypeList[i]["DocType"], PatientId: row.data.PATIENTID, UploadPreview: UploadPreview, Abbreviation: this.doctypeList[i]["Abbreviation"], DocBarcodeID: this.doctypeList[i]["BarcodeID"], Main_row: row });
    }
    this.VerifyDocCount = true;
    this.htdPatientid = row.data.PATIENTID;
  }

  VerifedAttachFile() {
    if ((this.VerifyPId) && (this.VerifyDocId) && (this.VerifyAbbreviation) && (this.VerifyFileName) && (this.PreviewFile) && (this.VerifyFilePath)) {
      let formData = new FormData();
      formData.append("PId", this.VerifyPId);
      formData.append("UserId", this.storageService.user.UserId);
      formData.append("DocId", this.VerifyDocId);
      formData.append("Abbreviation", this.VerifyAbbreviation);
      formData.append("FileName", this.VerifyFileName);
      formData.append("FileInfo", this.VerifyFilePath);
      formData.append("DocBarcodeID", this.DocBarcodeID);
      this.facilityService.VerifedAttachFileFacilityBilling(true, formData).subscribe((res) => {
        if (res.responseCode === 200) {

          this.customSuccessNotification('All Files have been attached successfully');
          this.ReloadGrid(this.VerifyPId);
        }

      }, (err: any) => {
        this.errorNotification(err);
      })
    }
  }


  async sleep(BtnId: any) {
    return await setTimeout(async function () {
      var submit = document.getElementById(BtnId);
      submit.click();
    }, 500);
  }

  //-------------Delete file from Patient folder----------------------------

  DeleteRecordFile(PatientId: string, DType: string, row: any){
    this.DeletePatientId = PatientId;  this.DeleteDType = DType;  this.DeleteRow= row;
  }

  async DeleteUploadedFile() {  
      if (this.DeletePatientId && this.DeleteDType &&  this.DeleteRow) {
        let Ret_Data = this.Get_MainDoc_IdUploadPreview( this.DeleteRow, this.DeleteDType);
        const DocID = Ret_Data[0],
          UserId = Ret_Data[1];
        if (DocID) {
          if (this.storageService.user.UserId === UserId) {
            await this.facilityService.DeleteUploadedFileBilling(true, this.DeletePatientId, DocID, this.storageService.user.UserId).subscribe(res => {
              if (res.responseCode === 200) {
                if (res.message === "0") {
                  this.customSuccessNotification("File has been deleted successfully");
                  this.DocumentList.find(item => item.DocID == Number(DocID)).UploadPreview = false;
                  this.getDataList(this.getApplyFilter(this.patientID, this.lastName, this.firstName, this.dob, this.isTodayAppointment, this.modality, this.facility, this.user__Id));
                  this.dataGridContainer.instance.refresh();
                } else if (res.message == "1") {
                  this.CodeErrorNotification('You can\'t delete other user file.');
                }
              }
            });
          } else {
            this.CodeErrorNotification('You can\'n delete other user file.');
          }
        }
      }    
  }
  //-----------End---------------------------------------------

  Get_MainDoc_IdUploadPreview(row: any, FromDocId: string) {
    var Tech_Lien = (row.data.TC_PSL != null) ? (row.data.TC_PSL.split(',')[1]) : null;
    var RAD_Lien = (row.data.P_PSL != null) ? (row.data.P_PSL.split(',')[1]) : null;
    //var Patient_Signed_Lien = (row.data.PSL != null) ? (row.data.PSL.split(',')[1]) : null;
    var Patient_Demo = (row.data.PATDEM != null) ? (row.data.PATDEM.split(',')[1]) : null;
    var Patient_Identification = (row.data.ID != null) ? (row.data.ID.split(',')[1]) : null;

    let DocId = ''; let User_Id = '';
    if (FromDocId == Tech_Lien) { DocId = row.data.TC_PSL.split(',')[2]; User_Id = row.data.TC_PSL.split(',')[3]; }
    if (FromDocId == RAD_Lien) { DocId = row.data.P_PSL.split(',')[2]; User_Id = row.data.P_PSL.split(',')[3]; }

    //if (FromDocId == Patient_Signed_Lien) { DocId = row.data.PSL.split(',')[2]; User_Id = row.data.PSL.split(',')[3]; }
    if (FromDocId == Patient_Demo) { DocId = row.data.PATDEM.split(',')[2]; User_Id = row.data.PATDEM.split(',')[3]; }
    if (FromDocId == Patient_Identification) { DocId = row.data.ID.split(',')[2]; User_Id = row.data.ID.split(',')[3]; }

    return [DocId, User_Id];
  }

  getApplyFilter(patientID: any, lastName: any, firstName: any, dob: any, isTodayAppointment: boolean,
    modality: any, facility: any, userid: any): any {
    return {
      "patientID": patientID, "lastName": lastName, "firstName": firstName,
      "dob": dob, "isTodayAppointment": isTodayAppointment, "modality": modality, "facility": facility, "userid": userid
    }
  }
  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
  }
  BulkPrintToday() {
    this.facilityService.GetTodayIntakePacket().subscribe((res) => {
      if (res.response) {
        const blobData = this.convertBase64ToBlobData(res.response[0].file);
        const blob = new Blob([blobData], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    }, (err: any) => {
      this.errorNotification(err);
    })
  }

  convertBase64ToBlobData(base64Data: string, contentType: string = 'application/pdf', sliceSize = 512) {
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  //-------------------Conver to ArrayBuffer -----------------------
  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  //-----------End---------------------------------------------

  //------------Empty Temp folder------------------------
  EmptyFolder = (function () {
    var executed = false;
    return function () {
      if (!executed) {
        executed = true;
        this.EmptyDirectorySubscribe = this.facilityService.getEmptyDirectory(true, this.storageService.user.UserId).subscribe();
      }
    };
  })();

  //-----------End---------------------------------------------

  FilePreview(PatientId: string, DType: string, row: any) {
    let Ret_Data = this.Get_MainDoc_IdUploadPreview(row, DType);
    const DocID = Ret_Data[0];
    //UserId = Ret_Data[1];   
    if (DocID && PatientId) {
      this.PatientDocFacilityBilling = this.facilityService.getPatientDocFacilityBilling(true, PatientId, DocID).subscribe((res) => {
        if (res.responseCode === 200) {
          let ArrayBuff = this._base64ToArrayBuffer(res.response);
          let file = new Blob([ArrayBuff], { type: 'application/pdf' });
          window.open(URL.createObjectURL(file), '_blank');
        } else {
          this.errorNotification(res);
        }
      });
    }
  }

  //---------------Grid-------------------

  setGridSetting() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [{
      key: "auto",
      name: "Immediately"
    }, {
      key: "onClick",
      name: "On Button Click"
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
  }

  customSuccessNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data,
      alertType: 200
    });
  }
  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: '',
      alertMessage: msg,
      alertType: 400
    });
  }

  //-----------End---------------------------------------------

  getPatientDetailById(row: any) {
    let body = {
      'internalPatientId': row.data.PATIENTID.replace('PRE', ''),
      'internalStudyId': row.data.INTERNALSTUDYID,
      'hasAlert': row.data.HasAlert
    }

  }
}
