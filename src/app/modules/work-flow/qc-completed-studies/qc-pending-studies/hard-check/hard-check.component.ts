import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/services/common/notification.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';

@Component({
  selector: 'app-hard-check',
  templateUrl: './hard-check.component.html',
  styleUrls: ['./hard-check.component.css']
})
export class HardCheckComponent implements OnInit {
  @Input() message : any;
  @Input() filterData : any;
  @Input() condition : any;
  checkedPatientIdInternalStudyid:any=[];
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  constructor(private activeModal: NgbActiveModal, private readonly storageService: StorageService,
  private readonly patientService: PatientService, private readonly notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  close(loadApi: Boolean = false): void {
    for (let i = 0; i < this.filterData.length; i++) {
      if (this.filterData[i].HardCheck == '' && this.filterData[i].SoftCheck == '') 
      {
        this.checkedPatientIdInternalStudyid.push({
          PATIENTID: this.filterData[i].patientid,
          InternalStudyId: this.filterData[i].internalstudyid,
          Condition: this.condition,
          Userid: this.storageService.user.UserId
        });
      }
    }
    if (this.checkedPatientIdInternalStudyid.length){
      let data={
        'parameter':JSON.stringify(this.checkedPatientIdInternalStudyid)
      }
      this.patientService.getReadyToBill(true, JSON.stringify(JSON.stringify(data))).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.response[0].Result,
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
    this.activeModal.dismiss(loadApi);
  }
}
