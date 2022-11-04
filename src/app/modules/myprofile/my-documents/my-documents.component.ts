import { Component, ElementRef, OnInit, ViewChild, NgModule, Renderer2 } from '@angular/core';
import { DocumentmanagerService } from 'src/app/services/document-manager-service/document.manager.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { StorageService } from 'src/app/services/common/storage.service';
import { DxFileManagerComponent } from 'devextreme-angular';
import { interval, Subscription } from 'rxjs';
import ObjectFileSystemProvider from 'devextreme/file_management/object_provider';
import { DxTreeViewComponent, DxContextMenuComponent } from 'devextreme-angular';
import { FileManagerService, folderTree, FileItem, MenuItem } from 'src/app/services/file-manager-service/file-manager.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';
import { DatePipe } from '@angular/common'
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

declare const $: any;

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.component.html',
  styleUrls: ['./my-documents.component.css'],
  providers: [FileManagerService, DocumentmanagerService,DatePipe],
})
export class MyDocumentsComponent implements OnInit {

  //@ViewChild('treeview') treeView: DxTreeViewComponent;
  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;
  @ViewChild(DxContextMenuComponent, { static: false }) contextMenu: DxContextMenuComponent;
  
  
  
  @ViewChild('hiddenUploadFilePopUp', { static: false }) hiddenUploadFilePopUp: ElementRef;
  @ViewChild(DxFileManagerComponent, { static: false }) fileManager: DxFileManagerComponent;
  @ViewChild('fileUpload', { static: false }) fileUploadElement: ElementRef;
  @ViewChild('hiddenViewFile', { static: false }) hiddenViewFile: ElementRef;
  
  selectedFileNames: any = [];
  selectedFileBase64String: any = [];

