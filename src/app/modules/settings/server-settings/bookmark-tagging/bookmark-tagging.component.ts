import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-bookmark-tagging',
  templateUrl: './bookmark-tagging.component.html',
  styleUrls: ['./bookmark-tagging.component.css']
})
export class BookmarkTaggingComponent implements OnInit {
  showDropdownLoader = true;
  showFieldList = false;
  tableList: any = [];
  bookmarkFieldList: any = [];
  selectedTableId: any = [];

  constructor(
    private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService,
    private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Bookmark Tagging');
    this.getAllDatabaseTables();
  }

  getAllDatabaseTables() {
    this.settingsService.getAllDatabaseTables(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.tableList = data.response;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
      this.showDropdownLoader = false;
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
        this.showDropdownLoader = false;
      });
  }

  changeTable(event) {
    if (event != null) {
      this.settingsService.getBookMarkFields(true, event.TableName).subscribe((res) => {
        var data: any = res;
        if (data.response != null && data.response.length > 0) {
          this.bookmarkFieldList = data.response;
          this.showFieldList = true;
        }
        else {
          this.notificationService.showNotification({
            alertHeader: data.statusText,
            alertMessage: data.message,
            alertType: data.responseCode
          });
        }
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
          this.showFieldList = false;
        });
    }
    else {
      this.showFieldList = false;
      this.bookmarkFieldList = null;
    }
  }

  saveBookmarkFields() {
    this.settingsService.saveBookmarkFields(true, this.bookmarkFieldList).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.bookmarkFieldList = data.response;
        this.showFieldList = true;
        this.notificationService.showNotification({
          alertHeader: (res.responseCode === ResponseStatusCode.OK) ? 'Success' : 'Error',
          alertMessage: res.message,
          alertType: res.responseCode
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
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
}
