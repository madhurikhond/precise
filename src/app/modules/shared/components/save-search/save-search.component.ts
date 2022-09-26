import { ConstantPool } from '@angular/compiler';
import { AfterContentInit, AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Console } from 'console';
import { DxDataGridComponent } from 'devextreme-angular';
import { AnyARecord } from 'dns';
import { Subscription } from 'rxjs';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';

@Component({
  selector: 'app-save-search',
  templateUrl: './save-search.component.html',
  styleUrls: ['./save-search.component.css']
})
export class SaveSearchComponent implements OnInit, OnDestroy {
  childSavedSearchBody: any;
  savedSearchNgModel: string = '';
  // workList:Array<Object>=[];
  workList: any = [];
  paginationRecords: any = [];
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number = 20;
  subscription: Subscription;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  @Output() close: EventEmitter<any> = new EventEmitter();
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  constructor(private readonly _commonMethodService: CommonMethodService, private readonly _notificationService: NotificationService) {
    //this.getAllSavedSearchList();
  }

  ngOnInit(): void {
    this.subscription = this._commonMethodService.savedSearchMessage.subscribe((parentSavedSearchBody) => {
      this.childSavedSearchBody = parentSavedSearchBody;
      this.getAllSavedSearchList();
    }, (err => {
      this.errorNotification(err);
    }));
  }

  UpdateSaveSearch() {
    this.close.emit(null);
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.paginationRecords = this.workList.slice(this.pageSize * (this.pageNumber - 1), this.pageSize * (this.pageNumber));

  }

  savedSearch() {
    if (this.savedSearchNgModel.trim() != '') {
    
      this.childSavedSearchBody.searchName = this.savedSearchNgModel;
      if (this.childSavedSearchBody.PageSettings) {
        this._commonMethodService.savedSearch(true, this.childSavedSearchBody).subscribe((res) => {
          if (res.response != null) {
            this.workList.push(res.response);
            this.paginationRecords = this.workList.slice(this.pageSize * (this.pageNumber - 1), this.pageSize * (this.pageNumber));
            this.totalRecords = this.workList.length;
            this.sucessNotification(res)
          }
          else {
            this.unSucessNotification(res);
          }
        }, (err => {
          this.errorNotification(err);
        }));
      } else {
        this._notificationService.showNotification({
          alertHeader: 'Fail',
          alertMessage: 'Please select at least one filter',
          alertType: 400
        });
      }
      this.savedSearchNgModel = '';
    }
  }

  getAllSavedSearchList() {
    this._commonMethodService.getSavedSearchList(true, this.childSavedSearchBody.userId, this.childSavedSearchBody.pageName).subscribe((res) => {
    
      if (res.response != null) {
        this.workList = res.response;
        this.totalRecords = this.workList.length;
        this.paginationRecords = this.workList.slice(this.pageSize * (this.pageNumber - 1), this.pageSize * (this.pageNumber));
      }
      else {
        this.paginationRecords = [];
      }
    }, (err) => {
      this.errorNotification(err);
    });
  }

  deleteItem(id: any) {
    this._commonMethodService.deleteSavedSearch(true, id).subscribe((res) => {
     
      if (res.responseCode === 200) {
        if ((this.totalRecords - 1) % this.pageSize !== 0) {

          this.getAllSavedSearchList();
        }
        else {
        
            this.pageNumber = this.pageNumber > 1 ? this.pageNumber - 1 : 1;
            this.getAllSavedSearchList();
          

        }
        this.sucessNotification(res);
      }
      else {
        this.unSucessNotification(res);
      }
    }, (err) => {
      this.errorNotification(err);
    });

  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  errorNotification(err: any) {
    this._notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  sucessNotification(data: any) {
    this._notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  unSucessNotification(data: any) {
    this._notificationService.showNotification({
      alertHeader: 'Fail',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
}

