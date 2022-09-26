import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DxContextMenuComponent, DxFileManagerComponent, DxTreeViewComponent } from 'devextreme-angular';
import ObjectFileSystemProvider from 'devextreme/file_management/object_provider';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { DocumentmanagerService } from 'src/app/services/document-manager-service/document.manager.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { FileManagerService, folderTree, FileItem, MenuItem } from 'src/app/services/file-manager-service/file-manager.service';
import { interval, Subscription } from 'rxjs';
import { CommonRegex } from 'src/app/constants/commonregex';

declare const $: any;

@Component({
  selector: 'app-document-manager-facility',
  templateUrl: './document-manager-facility.component.html',
  styleUrls: ['./document-manager-facility.component.css'],
  providers: [FileManagerService, DocumentmanagerService],
})
export class DocumentManagerFacilityComponent implements OnInit {

  @ViewChild(DxTreeViewComponent, { static: false }) treeView: DxTreeViewComponent;
  @ViewChild(DxContextMenuComponent, { static: false }) contextMenu: DxContextMenuComponent;
  @ViewChild('hiddenFileRenamePopUpItem', { static: false }) hiddenFileRenamePopUpItem: ElementRef;
  @ViewChild('hiddenFileDeleteItem', { static: false }) hiddenFileDeleteItem: ElementRef;
  @ViewChild('hiddenUploadFilePopUp', { static: false }) hiddenUploadFilePopUp: ElementRef;
  @ViewChild('hiddenSendFaxPopUp', { static: false }) hiddenSendFaxPopUp: ElementRef;
  @ViewChild('hiddenSendEmailPopUp', { static: false }) hiddenSendEmailPopUp: ElementRef;
  @ViewChild(DxFileManagerComponent, { static: false }) fileManager: DxFileManagerComponent;
  @ViewChild('fileUpload', { static: false }) fileUploadElement: ElementRef;
  @ViewChild('hiddenViewFile', { static: false }) hiddenViewFile: ElementRef;
  isnewFolderDisabled: boolean = true; isUploadDisabled: boolean = true; isDeleteDisabled: boolean = true;
  selectedFileNames: any = [];
  selectedFileBase64String: any = [];
  newFolderForm: FormGroup;
  renameForm: FormGroup;
  sendFaxForm: FormGroup;
  sendEmailForm: FormGroup;
  modelValue: string = "modal";
  isfileSizeOk: boolean = false;
  submitted = false;
  submittedSendFax = false;
  submittedSendEmail = false;
  documentTypeList: any = [];
  selectedDocumentTypeId: any = '';
  docTypeModelChange: boolean = false;
  selectedUploadFile: any[] = [];
  folderTree: folderTree[];
  selectedTreeItem: folderTree;
  parentDir: any;
  allFile: FileItem[] = [];
  menuItems: MenuItem[];
  data: any = [];
  getDisabled: boolean;
  newFolderContext: boolean;
  objectFileProvider: ObjectFileSystemProvider;
  selectedFileKeys: any = [];
  fileName: string;
  fileData: SafeResourceUrl;
  folderFileDelete: string; currentDeleteItemRecord: any = {};
  selectedFileBLOB: any;
  readonly commonRegex=CommonRegex;
  path :any

  MainFolderName: string;;
  facilityId: string;
  facilityName: string;
  from: string;
  currentFileRename: boolean = false;
  GetRenameFileExtension: string = '';
  UploadedPage:any;
  currentPatientId

  constructor(private notificationService: NotificationService, public readonly documentmanagerService: DocumentmanagerService, private readonly storageService: StorageService, private elRef: ElementRef,
    private renderer: Renderer2, private readonly facilityService: FacilityService, public readonly fileManagerService: FileManagerService,
    private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.facilityService.docManagerFacility.subscribe((res: any) => {
      if (res.dataAll) {
        //this.selectedTreeItem = new folderTree();     
        this.from = res.dataAll.from;
        if(this.from=='FacilityParent'){
          this.facilityId = res.dataAll.facilityParentId;
          this.facilityName = res.dataAll.FacilityParentName;
        }else{
          this.facilityId = res.dataAll.facilityId;
          this.facilityName = res.dataAll.facilityName;
        }
        this.MainFolderName = this.facilityName + '_ID' + this.facilityId;
        this.allFile = [];
        this.folderFileTree();
        this.menuItems = this.fileManagerService.getMenuFacilityItems();
        this.getDocumentType();
      }
    });
  }

  ngOnInit(): void {
    this.getDisabled = true; this.newFolderContext = true;
    this.initializeForm();

  }

