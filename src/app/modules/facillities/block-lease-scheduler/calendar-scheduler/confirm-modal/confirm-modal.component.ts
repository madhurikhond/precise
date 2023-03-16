import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import { NotificationService } from 'src/app/services/common/notification.service';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Input() LeaseBlockId: any;
  @Input() RecurEventId: any;
  ModalResult = ModalResult;
  constructor(public modal: NgbActiveModal,
    private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
  }
  close() {
    this.modal.dismiss(ModalResult.CLOSE);
  }

  cancel() {
    this.modal.dismiss(ModalResult.CANCEL);
  }

  delete() {
    if (this.LeaseBlockId >0 || this.RecurEventId > 0) {
      this.blockLeaseSchedulerService.deleteBlockLeaseById(true, this.LeaseBlockId, this.RecurEventId).subscribe((res) => {
        if (res.responseCode == 200) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.response.Message,
            alertType: res.responseCode
          });
          this.modal.dismiss(ModalResult.DELETE);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });

    }
    this.modal.dismiss(ModalResult.DELETE);
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
}
export enum ModalResult {
  BACKDROP_CLICK = 0,
  ESC = 1,
  CLOSE = 3,
  CANCEL = 4,
  SAVE = 5,
  DELETE = 6
}
