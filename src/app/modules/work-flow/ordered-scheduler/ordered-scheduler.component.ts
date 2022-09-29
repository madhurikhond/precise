import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';
import CheckBox from 'devextreme/ui/check_box';
import { ResponseStatusCode } from 'src/app/constants/response-status-code.enum';
import { DxDataGridComponent } from 'devextreme-angular';
import { PreScreeningGeneralQuestion, PreScreeningMRIQuestion, PreScreeningCTQuestion, PreScreeningUSQuestion, GridRowState } from '../../../models/pre-screeing-question';
import { SignalRService } from 'src/app/services/common/signalr.service';
import { StorageService } from 'src/app/services/common/storage.service';
import { MessageLength } from 'src/app/models/message-length';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { BrokerService } from 'src/app/services/broker.service';
import { ReferrersService } from 'src/app/services/referrers.service';

declare const $: any;
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-ordered-scheduler',
  templateUrl: './ordered-scheduler.component.html',
  styleUrls: ['./ordered-scheduler.component.css']
})
export class OrderedSchedulerComponent implements OnInit {
  @ViewChild('confirmRowExpanded', { static: false }) confirmRowExpanded: ElementRef;
  @ViewChild('targetDataGrid') dataGrid: DxDataGridComponent;
  searchForm: FormGroup;
  smsForm: FormGroup;
  preScreeningQuestionForm: FormGroup;
  smsSubmitted = false;
  submitted = false;
  preScreeningQuestionSubmitted = false;
  totalRecords: number = 1;
  pageNumber: number = 1;
  pageSize: number;
  dataList: any = [];
  showDropdownLoader = true;
  selectedRows: any = [];
  smsModal: string = 'modal';
  preScreeningQuestionModal: string = 'modal';
  showSMSInfo = false;
  noOfSMS: number = 0;
  smsLength: number = 0;
  groupKey: any = [];
  changePatient: boolean = true;
  preScreeningQuestionData: any;
  preScreeningQuestionAnswerData: any = [];
  mrStudyDescription: any = []
  usStudyDescription: any = []
  ctStudies: any = [];
  modality: string = '';
  countData: boolean = false;
  totalOrder: number ;
  newOrder: number;
  totalVM: number;
  leftVM: number;
  totalCB: number ;
  leftCB: number ;
  ordered: number;
  totalOrdered: number ;
  noShow: string;
  totalNoShow: string;
  rescheduled: string;
  totalRescheduled: string;
  isPrescreeningQuestion: boolean = false;

  internalStudyId: string
  patientId: string


  isMR: boolean = false;
  isMRWC: boolean = false;
  isCT: boolean = false;
  isUS: boolean = false;

  financialTypeList: any = [];
  filterList: any = [];
  brokerList: any = [];

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;

  GetAllSubscription: any;
  viewerRecordsList: any;
  myViewerRecordsList: any;
  viewingData: any;
  signalRSub: any;
  pregnantMessage: string;
  isRxDocumentVerify = false;
  weightHeightMessage: string;
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray = PageSizeArray;
  expandedRow: any;
  confirmationTxt: string = ''
  rowEvent: any = ''
  phoneNumber: number;
  readonly messageLength = MessageLength;
  constructor(private fb: FormBuilder, private readonly commonMethodService: CommonMethodService,
    private readonly workflowService: WorkflowService, private readonly notificationService: NotificationService,
    private readonly signalRService: SignalRService, private _storage: StorageService,
    private readonly brokerService : BrokerService,
    private readonly referrersService :  ReferrersService) {
    this.onCellPrepared = this.onCellPrepared.bind(this);
  }