  initializeForm() {
    this.newFolderForm = this.fb.group({
      newFolderTxt: ['', [Validators.required]]
    });
    this.renameForm = this.fb.group({
      renameTxt: ['', [Validators.required]]
    });
    this.sendFaxForm = this.fb.group({
      sendFaxTxt: ['', [Validators.required, Validators.pattern(this.commonRegex.FaxRegex)]]
    });
    this.sendEmailForm = this.fb.group({
      sendToTxt: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex)]],
      sendFromTxt: ['', [Validators.required]],
      subjectTxt: ['', [Validators.required]],
      bodyTxt: ['', [Validators.required]]
    });


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
    console.log(this.selectedTreeItem);
    if (this.selectedUploadFile.length == 0) {
      return;
    }
    const formData = new FormData();
    let docTypeBody: any = {
      'FileName': encodeURIComponent(this.selectedUploadFile[0].name),
      'DocTypeId': this.selectedDocumentTypeId.DocId,
      'owner': this.storageService.user.UserId,
      'UploadedPage': this.from,
      'ReferreId': this.facilityId
    }
    formData.append("fileInfo", this.selectedUploadFile[0]);
    formData.append("body", JSON.stringify(docTypeBody));
    
    this.fileManagerService.uploadFacilityFile(true, formData,  this.UploadedPage ).subscribe((res) => {
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
      if (rows != undefined && rows?.length == this.folderTree?.length) {
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
  treeViewItemContextMenu(e) {

    this.parentDir = e;
    this.selectedTreeItem = e.itemData;
    let folderName = this.selectedTreeItem.folderName.toLowerCase();
    const contextMenu = this.contextMenu.instance;
    contextMenu.option('items[0].disabled', false);
    contextMenu.option('items[1].disabled', false);
    contextMenu.option('items[2].disabled', false);

    if (folderName == this.MainFolderName.toLowerCase()) {
      contextMenu.option('items[0].disabled', true);
      contextMenu.option('items[1].disabled', true);
    }
  }
  deleteFolder() { this.selectedFileKeys.length > 0 ? this.folderFileDelete = "file" : this.folderFileDelete = "folder"; this.hiddenFileDeleteItem.nativeElement.click(); }
  
  getFilesByKey(name: any, path:any){
    debugger
    this.documentmanagerService.getFilesByKey(true,JSON.stringify(path)).subscribe((res) => { 
      if (res.response != null) {
        this.path = JSON.parse(res.response).Base64 ;  
        this.displayFile(name, this.path);
      }
    }) 
  }

  onItemClick(e) {
    switch (e.itemData.text) {
      case 'Open': {
        if (this.selectedFileKeys.length == 1) {
          this.getFilesByKey( e.fileSystemItem.dataItem.name, e.fileSystemItem.dataItem.filePath)
          //this.displayFile(e.fileSystemItem.dataItem.name, e.fileSystemItem.dataItem.fileBase64);
        } else if (this.selectedFileKeys.length > 1) {
          this.CodeErrorNotification("Only single file can display.");
        }
        else {
          this.CodeErrorNotification("Please select a file to display.");
        }
        break;
      }
      case 'Delete': {
        if (this.selectedFileKeys.length > 0) {
          this.folderFileDelete = "file";
          this.hiddenFileDeleteItem.nativeElement.click();
        } else {
          this.CodeErrorNotification("Please select a file to delete.");
        }
        break;
      }
      case 'Upload': {
        this.uploadFile()
        break;
      } case 'Send Fax': {
        this.hiddenSendFaxPopUp.nativeElement.click();
        break;
      } case 'Send Email': {
        this.hiddenSendEmailPopUp.nativeElement.click();
        break;
      } case 'Rename': {
        if (this.selectedFileKeys.length == 1) {
          this.hiddenFileRenamePopUpItem.nativeElement.click();
          let FileNamewithoutExtension = e.fileSystemItem.dataItem.name.substring(0, e.fileSystemItem.dataItem.name.lastIndexOf('.')) || e.fileSystemItem.dataItem.name
          this.GetRenameFileExtension = e.fileSystemItem.dataItem.name.split('.').pop();
          this.renameForm.patchValue({
            renameTxt: FileNamewithoutExtension
          });
          this.currentFileRename = true;
          //this.currentRenameItemRecord = { 'docId': e.fileSystemItem.dataItem.docId, 'name': e.fileSystemItem.dataItem.name, 'referrerId': e.fileSystemItem.dataItem.referreId, 'docType': e.fileSystemItem.dataItem.docType, 'fileBase64': e.fileSystemItem.dataItem.fileBase64 }
          console.log(this.selectedFileKeys);
        }
        else if (this.selectedFileKeys.length > 1) {
          this.CodeErrorNotification('only single file can rename at a time.');
        }
        else {
          this.CodeErrorNotification('Please select a single file for rename.');
        }
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
    if (oldUploadedPage == this.MainFolderName.toLowerCase()) {
      if (this.selectedFileKeys.length > 0) {
        this.isDeleteDisabled = false;
      } else {
        this.isDeleteDisabled = true;
      }
    }

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

  contextMenuItemClick(e) {
    const treeView = this.treeView.instance;
    switch (e.itemData.id) {
      case 'delete': {
        this.folderFileDelete = "folder";
        this.hiddenFileDeleteItem.nativeElement.click();
        break;
      }
      case 'rename': {
        this.hiddenFileRenamePopUpItem.nativeElement.click();
        this.renameForm.patchValue({
          renameTxt: this.selectedTreeItem.folderName
        });
        this.currentFileRename = false;
        break;
      }
      case 'upload': {
        this.uploadFile();
      }
    }
  }
  sendFax(isItemtext: boolean) {
    if (isItemtext) {
      this.submittedSendFax = true;
      this.modelValue = "modal";
      if (this.sendFaxForm.invalid) {
        this.modelValue = "";
        return;
      }
      this.submittedSendFax = false;
      let FilePath = this.selectedFileKeys[0].UploadedPage + "\\" + this.selectedFileKeys[0].Files;
      let docId = this.selectedFileKeys[0].docId;
      this.fileManagerService.facilitySendFax(this.refSendFaxForm.sendFaxTxt.value, FilePath, docId, Number(this.facilityId),this.from).subscribe((res) => {
        if (res.responseCode == 200) {
          this.submittedSendFax = false; this.modelValue = "modal";
          this.successNotification(res);
          this.folderFileTree();
          this.sendFaxForm.reset();
        }
      }, (err) => {
        this.errorNotification(err);

      });
    } else {
      this.submittedSendFax = false;
      this.sendFaxForm.reset();
    }
  }
  sendEmail(isItemtext: boolean) {
    if (isItemtext) {
      this.submittedSendEmail = true;
      this.modelValue = "modal";
      if (this.sendEmailForm.invalid) {
        this.modelValue = "";
        return;
      }
      this.submittedSendEmail = false;
      let body = {
        'SendTo': this.refSendEmailForm.sendToTxt.value,
        'sendFrom': this.refSendEmailForm.sendFromTxt.value,
        'Subject': this.refSendEmailForm.subjectTxt.value,
        'Body': this.refSendEmailForm.bodyTxt.value
      }
      let FilePath = this.selectedFileKeys[0].UploadedPage + "\\" + this.selectedFileKeys[0].Files;
      let docId = this.selectedFileKeys[0].docId;
      this.fileManagerService.facilitySendEmail(JSON.stringify(JSON.stringify(body)), FilePath, docId, Number(this.facilityId),this.from).subscribe((res) => {
        if (res.responseCode == 200) {
          this.submittedSendEmail = false; this.modelValue = "modal";
          this.successNotification(res);
          this.folderFileTree();
          this.sendEmailForm.reset();
        }
      }, (err) => {
        this.errorNotification(err);

      });

    } else {
      this.submittedSendEmail = false;
      this.sendEmailForm.reset();
    }
  }
  deleteOrCancelItem(isItemDelete: boolean) {
    let folderName = this.selectedTreeItem.folderPath.toLowerCase();
    if (isItemDelete) {
      if (this.folderFileDelete == "file") {
        this.fileManagerService.deleteFacilityFiles(JSON.stringify(JSON.stringify(this.selectedFileKeys)),this.from).subscribe((res) => {
          if (res.response == true) {
            this.getAllFIles();
            this.successNotification(res);
            this.setFileManagerRowColor();
          }
          else {
            //this.unSuccessNotification(res);
          }
        }, (err) => {
          this.errorNotification(err);
        });
      } else if (this.folderFileDelete == "folder") {
        this.isnewFolderDisabled = false; this.isUploadDisabled = false; this.isDeleteDisabled = false; this.newFolderContext = false;
        if (folderName != this.MainFolderName) {
          this.fileManagerService.facilityDeleteFolder(this.selectedTreeItem.folderPath).subscribe((res) => {
            if (res.responseCode == 200) {
              this.submitted = false; this.modelValue = "modal";
              this.successNotification(res);
              if (this.parentDir) {
                this.selectedTreeItem = this.parentDir.node.parent.itemData;
                this.isnewFolderDisabled = false; this.isUploadDisabled = false; this.isDeleteDisabled = false; this.newFolderContext = false;
                if (this.selectedTreeItem.folderName.toLowerCase() == this.MainFolderName) {
                  this.isnewFolderDisabled = true; this.isUploadDisabled = true; this.isDeleteDisabled = true; this.newFolderContext = true;
                } else {
                  if (this.selectedFileKeys.length > 0) {
                    this.isDeleteDisabled = false;
                  } else {
                    this.isDeleteDisabled = true;
                  }
                }

              }
              this.folderFileTree();
            } else {
              this.errorNotification(res);
            }
          }, (err: any) => {
            this.errorNotification(err);
          })
        }
      }
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
      let updatedFolderName = this.refrenameForm.renameTxt.value.trim();
      if (this.currentFileRename) {
        this.fileManagerService.facilityRenameFile(JSON.stringify(JSON.stringify(this.selectedFileKeys)), updatedFolderName,this.from).subscribe((res) => {
          if (res.responseCode == 200) {
            this.submitted = false; this.modelValue = "modal";
            this.successNotification(res);
            this.folderFileTree();
          }
        }, (err) => {
          this.errorNotification(err);
        });
      } else {
        if (this.selectedTreeItem) {
          var oldPath = this.selectedTreeItem.folderPath;
          var newPath = this.parentDir.node.parent.itemData.folderPath + '\\' + updatedFolderName;
          if (this.parentDir.node.parent.items.length > 0) {
            if ((this.parentDir.node.parent.items.filter(val => val.text.toLowerCase().trim() == updatedFolderName.toLowerCase())).length > 0) {
              this.CodeErrorNotification('Folder name already exists');
            } else {
              this.fileManagerService.facilityRenameFolder(oldPath, newPath).subscribe((res) => {
                if (res.responseCode == 200) {
                  this.submitted = false; this.modelValue = "modal";
                  this.successNotification(res);
                  this.folderFileTree();
                }
              }, (err: any) => {
                this.errorNotification(err);
              })
            }
          }
        }
      }


    }
    else {
      // this.currentRenameItemRecord = null;
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
    this.getDisabled = false;
    this.isnewFolderDisabled = false; this.isUploadDisabled = false; this.isDeleteDisabled = false; this.newFolderContext = false;
    if (folderName == this.MainFolderName.toLowerCase()) {
      this.isnewFolderDisabled = true; this.isUploadDisabled = true; this.isDeleteDisabled = true; this.newFolderContext = true;
    }
    //  else {
    //   if (this.selectedFileKeys.length > 0) {
    //     this.isDeleteDisabled = false;
    //   } else {
    //     this.isDeleteDisabled = true;
    //   }
    // }

    this.getAllFIles();
  }
  folderFileTree() {
    this.fileManagerService.getFacilityFolderHierarchy(this.facilityName, this.facilityId,this.from).subscribe((res) => {
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

          this.getAllFIles();

        }, 500);
      }
    });
  }
  getAllFIles() {
    this.allFile = [];
    this.fileManager.instance.refresh();
    this.UploadedPage = this.selectedTreeItem.folderPath;
   // if (!this.UploadedPage) {
      this.UploadedPage = this.MainFolderName;
   // }
    this.fileManagerService.getAllFacilityFiles(this.storageService.user.UserId, this.UploadedPage, this.from, this.facilityName, this.facilityId).subscribe((res) => {
      if (res != null) {
        this.allFile = res.response;
        setTimeout(() => {
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-toolbar'), 'display', 'none');
          this.renderer.setStyle(this.elRef.nativeElement.querySelector('.dx-filemanager-breadcrumbs'), 'display', 'none');


        }, 25);
      }
      else {
        this.allFile = [];
        //this.unSuccessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }
  onContentReady(e) {
    console.log("in con");
  }

  okCreateNewFolder(isItemNewFolder: boolean) {
    let folderName = this.selectedTreeItem.folderPath.toLowerCase();
    this.submitted = true;
    this.modelValue = "modal";
    if (this.newFolderForm.invalid) {
      this.modelValue = "";
      return;
    }
    if (isItemNewFolder) {
      let updatedNewFolderName = this.refnewFolderForm.newFolderTxt.value.trim()
      let checkFolder = true;
      if (this.selectedTreeItem) {
        var newFolderPath = this.selectedTreeItem.folderPath + '\\' + updatedNewFolderName;
        if (this.selectedTreeItem.items.length > 0) {
          let child = this.selectedTreeItem.items;
          if ((child.filter(val => val.folderName.toLowerCase().trim() == updatedNewFolderName.toLowerCase())).length > 0) {
            this.CodeErrorNotification('Folder name already exists'); checkFolder = false;
          }
        }
        if (checkFolder) { this.folderAPI(newFolderPath); }
      }
    }
  }

  folderAPI(newFolderPath: any) {
    this.fileManagerService.createNewFolder(newFolderPath).subscribe((res) => {
      if (res.responseCode == 200) {
        this.submitted = false; this.modelValue = "modal";
        this.successNotification(res);
        this.folderFileTree();
      }
    }, (err: any) => {
      this.errorNotification(err);
    })
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




  get refnewFolderForm() { return this.newFolderForm.controls; }
  get refrenameForm() { return this.renameForm.controls; }
  get refSendFaxForm() { return this.sendFaxForm.controls; }
  get refSendEmailForm() { return this.sendEmailForm.controls; }

}
