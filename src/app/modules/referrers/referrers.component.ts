import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReferrerProcGroup } from 'src/app/models/ReferrerProcGroup';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { ReferrersService } from 'src/app/services/referrers.service';
import { saveAs } from 'file-saver';
import { DxDataGridComponent } from 'devextreme-angular';
import { PatientService } from 'src/app/services/patient/patient.service';
import { debug } from 'console';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';

@Component({
  selector: 'app-referrers',
  templateUrl: './referrers.component.html',
  styleUrls: ['./referrers.component.css']
})
export class ReferrersComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;
  @ViewChild('content') testidRef: any;
  referrersForm: FormGroup;
  referrerList: any = [];
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  totalRecords: number=1;
  pageNumber: number = 1;
  pageSize: number;
  id: number;
  title: any;
  searchText: any = '';
  exiledOption: any;
  isSearchReferrer: boolean = false;
  isShowColumnWithNoData = false;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray=PageSizeArray;

  constructor(private fb: FormBuilder, private referrersService: ReferrersService, private notificationService: NotificationService,
    private commonMethodService: CommonMethodService, private readonly storageService: StorageService) {
  }
  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.setGridSetting();
    this.commonMethodService.setTitle('Referrers');
    this.referrersForm = this.fb.group({
      searchText: [''],
      //exiled:[''],
      exiledOption: ['']
    });
    this.getAllReferrers();
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.searchReferrer();
  }
  setGridSetting() {
    this.allMode = 'page';
    this.checkBoxesMode = 'always'
    this.showFilterRow = true;
    this.showHeaderFilter = false;
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.currentFilter = this.applyFilterTypes[0].key;
    debugger
    this.referrersService.getPersistentGridSetting(true, this.storageService.user.UserId, 'Referrers').subscribe((res) => {
      if (res.response != null) {
        debugger;
        let state = JSON.parse(res.response.GridSettings);
        this.dataGrid.instance.state(state);
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
  searchReferrers() {
    this.pageNumber = 1;
    this.pageSize = 50;
    this.isSearchReferrer = true;

    this.searchText = this.refForm.searchText.value;
    this.exiledOption = this.refForm.exiledOption.value;
    if (this.refForm.searchText.value == '' && this.refForm.exiledOption.value == '') {
      return;
    }
    if (this.searchText === null) {
      this.searchText = ''
    }
    if (this.exiledOption === null) {
      this.exiledOption = ''
    }
    if (this.exiledOption === 'true') {
      this.exiledOption = true
    }
    if (this.exiledOption === 'false') {
      this.exiledOption = false
    }
    this.searchReferrer();
  }

  searchReferrer() {
    this.referrersService.getReferrersSearch(true, this.searchText, this.exiledOption, this.pageNumber, this.pageSize).subscribe((res) => {
      if (res.response != null && res.response.length > 0) {
        this.referrerList = res.response;
        this.isShowColumnWithNoData = true;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.isShowColumnWithNoData = false;
        this.referrerList = [];
        this.totalRecords = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  saveGridSetting() {

    let state = this.dataGrid.instance.state();
    // Saves the state in the local storage
    let gridSetting = JSON.stringify(state);
    let body =
    {
      'id': 0,
      'userId': this.storageService.user.UserId,
      'pageName': 'Referrers',
      'gridSettings': gridSetting
    }

    this.referrersService.updatePersistentGridSetting(true, body).subscribe((res) => {
      if (res.response != null) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: 'Grid setting saved successfully.',
          alertType: res.responseCode
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

  goButtonClick(DropDownObject: HTMLInputElement) {
    debugger;
    if (DropDownObject.value == 'Save Grid') {
      this.saveGridSetting();
    }
  }

  clearReferrers() {
    this.pageNumber = 1;
    this.pageSize = 50;
    this.isSearchReferrer = false;

    if (this.refForm.searchText.value == '' && this.refForm.exiledOption.value == '') {
      return;
    }
    this.searchText = ''
    this.exiledOption = ''
    this.refForm.searchText.setValue('')
    this.refForm.exiledOption.setValue('')
    this.getAllReferrers()
  }

  getAllReferrers() {
    this.referrersService.getAllReferrers(true, this.pageNumber, this.pageSize).subscribe((res) => {

      if (res.response != null && res.response.length > 0) {
        this.referrerList = res.response;
        this.isShowColumnWithNoData = true;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.isShowColumnWithNoData = false;
        this.referrerList = [];
        this.totalRecords = 1;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
    this.clearRecords()
  }
  getCurrentReferrerDetail(currentRow: any) {
    this.title = currentRow.row.data.FullName;
    this.id = currentRow.row.data.ReferrerID;
    let body = { 'title': this.title, 'referrerId': this.id };
    this.referrersService.sendDataToReferrerDetailWindow(body);
    //this.getreferrerById()
  }

  clearRecords() {
    this.referrersForm.reset()
    this.searchText = ''
    this.exiledOption = ''
    this.refForm.searchText.setValue('')
    this.refForm.exiledOption.setValue('')
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  get refForm() { return this.referrersForm.controls; }

  exportReferrerExcel() {
    debugger
    this.referrersService.exportReferrerExcel(this.pageNumber, this.pageSize, this.isSearchReferrer, this.searchText, this.exiledOption).subscribe(blob => {
      saveAs(blob, 'Referrer.xlsx');
    }, error => {
      console.log('Something went wrong');
    });
  }
  pageChanged(event) {
    this.pageNumber = event;
    if (this.isSearchReferrer) {
      this.searchReferrer();
    }
    else {
      this.getAllReferrers();
    }
  }
}
