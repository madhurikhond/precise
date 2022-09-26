import { core } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { AccountService } from 'src/app/services/account.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styles: [
  ]
})
export class CoreComponent implements OnInit {
  isOpened = true;
  ReleaseVersionDetails: any;
  ReleaseDate: any;
  ReleaseItems: any;
  Release: any;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private common: CommonMethodService,
    private storageService: StorageService,
    private AccountService: AccountService,
    private notificationService: NotificationService) {
    if (this.storageService.getItem('isSideNavOpned')) {
      this.isOpened = this.storageService.getItem('isSideNavOpned');
    }
  }

  ngOnInit(): void {
    this.common.isSidenavOpened.subscribe((value: any) => {
      if (value) {
        this.isOpened = !this.isOpened;
        this.storageService.setItem('isSideNavOpned', this.isOpened);
      }
    })
    this.GetVersionDetail();
  }
  GetVersionDetail() {
    this.AccountService.GetVersionDetail().subscribe((res) => {
      if (res.response != null) {
        this.Release = res.response.Release + ' '
        this.ReleaseDate = res.response.ReleaseDate
        this.ReleaseItems = res.response.ReleaseItems
      }
    });
  }
}