  isfileSizeOk: boolean = false;
  submitted = false;
  documentTypeList: any = [];
  selectedDocumentTypeId: any = '';
  docTypeModelChange: boolean = false;
  selectedUploadFile: any[] = [];
  folderTree: folderTree[];
  selectedTreeItem: folderTree;
  parentDir: any;
  allFile: FileItem[] = [];
  data: any = [];
  getDisabled: boolean;
  newFolderContext: boolean;
  objectFileProvider: ObjectFileSystemProvider;
  selectedFileKeys: any = [];
  fileName: string;
  fileData: SafeResourceUrl;
  folderFileDelete: string; currentDeleteItemRecord: any = {};
  selectedFileBLOB: any;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private readonly myprofileService:MyprofileService,public readonly fileManagerService: FileManagerService, 
    private renderer: Renderer2, private elRef: ElementRef, public documentmanagerService: DocumentmanagerService,
    private notificationService: NotificationService, private readonly storageService: StorageService, 
    private sanitizer: DomSanitizer,
    public datepipe: DatePipe,private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('My Documents');
    this.getDisabled = true; this.newFolderContext = true;
    this.folderFileTree();
    this.getDocumentType();
  }
  ngAfterViewInit() {
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-toolbar'), 'display', 'none');
    this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-breadcrumbs'), 'display', 'none');
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
  uploadFile() {
    this.docTypeModelChange = false;
    this.selectedDocumentTypeId = '';
    this.selectedUploadFile = [];
    this.fileUploadElement.nativeElement.value = '';
    this.hiddenUploadFilePopUp.nativeElement.click();
  }
  setUploadedFileDocType(docType: Event) {
    this.selectedDocumentTypeId = docType;
    this.docTypeModelChange = true;
  }
  fileBrowseHandler(files) {
    this.selectedUploadFile = [];
    if (files.length > 1) {
      this.CodeErrorNotification("only single file upload at a time");
      return;
    }
    if (files[0].name.match(/.(jpg|jpeg|png|gif|bmp|txt|doc|docx|xlsx|xls|pdf)$/i)) {
      var sizeInMB = Number(((files[0].size) / (1024 * 1024)).toFixed(2));
      if (sizeInMB < 20) {
        this.prepareFilesList(files);
        this.isfileSizeOk = false;
      } else {
        this.isfileSizeOk = true;
      }
    }
    else {
      this.CodeErrorNotification("file type not allowed");
    }
  }

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
  deleteSelectedUploadFile(index: number) {
    this.selectedUploadFile.splice(index, 1);
    this.fileUploadElement.nativeElement.value = '';
  }
  onFileDropped($event) {
    this.selectedUploadFile = [];
    if ($event.length > 1) {
      this.CodeErrorNotification("only single file upload at a time");
      return;
    }
    this.prepareFilesList($event);
  }
  uploadFileMgr(file: any) {
    if (this.selectedUploadFile.length === 0) {
      return;
    }
    const formData = new FormData();
    let docTypeBody: any = {
      'FileName': encodeURIComponent(this.selectedUploadFile[0].name),
      'DocTypeId': this.selectedDocumentTypeId.DocId,
      'owner': this.storageService.user.UserId,
      'UploadedPage': this.selectedTreeItem.folderPath
    }
    formData.append("fileInfo", this.selectedUploadFile[0]);
    formData.append("body", JSON.stringify(docTypeBody));
    this.fileManagerService.uploadFile(true, formData).subscribe((res) => {
      if (res != null) {

        this.folderTree.push(res.response);
        this.treeView.instance._refresh();
        this.successNotification(res);
        this.setFileManagerRowColor();
        this.getAllFIles();
      }
      else {
        //this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  setFileManagerRowColor() {
    let intervalSubscription: Subscription;
    let second = interval(100);
    intervalSubscription = second.subscribe((sec) => {
      let docManager = document.getElementById("fileManager");
      let rows = docManager.getElementsByClassName("dx-row dx-data-row");
      if (rows != undefined && rows?.length === this.folderTree?.length) {
        intervalSubscription.unsubscribe();
        if (rows?.length > 0) {

          for (let i = 0; i <= rows?.length - 1; i++) {
            let currentRow = <HTMLElement>rows[i];
            let cellValue = (<HTMLTableCellElement>rows[i].childNodes.item(2)).innerText;
            currentRow.classList.remove('dx-row-focused', 'dx-cell-focus-disabled', 'dx-selection');

            if (cellValue.toLowerCase() === "drop letter") {
              currentRow.style.backgroundColor = "#add8e6";
            }
            else if (cellValue.toLowerCase() === "bill") {
              currentRow.style.backgroundColor = "#F5B7B1";
            }
            else if (cellValue.toLowerCase() === "ar payment") {
              currentRow.style.backgroundColor = "#ba8cd7";
            }
            else if (cellValue.toLowerCase() === "attorney signed lien") {
              currentRow.style.backgroundColor = "#fad4da";
            }

          }
        }
      }
    });
  }
  treeViewItemContextMenu(e) {
    this.parentDir = e;
    this.selectedTreeItem = e.itemData;
  }  
  

  onItemClick(e) {
    switch (e.itemData.text) {
      case 'Open': {
        if (this.selectedFileKeys.length === 1) {
          this.displayFile(e.fileSystemItem.dataItem.name, e.fileSystemItem.dataItem.fileBase64);
        } else if (this.selectedFileKeys.length > 1) {
          this.CodeErrorNotification("Only single file can display.");
        }
        else {
          this.CodeErrorNotification("Please select a file to display.");
        }
        break;
      }
      case 'Download File': {
        if (this.selectedFileKeys.length === 1) {
          this.downloadFile(this.selectedFileNames, this.selectedFileBase64String, e.fileSystemItem.dataItem.fileBase64);
        } else if (this.selectedFileKeys.length > 1) {
          this.CodeErrorNotification('only single file can download at a time.');
        }
        else {
          this.CodeErrorNotification('Please select a single file for download.');
        }
        break;
      }
    }
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
  downloadFile(fileName, fileData, fileBase64OtherFile) {
    var source;
    const link = document.createElement("a");
    if (fileName.match(/.(jpg|jpeg|png|gif|pdf)$/i)) {
      source = fileData;
    } else {
      let ArrayBuff = this._base64ToArrayBuffer(fileBase64OtherFile);
      source = URL.createObjectURL(new Blob(
        [ArrayBuff],
        { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
      ))
    }
    link.href = source;
    link.download = `${fileName}`
    link.click();
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
 


  fileManager_onSelectionChanged(e) {
    this.selectedFileKeys = [];
    var oldUploadedPage = this.selectedTreeItem.folderPath.substring(0, this.selectedTreeItem.folderPath.indexOf('\\'));
    if (!oldUploadedPage) { oldUploadedPage = this.selectedTreeItem.folderPath; }
    if (e.selectedItems.length > 0) {
      for (var i = 0; i < e.selectedItems.length; i++) {
        this.selectedFileKeys.push({
          'Files': e.selectedItems[i].dataItem.name, 'docId': e.selectedItems[i].dataItem.docId,
          'UploadedPage': this.selectedTreeItem.folderPath,
        })
      }
    }
    oldUploadedPage = oldUploadedPage.toLowerCase();
   

    if (this.selectedFileKeys.length > 0) {
      this.selectedFileNames = e.selectedItems.map(m => m.name)[0];
      let fileExtension = this.selectedFileNames.split('.').pop();
      if (this.selectedFileNames.match(/.(jpg|jpeg|png|gif)$/i)) {
        this.selectedFileBase64String = "data:image/" + fileExtension + ";base64," + e.selectedItems.map(f => f.dataItem).map(m => m.fileBase64)[0];;
      }
      else if (this.selectedFileNames.match(/.(pdf)$/i)) {
        this.selectedFileBase64String = "data:application/pdf;base64," + e.selectedItems.map(f => f.dataItem).map(m => m.fileBase64)[0];;
      }
      this.getDisabled = false;
    }
  }

  selectItem(e) {

    this.fileManager.instance.refresh();
    $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="mixed"').trigger('click')
    $('.dx-command-select[role="columnheader"]').find('.dx-select-checkbox[aria-checked="true"').trigger('click')
    this.selectedFileKeys = [];
    this.selectedTreeItem = e.itemData;
    this.parentDir = e;
    let folderName = this.selectedTreeItem.folderName.toLowerCase();
    this.getDisabled = true;
    this.getAllFIles();
  }

  getAllFIles() {
    this.fileManager.instance.refresh();
    let oldUploadedPage = this.selectedTreeItem.folderPath.substring(0, this.selectedTreeItem.folderPath.indexOf('\\'));
    if (!oldUploadedPage) { oldUploadedPage = this.selectedTreeItem.folderPath; }
    this.fileManagerService.getFiles(this.storageService.user.UserId, this.selectedTreeItem.folderPath, oldUploadedPage).subscribe((res) => {
      if (res != null) {
        this.allFile = res.response;
        setTimeout(() => {
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-toolbar'), 'display', 'none');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-breadcrumbs'), 'display', 'none');


        }, 25);
      }
      else {
        //this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  folderFileTree() {   
    let firstname = JSON.parse(localStorage.getItem('_cr_u_infor')).firstname; 
    let lastname = JSON.parse(localStorage.getItem('_cr_u_infor')).lastname; 
    let birthday = JSON.parse(localStorage.getItem('_cr_u_infor')).birthday; 
    let dateOfbirth =this.datepipe.transform(birthday, this.dateTimeFormatCustom.Date);
    let UserFolder = firstname + lastname + "_" + dateOfbirth + "_" + JSON.parse(localStorage.getItem('_cr_u_infor')).userid

    this.myprofileService.getMyDocTree(UserFolder).subscribe((res) => {
      if (res.response) {
        this.folderTree = JSON.parse(JSON.stringify(res.response));
        setTimeout(() => {
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-toolbar'), 'display', 'none');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-breadcrumbs'), 'display', 'none');
          if (this.selectedTreeItem) {
            this.treeView.instance.expandItem(this.selectedTreeItem.id);
            this.treeView.instance.selectItem(this.selectedTreeItem.id);
          }
          else if (this.parentDir) {
            this.treeView.instance.expandItem(this.parentDir.node.parent.key);
            this.treeView.instance.selectItem(this.parentDir.node.parent.key);
          }
          else {
            this.treeView.instance.expandItem(1);
            this.treeView.instance.selectItem(1);
            this.selectedTreeItem = this.treeView.instance.getSelectedNodes()[0].itemData;
          }
          // console.log(this.treeView.instance.getSelectedNodes()[0].itemData)

          this.getAllFIles();

        }, 500);
      }
    });
  }
  


  CodeErrorNotification(msg: string) {
    this.notificationService.showNotification({
      alertHeader: 'Error',
      alertMessage: msg,
      alertType: 400
    });
  }
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
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



}
