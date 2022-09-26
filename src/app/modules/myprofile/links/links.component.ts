import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { MyprofileService } from 'src/app/services/myprofile/myprofile.service';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.css']
})
export class LinksComponent implements OnInit {

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any;
  currentFilter: any;
  showHeaderFilter: boolean;
  pageNumber: number = 1;
  pageSize: number = 15;
  totalRecords: number;
  linksList: any = [];
  search: string = '';

  constructor(private readonly myprofileService: MyprofileService,
    private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Links');
    this.applyFilterTypes = [{
      key: 'auto',
      name: 'Immediately'
    }, {
      key: 'onClick',
      name: 'On Button Click'
    }];
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;
    this.getAllLinks();
  }
  applyFilter() {
    this.pageNumber = 1
    this.getAllLinks();
  }
  getAllLinks() {
    this.myprofileService.getAllLinksNew(true, this.pageNumber, this.pageSize, this.search).subscribe((res) => {
      if (res.response != null && res.response.length > 0) {
        this.linksList = res.response;
        this.totalRecords = res.totalRecords;
      }
      else {
        this.totalRecords = 1
        this.linksList = [];
        //this.unSuccessNotification(res,'Record not found.')
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  unSuccessNotification(res: any, msg: any) {

    this.notificationService.showNotification({
      alertHeader: msg,
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  pageChanged(event) {
    this.pageNumber = event;
    this.getAllLinks();
  }
  clearFilters() {
    this.pageNumber = 1
    this.search = ''
    this.getAllLinks();
  }
}