  ngOnInit(): void {
    this.pageSize = this.pageSizeArray.filter(x => x.IsSelected).length > 0 ? this.pageSizeArray.filter(x => x.IsSelected)[0].value : this.pageSizeArray[0].value;
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Ordered Scheduler');
    this.getDropdown();
    //this.getStatusCount();
    this.searchForm = this.fb.group({
      lastName: [''],
      firstName: [''],
      patientId: [''],
      financialType: [null],
      broker: [null],
      filter: [null]
    });
    this.smsForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      message: ['', [Validators.required]]
    });
    this.getOrderedSchedulerData();
    this.prescreeningFormCreate();

    if (this.signalRSub) {
      this.signalRSub.unsubscribe();
    }

    this.signalRSub = this.signalRService.information.subscribe(response => {
      if (response !== null && response.message != '2' && response.response !== null) {
        this.viewingData = response;
        this.removeIdleStudy();
      }
    });

    this.commonMethodService.viewerRecords.subscribe(res => {
      this.viewerRecordsList = res.otherViewer;
      this.myViewerRecordsList = res.myViewer;
    })

  }
  removeIdleStudy() {
    setTimeout(() => {
      if (this.myViewerRecordsList?.length > 0) {
        this.groupKey = [];
        this.groupKey[0] = this.myViewerRecordsList[0].GroupKey1;
        this.groupKey[1] = this.myViewerRecordsList[0].GroupKey2;
      }
      $('.dx-datagrid-group-opened').parents('td').next().find('.patientDetail').find('.table-sub-header .idle').each(function (e) {
        $(this).parents('.patientDetail').parents('td').prev('td').find('.dx-datagrid-group-opened').trigger('click')
      });
    }, 0);
  }
  getBrokerDetailById(brokerName: string, brokerId: any) {
    debugger
    if (brokerId) {
      let body = { 'brokerId': brokerId, 'brokerName': brokerName };
      this.brokerService.sendDataToBrokerFromOrderedSchedularComponent(body);
    }
  }
  onPageSizeChange(e) {
    this.pageSize = e;
    this.pageNumber = 1;
    this.selectedRows = [];
    this.dataGrid.instance.collapseRow(this.groupKey);
    this.groupKey = [];
    this.changePatient = true;
    this.getOrderedSchedulerData();
    this.deleteOrderedSchedulerActivity();
  }
  getReferrerDetailById(referrerName: any, referrerId: any,isPoliciesTab:any) {
    debugger
    if (referrerId) {
      let body = { 'title': referrerName, 'referrerId': referrerId, 'isPoliciesTab' : true};
      this.referrersService.sendDataToReferrerDetailWindowFromOrderedSchedular(body);
    }
  }
  prescreeningFormCreate() {
    this.preScreeningQuestionForm = null;
    this.preScreeningQuestionForm = this.fb.group({
      gender: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(20), Validators.max(999)]],
      heightFoot: ['', Validators.required],
      heightInch: ['', Validators.required],
      isStudyConfirmed: [false, Validators.requiredTrue],
      isPregnant: [''],
      pregnantTime: [''],

      //      M R I    (C O M M O N)
      isMriBefore: [''],
      isMriExperience: [''],
      mriExperienceQuestion: [''],
      isClaustrophobic: [''],
      isMedicalCondition: [''],
      medicalConditionQuestion: [''],
      isMetalWorked: [''],
      isPerformedXRAY: [''],
      isEyeInjury: [''],
      eyeInjuryQuestion: [''],
      isPhysicalLimitation: [''],
      isSelfTransferMriTable: [''],
      isMedicalDeviceOnBody: [''],
      medicalDeviceOnBodyQuestion: [''],
      isForeignMetalInjury: [''],
      foreignMetalInjuryQuestion: [''],
      isWearWig: [''],
      isRemovableMetal: [''],
      isRecentTattoo: [''],
      recentTattooQuestion: [''],
      isAnkleMonitorDevice: [''],
      isRemovableAnkleMonitorDevice: [''],
      isRemovablWhileScan: [''],
      priorSurgeryQuestion: [''],

      //    M R I   (W I T H   C O T R A S T)
      isDiabetesHistory: [''],
      isCancerHistory: [''],
      isHighBloodPressure: [''],
      isAllergyReaction: [''],
      allergyReactionQuestion: [''],
      isKidneyProblem: [''],

      //    U S 
      isAllergy: [''],
      allergyDescription: [''],

      //    C T  or  X R A Y
      isRecentXray: [''],
      xrayCTDescription: [''],
      isCancerHistoryCT: [''],
      radiationTreatment: ['']
    });

  }
  addOrderedSchedulerActivity(data: any) {
    if (this.GetAllSubscription) {
      this.GetAllSubscription.unsubscribe();
    }
    this.GetAllSubscription = this.workflowService.addOrderedSchedulerActivity(data).subscribe((res) => {
      if (res) {
        this.viewingData = res;
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

  deleteOrderedSchedulerActivity() {
    if (this.GetAllSubscription) {
      this.GetAllSubscription.unsubscribe();
    }
    this.GetAllSubscription = this.workflowService.deleteOrderedSchedulerActivity().subscribe((res) => {
      if (res) {
        this.viewingData = res;
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

  getAllOrderSchedulerActivity() {
    if (this.GetAllSubscription) {
      this.GetAllSubscription.unsubscribe();
    }
    this.GetAllSubscription = this.workflowService.getAllOrderSchedulerActivity().subscribe((res) => {
      if (res) {
        setTimeout(() => {
          this.viewingData = res;
        }, 1000);
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

  onRowPrepared(e) {
    console.log(e);
  }
  onRowExpanding(e) {
    if (e.key.length > 1) {
      if (this.viewerRecordsList && this.viewerRecordsList.length > 0 &&
        this.viewerRecordsList.filter(d => d.GroupKey1 === e.key[0] && d.GroupKey2 === e.key[1]).length > 0) {
        e.cancel = true;
      }
      if (this.groupKey.length == 0) {
        this.groupKey = e.key;
      }
      this.expandedRow = e;
    }
  }
  confirmRowExpandedClick(isTrue: boolean) {
    if (isTrue) {
      if (this.rowEvent) {
        this.selectedRows = [];
        this.rowEvent.component.collapseRow(this.groupKey);
        this.groupKey = this.rowEvent.key;
        var data = {
          'groupKey1': this.rowEvent.key[0],
          'groupKey2': this.rowEvent.key[1],
        };
        this.addOrderedSchedulerActivity(data);
      }
    } else {
      this.rowEvent.component.collapseRow(this.rowEvent.key);
      this.changePatient = false;
    }
  }
  onRowExpanded(e) {
    if (e.key.length > 1) {
      if (this.selectedRows.length > 0) {
        var groupRows = this.dataList.filter(x => x.SortedDate == e.key[0] && x.PatientId == e.key[1]).map(a => a.myId);
        if (this.selectedRows.every(val => groupRows.includes(val))) {
        }
        else {
          var oldPatientName = this.dataList.filter(x => x.SortedDate == this.groupKey[0] && x.PatientId == this.groupKey[1]).map(a => a.GivenName1).join('');
          var newPatientName = this.dataList.filter(x => x.SortedDate == e.key[0] && x.PatientId == e.key[1]).map(a => a.GivenName1).join('');
          this.confirmationTxt = `You are already working on patient (${oldPatientName} - ${this.groupKey[1]}). Do you want to stop working on this patient and work on a new patient (${newPatientName} - ${e.key[1]}) ?`;
          this.rowEvent = e;
          this.confirmRowExpanded.nativeElement.click();
        }
      }
      else {
        if (this.groupKey.length > 0) {
          if (!this.groupKey.every(val => e.key.includes(val))) {
            e.component.collapseRow(this.groupKey);
            this.groupKey = e.key;
            var data = {
              'groupKey1': this.groupKey[0],
              'groupKey2': this.groupKey[1],
            };
            this.addOrderedSchedulerActivity(data);
          }
          else {
            var data = {
              'groupKey1': e.key[0],
              'groupKey2': e.key[1],
            };
            this.addOrderedSchedulerActivity(data);
          }
        }
      }
    }
  }

  onRowCollapsed(e) {
    if (e.key.length > 1) {
      if (this.groupKey.every(val => e.key.includes(val))) {
        this.deleteOrderedSchedulerActivity();
        this.groupKey = [];
      }
      if (this.changePatient) {
        this.selectedRows = [];
      }
      else {
        this.changePatient = true;
      }
    }
  }

  onCellPrepared(e: any) {
    if (e.rowType === 'header' && e.column.command === 'select') {
      var instance = CheckBox.getInstance(e.cellElement.querySelector('.dx-select-checkbox'));
      var dom = instance.$element() as any;
      dom.remove();
    }
    if (e.rowType === 'data' && e.columnIndex) {
      e.cellElement.style.pointerEvents = 'none';
      if ((e.data.CB + e.data.VM)  == 2) {
        e.cellElement.style.backgroundColor= "yellow";
      }
      if ((e.data.CB + e.data.VM)  > 2) {
        e.cellElement.style.backgroundColor= "indianred";
      }
      if(e.data.Type){
        if (e.data.Type.toLowerCase() == 'coulnnot schedule patient') {
          e.cellElement.style.backgroundColor= "red";
        }
      } 
      if(e.data.Type){
        if (e.data.Type.toLowerCase() == 'patient schedule') {
          e.cellElement.style.backgroundColor= "green";
        }
      } 
    }
  }

  preScreeningQuestionClick(id) {
    this.isMR = false;
    this.isMRWC = false;
    this.isCT = false;
    this.isUS = false;
    this.preScreeningQuestionAnswerData = [];
    this.prescreeningFormCreate();
    if (!this.selectedRows.includes(id)) {
      setTimeout(() => {
        this.selectedRows = this.selectedRows.filter(item => item !== id);
        if (this.selectedRows.length > 0) {
          this.isPrescreeningQuestion = true;
          this.getPrescreeningQuestionData();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: null,
            alertMessage: 'Please select at least one record from the below table.',
            alertType: ResponseStatusCode.BadRequest
          });
        }
      }, 50);
    }
    else {
      setTimeout(() => {
        this.selectedRows.push(id);
        if (this.selectedRows.length > 0) {
          this.isPrescreeningQuestion = true;
          this.getPrescreeningQuestionData();
        }
        else {
          this.notificationService.showNotification({
            alertHeader: null,
            alertMessage: 'Please select at least one record from the below table.',
            alertType: ResponseStatusCode.BadRequest
          });
        }
      }, 50);
    }
  }

  getPrescreeningQuestionData() {
    this.isMR = false;
    this.isMRWC = false;
    this.isCT = false;
    this.isUS = false;
    this.preScreeningQuestionSubmitted = false;
    this.preScreeningQuestionForm.reset();

    let filterData = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
    let patientIds = filterData.map(a => a.PatientId);
    let internalStudyIds = filterData.map(a => a.InternalStudyId);
    var uniquePatientIds = patientIds.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    this.patientId = uniquePatientIds.toString()
    var uniqueInternalStudyIds = internalStudyIds.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    this.internalStudyId = uniqueInternalStudyIds.toString();
    var data = {
      'patientId': uniquePatientIds.toString(),
      'internalStudyId': uniqueInternalStudyIds.toString(),
    }
    this.workflowService.getPrescreeningQuestionData(data).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.preScreeningQuestionData = data.response;

        this.populatePatientData(this.preScreeningQuestionData.patientData);
        this.populateStudyData(this.preScreeningQuestionData.patientStudyData);
        if (this.preScreeningQuestionData.preScreeningQuestionData) {
          this.populatePreScreeningQuestionData(this.preScreeningQuestionData.preScreeningQuestionData);
          this.onChangePregnantTime();
          this.ShowWeightAndHeightMessage();
        }
        //this.setPrescreeningQuestionFormValidation();
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

  populatePatientData(sexData) {
    this.preScreeningQuestionForm.patchValue({
      gender: sexData.SEX
    });
    this.changeGender(sexData.SEX);
  }

  populateStudyData(studyData) {

    this.ctStudies = [];
    this.mrStudyDescription = [];
    this.usStudyDescription = [];

    studyData.forEach(study => {
      var studyDescription = study.STUDYDESCRIPTION.toLowerCase();
      switch (study.MODALITY) {
        case 'MR':
          if (((studyDescription.includes('mri') || studyDescription.includes('mr'))
            && (!studyDescription.includes('w/o & w/contrast')
              && (!studyDescription.includes('w/ & w/o ')
                && (!studyDescription.includes('w/ contrast')
                  && !studyDescription.includes('w/contrast')))))) {
            this.isMR = true;
          }
          if (((studyDescription.includes('mri') || studyDescription.includes('mr'))
            && (studyDescription.includes('w/contrast')
              || (studyDescription.includes('w/ contrast')
                || (studyDescription.includes('w/o & w/contrast')
                  || studyDescription.includes('w/ & w/o ')))))) {
            this.isMRWC = true;
            this.isMR = true;
          }
          this.mrStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })

          break;
        case 'DX':
        case 'CT':
        case 'RG':
        case 'PT':
        case 'CR':
          this.isCT = true;
          this.ctStudies.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;
        case 'US':
          this.isUS = true;
          this.usStudyDescription.push({
            'Study': study.STUDYDESCRIPTION,
            'Status': study.STATUS
          })
          break;

      }
    });
    this.setPrescreeningQuestionFormValidation()
  }
  populatePreScreeningQuestionData(questionData) {
    questionData.forEach(data => {
      switch (data.Questions) {
        case PreScreeningGeneralQuestion.Gender:
          this.preScreeningQuestionForm.patchValue({
            gender: data.Answers
          });
          break; // this line was Commented . Because of this Gender was not binding correctly . Mridula Uncommented it 
        case PreScreeningGeneralQuestion.Weight:
          this.preScreeningQuestionForm.patchValue({
            weight: data.Answers
          });
          break;
        case PreScreeningGeneralQuestion.Height:
          if (data.Answers) {
            this.preScreeningQuestionForm.patchValue({
              heightFoot: data.Answers.split(' ')[0],
              heightInch: data.Answers.split(' ')[1]
            });
          }
          break;
        case PreScreeningGeneralQuestion.Pregnant:
          this.preScreeningQuestionForm.patchValue({
            isPregnant: data.Answers
          });
          this.changePregnant(data.Answers);
          break;
        case PreScreeningGeneralQuestion.PregnantTime:
          this.preScreeningQuestionForm.patchValue({
            pregnantTime: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriBefore:
          this.preScreeningQuestionForm.patchValue({
            isMriBefore: data.Answers
          });
          this.changeMRI(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriProblem:
          this.preScreeningQuestionForm.patchValue({
            isMriExperience: data.Answers
          });
          this.changeMRIExperience(data.Answers);
          break;
        case PreScreeningMRIQuestion.TextMriProblem:
          this.preScreeningQuestionForm.patchValue({
            mriExperienceQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriClaustrophobic:
          this.preScreeningQuestionForm.patchValue({
            isClaustrophobic: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriMedicalCondition:
          this.preScreeningQuestionForm.patchValue({
            isMedicalCondition: data.Answers
          });
          this.changeMedicalCondition(data.Answers);
          break;
        case PreScreeningMRIQuestion.WhatMriCondition:
          this.preScreeningQuestionForm.patchValue({
            medicalConditionQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriHobbyJob:
          this.preScreeningQuestionForm.patchValue({
            isMetalWorked: data.Answers
          });
          this.changeMetalWorked(data.Answers);
          break;
        case PreScreeningMRIQuestion.AuthorizationXRAY:
          this.preScreeningQuestionForm.patchValue({
            isPerformedXRAY: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.EyesInjuries:
          this.preScreeningQuestionForm.patchValue({
            isEyeInjury: data.Answers
          });
          this.changeEyeInjury(data.Answers);
          break;
        case PreScreeningMRIQuestion.InjuryEyesAnswer:
          this.preScreeningQuestionForm.patchValue({
            eyeInjuryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriPhysicalLimition:
          this.preScreeningQuestionForm.patchValue({
            isPhysicalLimitation: data.Answers
          });
          this.changePhysicalLimitation(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriTransfer:
          this.preScreeningQuestionForm.patchValue({
            isSelfTransferMriTable: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriMedicaldevices:
          this.preScreeningQuestionForm.patchValue({
            isMedicalDeviceOnBody: data.Answers
          });
          this.changeMedicalDeviceOnBody(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriManufacturerCard:
          this.preScreeningQuestionForm.patchValue({
            medicalDeviceOnBodyQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriForeignMetalObj:
          this.preScreeningQuestionForm.patchValue({
            isForeignMetalInjury: data.Answers
          });
          this.changeForeignMetalInjury(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriObjLocated:
          this.preScreeningQuestionForm.patchValue({
            foreignMetalInjuryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriWig:
          this.preScreeningQuestionForm.patchValue({
            isWearWig: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriRemovableMetal:
          this.preScreeningQuestionForm.patchValue({
            isRemovableMetal: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriRecentTattoos:
          this.preScreeningQuestionForm.patchValue({
            isRecentTattoo: data.Answers
          });
          this.changeRecentTattoo(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriTattooSize:
          this.preScreeningQuestionForm.patchValue({
            recentTattooQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriAnkleMonitorDevice:
          this.preScreeningQuestionForm.patchValue({
            isAnkleMonitorDevice: data.Answers
          });
          this.changeAnkleMonitorDevice(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriProcedure:
          this.preScreeningQuestionForm.patchValue({
            isRemovableAnkleMonitorDevice: data.Answers
          });
          this.changeRemovableAnkleMonitorDevice(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriPOMeetFacility:
          this.preScreeningQuestionForm.patchValue({
            isRemovablWhileScan: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriSurgeries:
          this.preScreeningQuestionForm.patchValue({
            priorSurgeryQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriDiabetes:
          this.preScreeningQuestionForm.patchValue({
            isDiabetesHistory: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriCancer:
          this.preScreeningQuestionForm.patchValue({
            isCancerHistory: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriBloodPressure:
          this.preScreeningQuestionForm.patchValue({
            isHighBloodPressure: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriAllergiesMedications:
          this.preScreeningQuestionForm.patchValue({
            isAllergyReaction: data.Answers
          });
          this.changeAllergyReaction(data.Answers);
          break;
        case PreScreeningMRIQuestion.MriAllergiesMedicationsDescriptions:
          this.preScreeningQuestionForm.patchValue({
            allergyReactionQuestion: data.Answers
          });
          break;
        case PreScreeningMRIQuestion.MriKidneyProblem:
          this.preScreeningQuestionForm.patchValue({
            isKidneyProblem: data.Answers
          });
          break;
        case PreScreeningUSQuestion.Allergy:
          this.preScreeningQuestionForm.patchValue({
            isAllergy: data.Answers
          });
          this.changeAllergy(data.Answers);
          break;
        case PreScreeningUSQuestion.AllergyDescription:
          this.preScreeningQuestionForm.patchValue({
            allergyDescription: data.Answers
          });
          break;
        case PreScreeningCTQuestion.RecentXaryOrCt:
          this.preScreeningQuestionForm.patchValue({
            isRecentXray: data.Answers
          });
          this.changeRecentXray(data.Answers);
          break;
        case PreScreeningCTQuestion.XrayWhichBodyPart:
          this.preScreeningQuestionForm.patchValue({
            xrayCTDescription: data.Answers
          });
          break;
        case PreScreeningCTQuestion.HaveCancer:
          this.preScreeningQuestionForm.patchValue({
            isCancerHistoryCT: data.Answers
          });
          this.changeCancerHistory(data.Answers);
          break;
        case PreScreeningCTQuestion.RecentRediation:
          this.preScreeningQuestionForm.patchValue({
            radiationTreatment: data.Answers
          });
          break;
      }
    });
  }

  setPrescreeningQuestionFormValidation() {

    //this.changePhysicalLimitation(data.Answers);
    //      M R I    ( C O M M O N)
    const formControl1 = this.preScreeningQuestionForm.get('isMriBefore');
    const formControl2 = this.preScreeningQuestionForm.get('isClaustrophobic');
    const formControl3 = this.preScreeningQuestionForm.get('isMedicalCondition');
    const formControl4 = this.preScreeningQuestionForm.get('isMetalWorked');
    const formControl5 = this.preScreeningQuestionForm.get('isEyeInjury');
    const formControl6 = this.preScreeningQuestionForm.get('isPhysicalLimitation');
    const formControl7 = this.preScreeningQuestionForm.get('isSelfTransferMriTable');
    const formControl8 = this.preScreeningQuestionForm.get('isMedicalDeviceOnBody');
    const formControl9 = this.preScreeningQuestionForm.get('isForeignMetalInjury');
    const formControl10 = this.preScreeningQuestionForm.get('isWearWig');
    const formControl11 = this.preScreeningQuestionForm.get('isRemovableMetal');
    const formControl12 = this.preScreeningQuestionForm.get('isRecentTattoo');
    const formControl13 = this.preScreeningQuestionForm.get('isAnkleMonitorDevice');
    const formControl14 = this.preScreeningQuestionForm.get('priorSurgeryQuestion');

    //    M R I   ( W I T H   C O N T R A S T)
    const formControl15 = this.preScreeningQuestionForm.get('isDiabetesHistory');
    const formControl16 = this.preScreeningQuestionForm.get('isCancerHistory');
    const formControl17 = this.preScreeningQuestionForm.get('isHighBloodPressure');
    const formControl18 = this.preScreeningQuestionForm.get('isAllergyReaction');
    const formControl19 = this.preScreeningQuestionForm.get('isKidneyProblem');

    //    C T  or  X R A Y
    const formControl20 = this.preScreeningQuestionForm.get('isRecentXray');
    const formControl21 = this.preScreeningQuestionForm.get('isCancerHistoryCT');

    //    U S
    const formControl22 = this.preScreeningQuestionForm.get('isAllergy');

    formControl1.clearValidators();
    formControl2.clearValidators();
    formControl3.clearValidators();
    formControl4.clearValidators();
    formControl5.clearValidators();
    formControl6.clearValidators();
    formControl7.clearValidators();
    formControl8.clearValidators();
    formControl9.clearValidators();
    formControl10.clearValidators();
    formControl11.clearValidators();
    formControl12.clearValidators();
    formControl13.clearValidators();
    formControl14.clearValidators();
    formControl15.clearValidators();
    formControl16.clearValidators();
    formControl17.clearValidators();
    formControl18.clearValidators();
    formControl19.clearValidators();
    formControl20.clearValidators();
    formControl21.clearValidators();
    formControl22.clearValidators();

    if (this.isMR) {
      formControl1.setValidators([Validators.required]);
      formControl2.setValidators([Validators.required]);
      formControl3.setValidators([Validators.required]);
      formControl4.setValidators([Validators.required]);
      formControl5.setValidators([Validators.required]);
      formControl6.setValidators([Validators.required]);
      formControl7.setValidators([Validators.required]);
      formControl8.setValidators([Validators.required]);
      formControl9.setValidators([Validators.required]);
      formControl10.setValidators([Validators.required]);
      formControl11.setValidators([Validators.required]);
      formControl12.setValidators([Validators.required]);
      formControl13.setValidators([Validators.required]);
      formControl14.setValidators([Validators.required]);
    }
    if (this.isMRWC) {
      formControl15.setValidators([Validators.required]);
      formControl16.setValidators([Validators.required]);
      formControl17.setValidators([Validators.required]);
      formControl18.setValidators([Validators.required]);
      formControl19.setValidators([Validators.required]);
    }
    if (this.isCT) {
      formControl20.setValidators([Validators.required]);
      formControl21.setValidators([Validators.required]);
    }
    if (this.isUS) {
      formControl22.setValidators([Validators.required]);
    }

    formControl1.updateValueAndValidity();
    formControl2.updateValueAndValidity();
    formControl3.updateValueAndValidity();
    formControl4.updateValueAndValidity();
    formControl5.updateValueAndValidity();
    formControl6.updateValueAndValidity();
    formControl7.updateValueAndValidity();
    formControl8.updateValueAndValidity();
    formControl9.updateValueAndValidity();
    formControl10.updateValueAndValidity();
    formControl11.updateValueAndValidity();
    formControl12.updateValueAndValidity();
    formControl13.updateValueAndValidity();
    formControl14.updateValueAndValidity();
    formControl15.updateValueAndValidity();
    formControl16.updateValueAndValidity();
    formControl17.updateValueAndValidity();
    formControl18.updateValueAndValidity();
    formControl19.updateValueAndValidity();
    formControl20.updateValueAndValidity();
    formControl21.updateValueAndValidity();
    formControl22.updateValueAndValidity();
  }

  closePopup() {
    this.isPrescreeningQuestion = false;
    this.preScreeningQuestionSubmitted = false;
  }

  onSMSReset() {

    this.smsForm.reset();
    this.smsSubmitted = false;
    this.showSMSInfo = false;
    this.smsLength = 0;
    this.noOfSMS = 0;
    if (this.selectedRows) {
      this.phoneNumber = this.dataList[this.selectedRows[0]].CELLPHONE;
      if (this.selectedRows.length > 0) {
        this.smsForm.patchValue({
          phoneNumber: this.phoneNumber
        });
      } else {
        this.smsForm.patchValue({
          phoneNumber: '',
          message: ''
        });
      }
    }
  }
  onSMSClear() {
    this.smsForm.patchValue({
      phoneNumber: '',
      message: ''
    });
    this.showSMSInfo = false;
  }

  onMessageKeyup(value) {
    this.smsLength = value.length;
    if (this.smsLength > 0) {
      this.showSMSInfo = true;

      if (this.smsLength > 0 && this.smsLength <= MessageLength.Message_1_Length) {
        this.noOfSMS = 1;
      }

      else if (this.smsLength > MessageLength.Message_1_Length && this.smsLength <= MessageLength.Message_2_Length) {
        this.noOfSMS = 2;
      }

      else if (this.smsLength > MessageLength.Message_2_Length && this.smsLength <= MessageLength.Message_3_Length) {
        this.noOfSMS = 3;
      }

      else if (this.smsLength > MessageLength.Message_3_Length && this.smsLength <= MessageLength.Message_4_Length) {
        this.noOfSMS = 4;
      }

      else if (this.smsLength > MessageLength.Message_4_Length && this.smsLength <= MessageLength.Message_5_Length) {
        this.noOfSMS = 5;
      }

      else if (this.smsLength > MessageLength.Message_5_Length && this.smsLength <= MessageLength.Message_6_Length) {
        this.noOfSMS = 6;
      }
    }
    else {
      this.showSMSInfo = false;
    }
  }

  getDropdown() {
    this.workflowService.getOrderedSchedulerDropDown(false).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.financialTypeList = data.response.financialTypeList;
        this.filterList = data.response.filterList;
        this.brokerList = data.response.brokerList;
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

  getStatusCount() {
    this.workflowService.getStatusCount(false).subscribe((res) => {
      var data: any = res;

      if (data.response != null) {
        this.totalOrder = data.response.TotalOrder;
        this.newOrder = data.response.NewOrder;
        this.totalVM = data.response.TotalVM;
        this.leftVM = data.response.LeftVM;
        this.totalCB = data.response.TotalCB;
        this.leftCB = data.response.LeftCB;
        this.ordered = data.response.Ordered;
        this.totalOrdered = data.response.TotalOrdered;
        this.noShow = data.response.NoShow;
        this.totalNoShow = data.response.TotalNoShow;
        this.rescheduled = data.response.Rescheduled;
        this.totalRescheduled = data.response.TotalRescheduled;
        this.countData = true;
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

  getOrderedSchedulerData() {  
    this.deleteOrderedSchedulerActivity();
    var data = {
      'patientId': this.sForm.patientId.value ? this.sForm.patientId.value : null,
      'lastName': this.sForm.lastName.value ? this.sForm.lastName.value : null,
      'firstName': this.sForm.firstName.value ? this.sForm.firstName.value : null,
      'broker': this.sForm.broker.value != 'null' ? this.sForm.broker.value : null,
      'filters': this.sForm.filter.value != 'null' ? this.sForm.filter.value : null,
      'financialType': this.sForm.financialType.value != 'null' ? this.sForm.financialType.value : null
    }
    console.log(data);

    this.workflowService.getOrderedSchedulerData(data, this.pageNumber, this.pageSize).subscribe((res) => {
      this.totalRecords = 1;
      if (res) {
        this.getAllOrderSchedulerActivity();
        var data: any = res;
        this.totalRecords = res.totalRecords > 0 ? res.totalRecords : 1;
        this.totalOrder = data.response ? data.response[0].AllCount[0].TotalOrder : 0;
        this.newOrder =  data.response ? data.response[0].AllCount[0].NewOrder : 0;
        this.totalVM = data.response ? data.response[0].AllCount[0].TotalVM : 0;
        this.leftVM = data.response? data.response[0].AllCount[0].LeftVM : 0;
        this.totalCB = data.response ? data.response[0].AllCount[0].TotalCB : 0;
        this.leftCB = data.response? data.response[0].AllCount[0].LeftCB :0;
        this.ordered = data.response ? data.response[0].AllCount[0].Ordered:0;
        this.totalOrdered = data.response ? data.response[0].AllCount[0].TotalOrdered :0;
        this.noShow = data.response ? data.response[0].AllCount[0].NoShow :0;
        this.totalNoShow = data.response? data.response[0].AllCount[0].TotalNoShow :0;
        this.rescheduled = data.response ? data.response[0].AllCount[0].Rescheduled :0;
        this.totalRescheduled = data.response ? data.response[0].AllCount[0].TotalRescheduled:0;
        this.countData = true;
        this.dataList = data.response;
        console.log(this.dataList)
        if (this.dataList != null) {
          this.dataList.forEach((element, index) => {
            element.myId = index;
          });
        }
        else {
          this.dataList = [];
          this.totalRecords = 1;
        }
      }
    },
      (err: any) => {
        this.totalRecords = 1;
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  onSearchSubmit() { 
    this.selectedRows = [];
    this.pageNumber = 1;
    this.getOrderedSchedulerData();
  }

  onClearFilter() {
    this.searchForm.reset();
    this.getOrderedSchedulerData();
  }

  sendSMS() {
    this.smsSubmitted = true;
    this.smsModal = 'modal';
    if (this.smsForm.invalid) {
      this.smsModal = '';
      return;
    }

    var data = {
      'phoneNumber': this.smForm.phoneNumber.value,
      'message': this.smForm.message.value
    };
    this.workflowService.sendSMSOrderedScheduler(data).subscribe((res) => {
      if (res) {
        var data: any = res;
        if (data?.response?.Status == 'Authenticate') {
          data.responseCode = 200;
        }
        else {
          data.responseCode = 500;
        }
        this.notificationService.showNotification({
          alertHeader: null,
          alertMessage: data.responseCode == ResponseStatusCode.OK ? 'SMS sent successfully.' : 'Unable to send SMS.',
          alertType: data.responseCode
        });
        this.onSMSReset();
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

  saveAndDoNotSubmit() {
    this.preScreeningQuestionSubmitted = false;
    this.preScreeningQuestionModal = 'modal';
    // if (this.preScreeningQuestionForm.invalid) {
    //   this.preScreeningQuestionModal = '';
    //   return;
    // }
    this.preScreeningQuestionData.patientStudyData.forEach(element => console.log(element));
    this.savePreScreeningQuestionData(false);
  }

  saveAndSubmit() {
    console.log(this.preScreeningQuestionForm.errors);

    this.preScreeningQuestionSubmitted = true;
    this.preScreeningQuestionModal = 'modal';
    if (this.preScreeningQuestionForm.invalid) {
      this.preScreeningQuestionModal = '';
      return;
    }

    this.savePreScreeningQuestionData(true);
    //alert('Form valid');
  }

  cancelAndClose() {
    this.preScreeningQuestionForm.reset();
    this.preScreeningQuestionSubmitted = false;
    this.closePopup()
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.selectedRows = [];
    this.dataGrid.instance.collapseRow(this.groupKey);
    this.groupKey = [];
    this.changePatient = true;
    this.getOrderedSchedulerData();
    this.deleteOrderedSchedulerActivity();
  }

  changeGender(val) {
    const isPregnantControl = this.preScreeningQuestionForm.get('isPregnant');
    const pregnantTimeControl = this.preScreeningQuestionForm.get('pregnantTime');
    if (val === 'M') {
      isPregnantControl.setValidators(null);
      pregnantTimeControl.setValidators(null);
    }
    else if (val === 'F') {
      isPregnantControl.setValidators([Validators.required]);
      pregnantTimeControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isPregnant: ''
      });
    }
    isPregnantControl.updateValueAndValidity();
    pregnantTimeControl.updateValueAndValidity();

  }

  changePregnant(val) {
    const pregnantTimeControl = this.preScreeningQuestionForm.get('pregnantTime');
    if (val === 'Yes') {
      pregnantTimeControl.setValidators([Validators.required]);
    }
    else {
      pregnantTimeControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        pregnantTime: ''
      });
    }
    pregnantTimeControl.updateValueAndValidity();
  }

  changeMRI(val) {
    const isMriExperienceControl = this.preScreeningQuestionForm.get('isMriExperience');
    const mriExperienceQuestionControl = this.preScreeningQuestionForm.get('mriExperienceQuestion');
    if (val === 'Yes') {
      isMriExperienceControl.setValidators([Validators.required]);
    }
    else {
      isMriExperienceControl.setValidators(null);
      mriExperienceQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isMriExperience: '',
        mriExperienceQuestion: ''
      });
    }
    isMriExperienceControl.updateValueAndValidity();
    mriExperienceQuestionControl.updateValueAndValidity();
  }

  changeMRIExperience(val) {
    const mriExperienceQuestionControl = this.preScreeningQuestionForm.get('mriExperienceQuestion');
    if (val === 'Yes') {
      mriExperienceQuestionControl.setValidators([Validators.required]);
    }
    else {
      mriExperienceQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        mriExperienceQuestion: ''
      });
    }
    mriExperienceQuestionControl.updateValueAndValidity();
  }

  changeMedicalCondition(val) {
    const medicalConditionQuestionControl = this.preScreeningQuestionForm.get('medicalConditionQuestion');
    if (val === 'Yes') {
      medicalConditionQuestionControl.setValidators([Validators.required]);
    }
    else {
      medicalConditionQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        medicalConditionQuestion: ''
      });
    }
    medicalConditionQuestionControl.updateValueAndValidity();
  }

  changeMetalWorked(val) {
    const isPerformedXRAYControl = this.preScreeningQuestionForm.get('isPerformedXRAY');
    if (val === 'Yes') {
      isPerformedXRAYControl.setValidators([Validators.required]);
    }
    else {
      isPerformedXRAYControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isPerformedXRAY: ''
      });
    }
    isPerformedXRAYControl.updateValueAndValidity();
  }

  changeEyeInjury(val) {
    const eyeInjuryQuestionControl = this.preScreeningQuestionForm.get('eyeInjuryQuestion');
    if (val === 'Yes') {
      eyeInjuryQuestionControl.setValidators([Validators.required]);
    }
    else {
      eyeInjuryQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        eyeInjuryQuestion: ''
      });
    }
    eyeInjuryQuestionControl.updateValueAndValidity();
  }

  changePhysicalLimitation(val) {
    const isSelfTransferMriTableControl = this.preScreeningQuestionForm.get('isSelfTransferMriTable');
    if (val === 'Yes') {
      isSelfTransferMriTableControl.setValidators([Validators.required]);
    }
    else {
      isSelfTransferMriTableControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isSelfTransferMriTable: ''
      });
    }
    isSelfTransferMriTableControl.updateValueAndValidity();
  }

  changeMedicalDeviceOnBody(val) {
    const medicalDeviceOnBodyQuestionControl = this.preScreeningQuestionForm.get('medicalDeviceOnBodyQuestion');
    if (val === 'Yes') {
      medicalDeviceOnBodyQuestionControl.setValidators([Validators.required]);
    }
    else {
      medicalDeviceOnBodyQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        medicalDeviceOnBodyQuestion: ''
      });
    }
    medicalDeviceOnBodyQuestionControl.updateValueAndValidity();
  }

  changeForeignMetalInjury(val) {
    const foreignMetalInjuryQuestionControl = this.preScreeningQuestionForm.get('foreignMetalInjuryQuestion');
    if (val === 'Yes') {
      foreignMetalInjuryQuestionControl.setValidators([Validators.required]);
    }
    else {
      foreignMetalInjuryQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        foreignMetalInjuryQuestion: ''
      });
    }
    foreignMetalInjuryQuestionControl.updateValueAndValidity();
  }

  changeRecentTattoo(val) {
    const recentTattooQuestionControl = this.preScreeningQuestionForm.get('recentTattooQuestion');
    if (val === 'Yes') {
      recentTattooQuestionControl.setValidators([Validators.required]);
    }
    else {
      recentTattooQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        recentTattooQuestion: ''
      });
    }
    recentTattooQuestionControl.updateValueAndValidity();
  }

  changeAnkleMonitorDevice(val) {
    const isRemovableAnkleMonitorDeviceControl = this.preScreeningQuestionForm.get('isRemovableAnkleMonitorDevice');
    if (val === 'Yes') {
      isRemovableAnkleMonitorDeviceControl.setValidators([Validators.required]);
    }
    else {
      isRemovableAnkleMonitorDeviceControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isRemovableAnkleMonitorDevice: '',
        isRemovablWhileScan: ''
      });
    }
    isRemovableAnkleMonitorDeviceControl.updateValueAndValidity();
  }

  changeRemovableAnkleMonitorDevice(val) {
    const isRemovablWhileScanControl = this.preScreeningQuestionForm.get('isRemovablWhileScan');
    if (val === 'N') {
      isRemovablWhileScanControl.setValidators([Validators.required]);
    }
    else {
      isRemovablWhileScanControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        isRemovablWhileScan: ''
      });
    }
    isRemovablWhileScanControl.updateValueAndValidity();
  }

  changeAllergy(val) {
    const allergyDescriptionControl = this.preScreeningQuestionForm.get('allergyDescription');
    if (val === 'Yes') {
      allergyDescriptionControl.setValidators([Validators.required]);
    }
    else {
      allergyDescriptionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        allergyDescription: ''
      });
    }
    allergyDescriptionControl.updateValueAndValidity();
  }

  changeRecentXray(val) {
    const xrayCTDescriptionControl = this.preScreeningQuestionForm.get('xrayCTDescription');
    if (val === 'Yes') {
      xrayCTDescriptionControl.setValidators([Validators.required]);
    }
    else {
      xrayCTDescriptionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        xrayCTDescription: ''
      });
    }
    xrayCTDescriptionControl.updateValueAndValidity();
  }

  changeCancerHistory(val) {
    const radiationTreatmentControl = this.preScreeningQuestionForm.get('radiationTreatment');
    if (val === 'Yes') {
      radiationTreatmentControl.setValidators([Validators.required]);
    }
    else {
      radiationTreatmentControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        radiationTreatment: ''
      });
    }
    radiationTreatmentControl.updateValueAndValidity();
  }

  changeAllergyReaction(val) {
    const allergyReactionQuestionControl = this.preScreeningQuestionForm.get('allergyReactionQuestion');
    if (val === 'Yes') {
      allergyReactionQuestionControl.setValidators([Validators.required]);
    }
    else {
      allergyReactionQuestionControl.setValidators(null);
      this.preScreeningQuestionForm.patchValue({
        allergyReactionQuestion: ''
      });
    }
    allergyReactionQuestionControl.updateValueAndValidity();
  }


  savePreScreeningQuestionData(isSubmitAndSave: boolean) {
    this.preScreeningQuestionAnswerData = [];
    this.preScreeningQuestionData.patientStudyData.forEach((element, index) => {
      var studyDescription = element.STUDYDESCRIPTION.toLowerCase();
      this.psqForm.gender.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Gender, this.psqForm.gender.value) : null;
      if (this.psqForm.gender.value == 'F') {
        this.psqForm.isPregnant.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Pregnant, this.psqForm.isPregnant.value) : null;
        if (this.psqForm.isPregnant.value == 'Yes') {
          this.psqForm.pregnantTime.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.PregnantTime, this.psqForm.pregnantTime.value) : null;
        }
      }
      this.psqForm.weight.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Weight, this.psqForm.weight.value) : null;
      this.psqForm.heightFoot.value ? this.createQuestionAnswerJsonObject(PreScreeningGeneralQuestion.Height, this.psqForm.heightFoot.value + ' ' + this.psqForm.heightInch.value) : null;
      this.psqForm.isMriBefore.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriBefore, this.psqForm.isMriBefore.value) : null;
      if (this.psqForm.isMriBefore.value == 'Yes') {
        this.psqForm.isMriExperience.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriProblem, this.psqForm.isMriExperience.value) : null;
        if (this.psqForm.isMriExperience.value == 'Yes')
          this.psqForm.mriExperienceQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.TextMriProblem, this.psqForm.mriExperienceQuestion.value) : null;
      }

      this.psqForm.isClaustrophobic.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriClaustrophobic, this.psqForm.isClaustrophobic.value) : null;
      this.psqForm.isMedicalCondition.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriMedicalCondition, this.psqForm.isMedicalCondition.value) : null;
      if (this.psqForm.isMedicalCondition.value == 'Yes') {
        this.psqForm.medicalConditionQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.WhatMriCondition, this.psqForm.medicalConditionQuestion.value) : null;
      }
      this.psqForm.isMetalWorked.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriHobbyJob, this.psqForm.isMetalWorked.value) : null;
      if (this.psqForm.isMetalWorked.value == 'Yes') {
        this.psqForm.isPerformedXRAY.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.AuthorizationXRAY, this.psqForm.isPerformedXRAY.value) : null;
      }
      this.psqForm.isEyeInjury.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.EyesInjuries, this.psqForm.isEyeInjury.value) : null;

      if (this.psqForm.isEyeInjury.value == 'Yes') {
        this.psqForm.eyeInjuryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.InjuryEyesAnswer, this.psqForm.eyeInjuryQuestion.value) : null;
      }
      this.psqForm.isPhysicalLimitation.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriPhysicalLimition, this.psqForm.isPhysicalLimitation.value) : null;

      if (this.psqForm.isPhysicalLimitation.value == 'Yes') {
        this.psqForm.isSelfTransferMriTable.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriTransfer, this.psqForm.isSelfTransferMriTable.value) : null;
      }
      this.psqForm.isMedicalDeviceOnBody.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriMedicaldevices, this.psqForm.isMedicalDeviceOnBody.value) : null;
      if (this.psqForm.isMedicalDeviceOnBody.value == 'Yes') {
        this.psqForm.medicalDeviceOnBodyQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriManufacturerCard, this.psqForm.medicalDeviceOnBodyQuestion.value) : null;
      }
      this.psqForm.isForeignMetalInjury.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriForeignMetalObj, this.psqForm.isForeignMetalInjury.value) : null;
      if (this.psqForm.isForeignMetalInjury.value == 'Yes') {
        this.psqForm.foreignMetalInjuryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriObjLocated, this.psqForm.foreignMetalInjuryQuestion.value) : null;
      }
      this.psqForm.isWearWig.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriWig, this.psqForm.isWearWig.value) : null;

      this.psqForm.isRemovableMetal.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriRemovableMetal, this.psqForm.isRemovableMetal.value) : null;

      this.psqForm.isRecentTattoo.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriRecentTattoos, this.psqForm.isRecentTattoo.value) : null;
      if (this.psqForm.isRecentTattoo.value == 'Yes') {
        this.psqForm.recentTattooQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriTattooSize, this.psqForm.recentTattooQuestion.value) : null;
      }
      this.psqForm.isAnkleMonitorDevice.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriAnkleMonitorDevice, this.psqForm.isAnkleMonitorDevice.value) : null;

      if (this.psqForm.isAnkleMonitorDevice.value == 'Yes') {
        this.psqForm.isRemovableAnkleMonitorDevice.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriProcedure, this.psqForm.isRemovableAnkleMonitorDevice.value) : null;

        if (this.psqForm.isRemovableAnkleMonitorDevice.value == 'No') {
          this.psqForm.isRemovablWhileScan.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriPOMeetFacility, this.psqForm.isRemovablWhileScan.value) : null;
        }
      }
      this.psqForm.priorSurgeryQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriSurgeries, this.psqForm.priorSurgeryQuestion.value) : null;
      this.psqForm.isDiabetesHistory.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriDiabetes, this.psqForm.isDiabetesHistory.value) : null;
      this.psqForm.isCancerHistory.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriCancer, this.psqForm.isCancerHistory.value) : null;
      this.psqForm.isHighBloodPressure.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriBloodPressure, this.psqForm.isHighBloodPressure.value) : null;

      this.psqForm.isAllergyReaction.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriAllergiesMedications, this.psqForm.isAllergyReaction.value) : null;
      if (this.psqForm.isAllergyReaction.value == 'Yes') {
        //Please check
        this.psqForm.allergyReactionQuestion.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.AllergyDescription, this.psqForm.allergyReactionQuestion.value) : null;
      }
      this.psqForm.isKidneyProblem.value ? this.createQuestionAnswerJsonObject(PreScreeningMRIQuestion.MriKidneyProblem, this.psqForm.isKidneyProblem.value) : null;
      switch (element.MODALITY) {
        case 'MR':
          this.modality = 'MR'
          if (((studyDescription.includes('mri') || studyDescription.includes('mr'))
            && (!studyDescription.includes('w/o & w/contrast')
              && (!studyDescription.includes('w/ & w/o ')
                && (!studyDescription.includes('w/ contrast')
                  && !studyDescription.includes('w/contrast')))))) {
          }
          if (((studyDescription.includes('mri') || studyDescription.includes('mr'))
            && (studyDescription.includes('w/contrast')
              || (studyDescription.includes('w/ contrast')
                || (studyDescription.includes('w/o & w/contrast')
                  || studyDescription.includes('w/ & w/o ')))))) {
          }
          break;
        case 'CR':
        case 'DX':
        case 'CT':
          this.modality = 'CT'
          this.psqForm.isRecentXray.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.RecentXaryOrCt, this.psqForm.isRecentXray.value) : null;
          if (this.psqForm.isRecentXray.value == 'Yes') {
            this.psqForm.xrayCTDescription.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.XrayWhichBodyPart, this.psqForm.xrayCTDescription.value) : null;
          }
          this.psqForm.isCancerHistoryCT.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.HaveCancer, this.psqForm.isCancerHistoryCT.value) : null;
          if (this.psqForm.isCancerHistoryCT.value == 'Yes') {
            this.psqForm.radiationTreatment.value ? this.createQuestionAnswerJsonObject(PreScreeningCTQuestion.RecentRediation, this.psqForm.radiationTreatment.value) : null;
          }
        case 'RG':
        case 'PT':

          break;
        case 'US':
          this.psqForm.isAllergy.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.Allergy, this.psqForm.isAllergy.value) : null;
          if (this.psqForm.isAllergy.value == 'Yes') {
            this.psqForm.allergyDescription.value ? this.createQuestionAnswerJsonObject(PreScreeningUSQuestion.AllergyDescription, this.psqForm.allergyDescription.value) : null;
          }
          break;
      }
    });

    let StudyDetailJson = [{ INTERNALSTUDYID: this.internalStudyId, MODALITY: this.modality }]
    let PatientDetailJson = [{
      FirstName: this.preScreeningQuestionData.patientData.FirstName, LastName: this.preScreeningQuestionData.patientData.LastName, PatientDOB: this.preScreeningQuestionData.patientData.DOB,
      StudyDescription: this.mrStudyDescription, isMR: this.isMR, isMRWC: this.isMRWC, isCT: this.isCT, isUS: this.isUS
    }]
    var data = {
      'QuestionAnswerJson': JSON.stringify(this.preScreeningQuestionAnswerData),
      'StudyDetailJson': JSON.stringify(StudyDetailJson),
      'PatientId': this.patientId,
      'SchedulingPreScreeningComplete': isSubmitAndSave,
      'PatientDetailJson': JSON.stringify(PatientDetailJson)
    };
    if (isSubmitAndSave) {
      this.workflowService.savePreScreeningQuestionData(data, true).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
            alertMessage: res.message,
            alertType: res.responseCode
          });
          // var file = res.description.split(',,', 2);
          this.downloadFile(res.description, 'txt.pdf');
          this.closePopup();
          this.onSearchSubmit();
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
    else {
      this.workflowService.SaveAndDontSubmitPreScreeningQuestionData(data, true).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: res.responseCode == ResponseStatusCode.OK ? 'Success' : 'Error',
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
  }

  _base64ToArrayBuffer(base64: any) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }

  downloadFile(fileData, fileName) {
    let ArrayBuff = this._base64ToArrayBuffer(fileData);
    let file = new Blob([ArrayBuff], { type: 'application/pdf' });
    fileData = URL.createObjectURL(file)
    // FileSaver.saveAs(fileData, fileName);
    //window.open(fileData, '_blank');
  }

  createQuestionAnswerJsonObject(question, answer) {
    this.preScreeningQuestionAnswerData.push({ 'Question': question, 'Answer': answer });
  }

  checkInvalidControls() {
    const invalid = [];
    const controls = this.preScreeningQuestionForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  get sForm() { return this.searchForm.controls; }
  get smForm() { return this.smsForm.controls; }
  get psqForm() { return this.preScreeningQuestionForm.controls; }

  ngOnDestroy() {
    this.signalRSub.unsubscribe();
  }

  SaveOrderedSchedulerLog(type: any) {
    debugger
    if (!this.selectedRows || this.selectedRows.length == 0) {
      this.notificationService.showNotification({
        alertHeader: null,
        alertMessage: 'Please select at least one record from the below table.',
        alertType: ResponseStatusCode.BadRequest
      });
    }
    else {
      let filterData = this.dataList.filter((data) => this.selectedRows.includes(data.myId));
      const data = [];
      const that = this;
      let isValid = true;
      filterData.forEach(function (e) {
        if (e.Color !== 'Green') {
          isValid = false;
        }
        data.push({
          PatientId: e.PatientId,
          InternalStudyId: e.InternalStudyId,
          Type: type,
          LastAttemptedBy: that._storage.user.UserId,
          SortOrder: null
        });
      });

      if (type === 'PATIENT SCHEDULED' && !isValid) {
        that.notificationService.showNotification({
          alertHeader: null,
          alertMessage: 'Please complete the screening questions before confirming the patient is scheduled.',
          alertType: ResponseStatusCode.BadRequest
        });
        return
      }
      this.workflowService.SaveOrderedSchedulerLog(JSON.stringify(JSON.stringify(data)), true).subscribe((res) => {
        if (res) {
          const data: any = res;
          this.notificationService.showNotification({
            alertHeader: '',
            alertMessage: data.response[0].Message,
            alertType: ResponseStatusCode.OK
          });
          this.selectedRows = [];
          this.getOrderedSchedulerData();
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

  onChangePregnantTime() {
    let time = this.psqForm.pregnantTime.value
    if (!time)
      this.pregnantMessage = null;
    else if (parseInt(time.replace('mo', '')) < 4)
      this.pregnantMessage = 'In order to proceed with your procedure we need an authorization letter from your OB doctor giving Precise Imaging approval to proceed with the procedure.'
    else
      this.pregnantMessage = 'When you arrive you will need to sign a waiver form'
  }
  showDocManager(patientId: any) {
    this.commonMethodService.sendDataToDocumentManager(patientId);
    this.isRxDocumentVerify = true;
  }

  ShowWeightAndHeightMessage() {
    let feet = this.psqForm.heightFoot.value ? parseInt(this.psqForm.heightFoot.value.replace('ft', '')) : -1
    let inch = this.psqForm.heightInch.value ? parseInt(this.psqForm.heightInch.value.replace('in', '')) : -1
    let weight = this.psqForm.weight.value ? parseInt(this.psqForm.weight.value) : 0

    if (weight >= 300 && feet < 0 && inch < 0)
      this.weightHeightMessage = 'Ensure facility can accommodate their weight'
    else if (feet >= 5 && inch >= 5 && weight >= 220)
      this.weightHeightMessage = 'Patient might not fit inside MRI, consider scheduling at an open or stand up MRI.'
    else
      this.weightHeightMessage = '';
  }
}
