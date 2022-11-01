import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { TaskManagementApplyFilter, TaskManagementArray } from 'src/app/models/taskManagementSlackGlobalSettings';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { PatientService } from 'src/app/services/patient/patient.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';
import { ViewChild, ElementRef } from '@angular/core';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css'],
})
export class TaskManagementComponent implements OnInit {
  @ViewChild('modalClose', { static: false }) modalClose: ElementRef;
  check: boolean = false;
  labelNameList: Array<string> = [];
  epicUserList: Array<object> = [];
  isTaskManagementPopShow: boolean = false;
  submitted: boolean = false;
  isPatientValid: boolean = true;
  addTaskForm: FormGroup;
  statusDefaultRadioButtonValue: string = 'ToDo';
  assignedByDefaultRadioButtonValue: string = 'All';
  assignedToDefaultRadioButtonValue: string = 'All';
  dueDateDefaultRadioButtonValue: string = 'All';
  applyFilterBody: TaskManagementApplyFilter;
  allTaskArray: Array<object> = [];
  allTaskCopyArray: Array<object> = [];
  assignedByFilter: string = 'All';
  assignedToFilter: string = 'All';
  DueDateFilter: string = 'All';
  LabelFilter: string = '';
  stausFilter: string = '';
  toDoTask: number = 0;
  outercounter: number = 0;
  toDoTaskGlobal: number = 0;
  totalDoTasks: number = 0;
  modalValue: string = 'modal';
  taskDetail: any = <any>{};
  taskAssignToOtherUserModel: any = null;
  currentTaskId: any = null;
  filterSearchModel: any = null;
  filterSearch:any;
  divPateintId: any = 'testxxxx';
  searchText: string;
  userType: number;
  labelValue: any;
  SavedSearchFilter:any;

  readonly dateTimeFormatCustom = DateTimeFormatCustom;

  constructor(private readonly commonMethodService: CommonMethodService, private fb: FormBuilder,
    private readonly taskManagementService: TaskManagementService, private readonly facilityService: FacilityService,
    private readonly notificationService: NotificationService, private readonly storageService: StorageService,
    private patientService: PatientService
  ) {
    this.isTaskManagementPopShow = false;
  }

