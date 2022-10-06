import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AccountService } from './services/account.service';
import { CommonMethodService } from './services/common/common-method.service';
import { NotificationService } from './services/common/notification.service';
import { SignalRService } from './services/common/signalr.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [NotificationService]
})
export class AppComponent implements OnInit {
  isValidToken: boolean = false;
  title = 'MyApp';
  isDocManagerShow: boolean = false;

  constructor(private readonly commonService: CommonMethodService,
    private notificationService: NotificationService,
    private readonly _accountService: AccountService,
    private signalRService: SignalRService) {

  }
  ngOnInit(): void {
    this.isValidToken = this._accountService.isTokenValid;
    this._accountService.$validToken.subscribe(res => {
      this.isValidToken = this._accountService.isTokenValid;
    });
  }
}