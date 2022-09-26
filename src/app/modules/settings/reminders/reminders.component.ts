import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { SettingsService } from 'src/app/services/settings.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-reminders',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css']
})
export class RemindersComponent implements OnInit {
  totalRecords: number = 0;
  responseModel: any;
  reminderForm: FormGroup;
  IsSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private readonly _settingsService: SettingsService,
    private readonly notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private readonly commonMethodService : CommonMethodService
  ) {
  }

  ngOnInit(): void {
    this.reminderForm = this.fb.group({
      RemindReadingAfter: ['', [Validators.required]],
      RemindIfNotSignedEvery: ['', [Validators.required]],
      ReminderId: [0]
    });
    this.getReminders();
    this.commonMethodService.setTitle('Reminders');
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }
  getReminders() {
    this._settingsService.getAllReminders('{}').subscribe((res) => {
      if (res.response != null) {
        let result: any = res && res.response ? res.response : [];
        this.responseModel = JSON.parse(result)[0];
        this.reminderForm.patchValue({
          RemindReadingAfter: this.responseModel.RemindReadingAfter,
          RemindIfNotSignedEvery: this.responseModel.RemindIfNotSignedEvery,
          ReminderId: this.responseModel.ReminderId
        })
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  unSuccessNotification(res: any) {

    this.notificationService.showNotification({
      alertHeader: 'No record found.',
      alertMessage: res.message,
      alertType: res.responseCode
    });
  }
  successNotification(res: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
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
  get getFromControls() { return this.reminderForm.controls; }


  onSubmit() {

    this.IsSubmitted = true;
    if (this.reminderForm.invalid) {
      return;
    }
    this._settingsService.addUpdateRemiders(true, JSON.stringify(JSON.stringify(this.reminderForm.value))).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.showNotificationOnSucess(data);
      }
      else {
        this.showNotification(data);
      }

    }, (err: any) => {
      this.showError(err);
    }
    );

  }
  // common Notification Method
  showNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Record Not Found',
      alertMessage: JSON.parse(data.response)[0].response,
      alertType: data.responseCode
    });
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: JSON.parse(data.response)[0].response,
      alertType: data.responseCode
    });
  }
  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
}
