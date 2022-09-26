import { Component, OnInit } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-use-bookmark',
  templateUrl: './use-bookmark.component.html',
  styleUrls: ['./use-bookmark.component.css']
})
export class UseBookmarkComponent implements OnInit {
  bookmarkList: any = [];
  searchKeyword: any = '';
  
  constructor(private _clipboardService: ClipboardService, private readonly commonMethodService: CommonMethodService,
    private readonly settingsService: SettingsService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Use Bookmark');
    this.getBookmarkFields_UseBookmark();

    this._clipboardService.copyResponse$.subscribe(re => {
      if (re.isSuccess) {
        this.notificationService.showToaster({
          alertHeader: null,
          alertMessage: re.content,
          alertType: null
        });
      }
    });
  }

  getBookmarkFields_UseBookmark() {
    this.settingsService.getBookmarkFields_UseBookmark(true).subscribe((res) => {
      var data: any = res;
      if (data.response != null && data.response.length > 0) {
        this.bookmarkList = data.response;
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

  copyToClipboard(text: string){
    this._clipboardService.copy(`{{${text}}}`)
  }
}
