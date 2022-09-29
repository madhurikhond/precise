import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
declare const $: any
@Component({
  selector: 'app-call-patient-schedule',
  templateUrl: './call-patient-schedule.component.html',
  styleUrls: ['./call-patient-schedule.component.css']
})
export class CallPatientScheduleComponent implements OnInit {
  @ViewChild('Reschedule_popup') modal_Reschedule_popup: any;
  basicData: boolean = false;
  script: string;
  totalStudies: string;
  patientCount: string;
  searchForm: FormGroup;
  pageNumber: number = 1;
  pageSize: number;
  totalRecords: number;
  dataList: any = [];
  selectedRows: any = [];
  RescheduleNoteForm: FormGroup;
  modelValue: string = 'modal';

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  readonly pageSizeArray = PageSizeArray;
  constructor(private readonly fb: FormBuilder, private readonly notificationService: NotificationService,
    private readonly commonMethodService: CommonMethodService, private facilityService: FacilityService,
    private readonly workflowService: WorkflowService) { }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Call Patient Confirmation');
    this.getCallPatientConfirmationCount();
    this.searchForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      patientId: ['']
    });
    this.RescheduleNoteForm = this.fb.group({
      RescheduleNote: ['', Validators.required]
    });
    this.onSearchSubmit();

  }


  getCallPatientConfirmationCount() {
    this.workflowService.getCallPatientConfirmationCount(false).subscribe((res) => {
      var data: any = res;
      console.log(res);
      if (data.response != null) {
        this.totalStudies = data.response.studycount;
        this.patientCount = data.response.patientcount;
        this.script = data.response.script;
        this.basicData = true;
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
  saveCallPatientConfirmationLog(type) {
    if (!this.selectedRows || this.selectedRows.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select al least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      if (type != 'reschedule') {
        this.saveCallPatientConfirmationMethod(type, '');
      } else {
        this.modal_Reschedule_popup.nativeElement.click();
        this.addForm.RescheduleNote.setValue('');
      }
    }
  }


  saveCallPatientConfirmationMethod(type: string, Note: string) {
    const internalStudies = this.dataList.filter(name => this.selectedRows.includes(name.myId)).map(x => x.internalstudyid).toString()
    let body = {
      Type: type,
      InternalStudyId: internalStudies,
      Note: Note
    }

    this.workflowService.saveCallPatientConfirmationLog(JSON.stringify(JSON.stringify(body)), true).subscribe((res) => {
      if (res.responseCode == 200) {
        this.onSearchSubmit()
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        });
        this.selectedRows = null;
      }
      else {
        this.notificationService.showNotification({
          alertHeader: 'Error',
          alertMessage: res.message,
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

  RescheduleSelectedStudies(type: any) {
    this.modelValue = 'modal';
    this.saveCallPatientConfirmationMethod(type, this.addForm.RescheduleNote.value);
  }

  onReset() {
    this.searchForm.reset();
    this.onSearchSubmit()

  }

  onSearchSubmit() {
    this.selectedRows = null;
    this.workflowService.getCallPatientConfirmation(true, this.sForm.patientId.value ? this.sForm.patientId.value : '',
      this.sForm.lastName.value ? this.sForm.lastName.value : '', this.sForm.firstName.value ? this.sForm.firstName.value : '',
      this.pageNumber, this.pageSize).subscribe((res) => {
        var data: any = res;
        this.totalRecords = res.totalRecords
        this.dataList = data.response;
        if (this.dataList != null) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
            // if (element.Facilitydetail)
            //   var address = element.Facilitydetail.trim();
            // if (address)
            //   var stateZip = address.split(',')[1].trim();
            // if (stateZip) {
            //   var state = stateZip.split(' ')[0];
            //   var zip = stateZip.split(' ')[1];
            // }
            // if (address) {
            //   element.Address = address.split(' ')[5] + '/' + state + '/' + zip;
            // element.Address = address.split(',')[0] + '/' + state + '/' + zip;
            // element.Address = address;
            // if (state) {
            //   element.Address = element.Address + '/' + state;
            // }
            // if (zip) {
            //   element.Address = element.Address + '/' + zip;
            // }
          }
            // }
          );
        }
        else {
          this.totalRecords = 1;
          this.dataList = [];
        }
        setTimeout(() => {
          $('.dx-state-invisible').remove()
        }, 100);
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.onSearchSubmit()
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.onSearchSubmit()
  }
  get sForm() { return this.searchForm.controls; }
  get addForm() { return this.RescheduleNoteForm.controls; }
  senddatatoschd_facilities(row: any) {
    if (row) {
      let body = row;
      this.facilityService.sendDataToschdFacilitiesWin(body);
    }
  }
}