  ngOnInit(): void {
    this.taskAssignToOtherUserModel = this.storageService.user.UserId;

    this.commonMethodService.showTaskManagementWindowEmitter.subscribe((res: boolean) => {
      this.isTaskManagementPopShow = res;
        if (res == true) {
          this.createAddTaskForm();
          //this.setPageTitle();
          this.getLabelName();
          this.getEpicUser();

          let lastSearchBody = {
            'searchText': '',
            'isActive': 0,
            'tabName': 'task management',
            'userId': this.storageService.user.UserId,
            'clear': 2
          }
          this.getFacilityLastFilterRecord(lastSearchBody, true);
          this.GetToDoRecords();
        }
      });
  }
  getFacilityLastFilterRecord(body: any, isLoadGrid = false) {
    this.facilityService.getFacilitySearchData(true, body).subscribe((res) => {

      if (res.response != null) {
        this.searchText = res.response[0].searchText;
        this.userType = res.response[0].isActive;
        this.applyFilterBody = JSON.parse(this.searchText);
        this.assignedByFilter = this.applyFilterBody.assignedBy;
        this.assignedToFilter = this.applyFilterBody.assignedTo;
        this.DueDateFilter = this.applyFilterBody.dueDate;
        this.LabelFilter = this.applyFilterBody.label;
        this.SavedSearchFilter=this.applyFilterBody.savedSearch;
        this.stausFilter = this.applyFilterBody.status;
        this.assignedByDefaultRadioButtonValue = this.assignedByFilter;
        this.assignedToDefaultRadioButtonValue = this.assignedToFilter;
        this.dueDateDefaultRadioButtonValue = this.DueDateFilter;
        this.labelValue = this.LabelFilter === "" ? 'All' : this.LabelFilter;
        this.filterSearch=this.SavedSearchFilter;
        this.statusDefaultRadioButtonValue = this.stausFilter === "" ? 'ToDo' : this.stausFilter;

      }
      else {
        this.searchText = '';
        this.userType = 1;
        this.facilityService.updateSearchText(this.searchText);
        this.facilityService.updateDropDown(this.userType);
        //this.getSchedulingFacilities();
      }
      if (isLoadGrid) {
        this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter, this.stausFilter, true, false);

      }

    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  //  , isSendSearchData: boolean = true
  GetToDoRecords() {
    this.applyFilterBody = new TaskManagementApplyFilter('', '', '', '', '', 'ToDo', this.storageService.user.UserId);
    this.taskManagementService.taskManagementApplyFilter(true, this.applyFilterBody).subscribe((res) => {
      this.commonMethodService.toDoTaskCountForHeader.emit(res.toDoRecords);
    })
  }
  applyFilter(assignedBy: string, assignedTo: string, dueDate: string, label: string, savedSearch:string,status: string, isOnLoad: boolean, isUpdateSearch = true) {


    this.applyFilterBody = new TaskManagementApplyFilter(assignedBy, assignedTo, dueDate, label, savedSearch, status, this.storageService.user.UserId);
    this.allTaskArray = [];
    // console.log(this.assignedByDefaultRadioButtonValue)
    this.taskManagementService.taskManagementApplyFilter(true, this.applyFilterBody).subscribe((res) => {
      if (isUpdateSearch) {
        let lastSearchBody = {
          'searchText': JSON.stringify(this.applyFilterBody),
          'isActive': 1,
          'tabName': 'task management',
          'userId': this.storageService.user.UserId,
          'clear': 0
        }
        this.getFacilityLastFilterRecord(lastSearchBody);
      }

      if (res.toDoRecords > 0) {
        this.toDoTask = res.toDoRecords;
        this.toDoTaskGlobal = this.toDoTask;
        this.totalDoTasks = this.outercounter;
        // if (this.check==true) {
        //   this.commonMethodService.toDoTaskCountForHeader.emit(this.totalDoTasks);
        // };
      }
      else {
        this.toDoTask = 0;
        this.toDoTaskGlobal = this.toDoTask;
        this.totalDoTasks = res.totalRecords;
      }
      if (res.response != null && res.response?.length > 0) {
        this.allTaskArray = res.response;
        this.allTaskCopyArray = res.response;
        this.searchData(this.filterSearch);
      }
      else {
        this.allTaskArray = [];
        this.allTaskCopyArray = [];
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  getEpicUser() {
    this.taskManagementService.getEpicUser(false, this.storageService.user.UserId).subscribe((res) => {
      if (res.response != null) {
        this.epicUserList = res.response;
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  createAddTaskForm() {
    this.addTaskForm = this.fb.group({
      taskAssignTo: [null, Validators.required],
      patientId: [null],
      dueDate: [null, Validators.required],
      tag: [null, Validators.required],
      taskTitle: [null, Validators.required],
      taskSpecifics: [null, Validators.required],
    });
  }
  setPageTitle() {
    this.commonMethodService.setTitle('Task Management');
  }
  getLabelName() {
    this.taskManagementService.getTaskManagementSettingForLabelTab(false).subscribe((res) => {

      if (res.response != null) {
        this.labelNameList = res.response.filter((f) => f.IsLabelArchive == false).map((m) => m.LabelName);
      }
    });
  }
  cancelButtonClicked() {
    this.isTaskManagementPopShow = false;
    this.assignedByDefaultRadioButtonValue = this.applyFilterBody.assignedBy;
    this.assignedToDefaultRadioButtonValue = this.applyFilterBody.assignedTo;
    this.dueDateDefaultRadioButtonValue = this.applyFilterBody.dueDate;
    this.statusDefaultRadioButtonValue = this.applyFilterBody.status;
  }
  patientBoxKeyPress() {
    this.isPatientValid = true;
  }
  checkPatientExist(patientId: string) {

    if (patientId == null || patientId == '') {
      this.isPatientValid = true;
      return;
    }
    this.taskManagementService.checkValidPatient(true, patientId).subscribe((res) => {
      if (res.response != null) {
        this.isPatientValid = true;
      }
      else {
        this.isPatientValid = false;
      }
    }, (err: any) => {
      this.successNotification(err);
    });
  }
  createTask() {
    this.modalValue = 'modal';
    this.submitted = true;
    if (this.addTaskForm.invalid) {
      this.modalValue = '';
      return;
    }
    let body =
    {
      'taskAssignTo': this.addTaskFormControl['taskAssignTo'].value,
      'patientId': this.addTaskFormControl['patientId'].value,
      'dueDate': moment(this.addTaskFormControl['dueDate'].value).format('MM/DD/YYYY') ,
      'tag': this.addTaskFormControl['tag'].value,
      'taskTitle': this.addTaskFormControl['taskTitle'].value,
      'taskSpecifics': this.addTaskFormControl['taskSpecifics'].value,
      'taskAssignBy': this.storageService.user.UserId,
      'taskCreatedBy': this.storageService.user.UserId,
      'taskCreatedFromPage': 'Task Management',
      'isIconShow': this.addTaskFormControl['tag'].value == 'PYMNT STATUS' ? true : false
    }
    this.taskManagementService.createTask(true, body).subscribe((res) => {

      if (res.response != null) {

        this.successNotification(res);
        this.GetToDoRecords();
        this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.SavedSearchFilter, this.stausFilter, true);
      }
    }, (err: any) => {
      this.errorNotification(err);
    })
  }
  filterAssignBy(assignByFilterValue: string) {
    this.assignedByDefaultRadioButtonValue = assignByFilterValue;
    this.assignedByFilter = assignByFilterValue;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, false);
  }
  filterAssignTo(assignToFilterValue: string) {
    this.assignedToDefaultRadioButtonValue = assignToFilterValue;
    this.assignedToFilter = assignToFilterValue;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.SavedSearchFilter, this.stausFilter, false);
  }
  filterDueDate(dueDateFilterValue: string) {
    this.dueDateDefaultRadioButtonValue = dueDateFilterValue;
    this.DueDateFilter = dueDateFilterValue;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.SavedSearchFilter, this.stausFilter, false);
  }
  filterStatus(statusFilterValue: string) {

    this.statusDefaultRadioButtonValue = statusFilterValue;
    this.stausFilter = statusFilterValue;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.SavedSearchFilter, this.stausFilter, false);
  }
  onLabelDropDownChange(lableValue: any) {

    this.LabelFilter = lableValue;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, false);
  }
  searchData(searchText: any) {
    searchText = searchText.toLocaleLowerCase();
    if (searchText === null || searchText.trim() === '') {
      this.allTaskArray = this.allTaskCopyArray;
      this.toDoTask = this.toDoTaskGlobal;
      return;
    }
    this.allTaskArray = this.allTaskCopyArray.filter((data) => JSON.stringify(data).toLowerCase().indexOf(searchText.toLowerCase()) !== -1);


    if (this.stausFilter === 'ToDo') {
      this.toDoTask = this.allTaskArray.length;
    }
  }
  saveSearchonFocusOut(e:any)
  {
    this.SavedSearchFilter=this.filterSearch;
      this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, false);
      this.searchData(this.SavedSearchFilter);
      
  }
  searchDataChange(e)
  {
    this.SavedSearchFilter=this.filterSearch;
    this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, false);
    this.searchData(this.SavedSearchFilter);  
  }
  viewTask(taskId: any) {

    this.taskDetail = {};
    this.taskManagementService.getTaskDetailById(true, taskId, this.storageService.user.UserId.toString()).subscribe((res) => {
      if (res.response.length > 0) {
        this.taskDetail = res.response.slice(0, 1).shift();
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  addTaskButtonClick() {
    this.addTaskForm.reset();
    this.submitted = false;
  }
  showMenu(isCompleted: boolean, isArchived: boolean, index: any) {

    document.getElementById('menuArchive' + index).style.display = 'inline-block';
    document.getElementById('menuAssignToOther' + index).style.display = 'inline-block';
    document.getElementById('menuMoveToCompleted' + index).style.display = 'inline-block';
    document.getElementById('menuMoveToDo' + index).style.display = 'inline-block';
    if (this.stausFilter === 'ToDo') {
      document.getElementById('menuMoveToDo' + index).style.display = 'none';
    }
    else if (this.stausFilter === 'Complete') {
      document.getElementById('menuMoveToCompleted' + index).style.display = 'none';
      document.getElementById('menuAssignToOther' + index).style.display = 'none';
      document.getElementById('menuArchive' + index).style.display = 'none';
    }

    else if (this.stausFilter === 'Archive') {
      document.getElementById('menuArchive' + index).style.display = 'none';
      document.getElementById('menuAssignToOther' + index).style.display = 'none';
    }
    else if (this.stausFilter === 'All') {
      if (isCompleted == true) {
        document.getElementById('menuMoveToCompleted' + index).style.display = 'none';
        document.getElementById('menuAssignToOther' + index).style.display = 'none';
        document.getElementById('menuArchive' + index).style.display = 'none';
      }
      if (isArchived == true) {
        document.getElementById('menuArchive' + index).style.display = 'none';
        document.getElementById('menuAssignToOther' + index).style.display = 'none';
      }
      if (isCompleted == false && isArchived == false) {
        document.getElementById('menuMoveToDo' + index).style.display = 'none';
      }
    }
  }
  markTaskArchived(taskId: any) {
    let body = { 'taskId': taskId }
    this.taskManagementService.markTaskArchived(true, body).subscribe((res) => {

      if (res.response.length > 0) {
        this.successNotification(res);
        this.modalClose.nativeElement.click();
        this.GetToDoRecords();
        this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, true);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  markTaskCompleted(taskId: any) {
    let body = { 'taskId': taskId }
    this.taskManagementService.markTaskCompleted(true, body).subscribe((res) => {

      if (res.response.length > 0) {
        this.successNotification(res);
        this.modalClose.nativeElement.click();
        this.GetToDoRecords();
        this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, true);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }
  markTaskToDo(taskId: any) {
    let body = { 'taskId': taskId }
    this.taskManagementService.markTaskToDo(true, body).subscribe((res) => {

      if (res.response.length > 0) {
        this.successNotification(res);
        this.GetToDoRecords();
        this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter,this.SavedSearchFilter,  this.stausFilter, true);
      }
    }, (err: any) => {
      this.errorNotification(err);
    });
  }

  showDtailWindowMenu(taskStatus: string) {

    document.getElementById('menuArchive2').style.display = 'inline-block';
    document.getElementById('menuAssignToOther2').style.display = 'inline-block';
    document.getElementById('menuMoveToComplete2').style.display = 'inline-block';
    document.getElementById('menuMoveToTo-Do2').style.display = 'inline-block';
    if (taskStatus === 'To Do') {
      document.getElementById('menuMoveToTo-Do2').style.display = 'none';
    }
    else if (taskStatus === 'Completed') {
      document.getElementById('menuMoveToComplete2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
      document.getElementById('menuArchive2').style.display = 'none';
    }

    else if (taskStatus === 'Archived') {
      document.getElementById('menuArchive2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
    }
    else if (taskStatus === 'Completed and Archived') {
      document.getElementById('menuMoveToComplete2').style.display = 'none';
      document.getElementById('menuAssignToOther2').style.display = 'none';
      document.getElementById('menuArchive2').style.display = 'none';
    }
  }
  openPatientDetailWindow(patientDetail: string) {
    debugger;
    let patient = patientDetail.split(',');
    let body = {
      'internalPatientId': patient[0],
      'internalStudyId': patient[1],
      'hasAlert': patient[2] == '1' ? 1 : 0
    }
    this.patientService.sendDataToPatientDetailWindow(body);
  }
  // common Notification Method
  successNotification(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data.message,
      alertType: data.responseCode
    });
  }
  errorNotification(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }
  taskAssignToMenuClick(taskId: any) {
    this.currentTaskId = taskId;
    this.taskAssignToOtherUserModel = this.storageService.user.UserId;
    this.modalClose.nativeElement.click();

  }
  taskAssignButtonClick(taskAssignToOtherId: any) {

    if (taskAssignToOtherId != '' && taskAssignToOtherId != null) {
      let body = {
        'taskId': this.currentTaskId,
        'taskAssignedToOtherUser': taskAssignToOtherId
      };
      this.taskManagementService.taskAssignToOther(true, body).subscribe((res) => {

        if (res.response.length > 0) {
          this.successNotification(res);
          this.GetToDoRecords();
          this.applyFilter(this.assignedByFilter, this.assignedToFilter, this.DueDateFilter, this.LabelFilter, this.SavedSearchFilter, this.stausFilter, false);
        }
      }, (err: any) => {
        this.errorNotification(err);
      });
    }
  }
 
  get addTaskFormControl() { return this.addTaskForm.controls; }
}
