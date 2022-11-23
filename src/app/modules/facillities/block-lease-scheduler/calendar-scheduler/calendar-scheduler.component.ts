import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from 'src/app/services/common/notification.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchedulerPopupComponent } from './scheduler-popup/scheduler-popup.component';
import { ModalResult } from 'src/app/models/enums';
import 'dhtmlx-scheduler';
import { BlockLeaseSchedulerService } from 'src/app/services/block-lease-scheduler-service/block-lease-scheduler.service';
import {
    DxDateBoxModule
} from 'devextreme-angular';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { PastDateConfirmModalComponent } from './past-date-confirm-modal/past-date-confirm-modal.component';
import { SignaturePad } from 'angular2-signaturepad';
import { NgForm } from '@angular/forms';
import { StorageService } from 'src/app/services/common/storage.service';
import { DatePipe } from '@angular/common';
import { CommonMethodService } from '../../../../services/common/common-method.service';

declare let scheduler: any;

@Component({
    selector: 'app-calendar-scheduler',
    templateUrl: './calendar-scheduler.component.html',
    styleUrls: ['./calendar-scheduler.component.css']
})
export class CalendarSchedulerComponent implements OnInit {
    @ViewChild('validatedefaultsign', { static: true }) validatedefaultsign: ElementRef;
    @ViewChild("scheduler_here", { static: true }) schedulerContainer: ElementRef;
    @ViewChild('frmCal', { static: true }) f: NgForm | any;
    @ViewChild('approveAddEsignFrom', { static: true }) ff: NgForm | any;
    @ViewChild("modaldismiss1", { static: true }) modaldismiss1: ElementRef;
    @ViewChild("modaldismiss2", { static: true }) modaldismiss2: ElementRef;
    @ViewChild("modaldismissscheduler", { static: true }) modaldismissscheduler: ElementRef;
    model: any = { firstName: '', lastName: '', Title: '', signature: '' };
    approveAddEsignModel: any = { firstName: '', lastName: '', Title: '', signature: '' };
    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    @ViewChild(SignaturePad) signaturePadapproveAddEsignModel: SignaturePad;
    signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
        'minWidth': 2,
        pecColor: 'rgb(66,133,244)',
        backgroundcolor: 'rgb(255,255,255)',
        canvasWidth: 750,
        canvasHeight: 200
    };
    readOnlyCalender: boolean = false;
    FacilityName: string = '';
    FacilityID: string = '';
    modalityResourcesList: any[] = [];
    selectedModalityResources: any = [];
    forTimelineList: Array<{ key: number, label: string }> = [];
    bodyRes: any = [];
    SchedulerDayWeekMonth: any = [];
    autoBlockOffDays: any = [];
    allClosedDays: any = [];
    reasonId: number = 0;
    FACILITY_NAME: string;
    approveGoToNext: boolean = false;
    isDefaultSign: any;
    approveAllCheckForButton: boolean = false;
    otherFacilitiesParsed: any = [];
    ParentCompanyName: string;
    displayClosedDays = [];
    isDisplayApproveBtn: any;

    latestStartDate: any = "";
    latestSchedulerMode: string = "";
    constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
        private notificationService: NotificationService, private modalService: NgbModal,
        private readonly storageService: StorageService, private datePipe: DatePipe,
        private readonly commonService: CommonMethodService
    ) {
        blockLeaseSchedulerService.sendDataToCalendarScheduler.subscribe(res => {
            if (res) {
                this.bodyRes = res;
                this.FacilityName = res.FacilityName;
                this.FacilityID = res.FacilityID;
                this.readOnlyCalender = res.fromSchedulingFacility;
                this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
                setTimeout(() => {
                    this.GetBlockLeaseData();
                    this.approveAllCheckForButton = false;
                    this.GetAllParentFacilitiesByFacilityId();
                }, 200);
            }
        });

    }
    selectedEvents: any;
    spanID: number = 0;

    ngOnInit(): void {
        // this.schedulerLoad();
    }
    schedulerLoad() {
        scheduler.skin = 'material';
        scheduler.config.xml_date = '%Y-%m-%d';
        scheduler.config.limit_time_select = true;
        scheduler.config.details_on_create = true;
        scheduler.config.details_on_dblclick = true;
        scheduler.config.icons_select = ['icon_details', 'icon_delete'];
        // scheduler.config.first_hour = 7;
        scheduler.config.now_date = new Date();
        if (this.readOnlyCalender == true) {
            scheduler.config.readonly = true;
        }
        var d = new Date(Date());
        d.setMonth(d.getMonth() - 1);
        scheduler.plugins({
            minical: true,
            treetimeline: true,
            limit: true,
            units: true,
            serialize: true,
            year_view: true,
            agenda_view: true,
        });
        scheduler.date.timeline_start = scheduler.date.week_start;
        scheduler.plugins({
            multisection: true,
            timeline: true,
            multiselect: true,
        });
        scheduler.config.multisection = true;
        scheduler.templates.event_class = function (start, end, event) {
            var css = "";
            if (event.ModalityType) // if event has subject property then special class should be assigned
                css += "section_" + event.ModalityType;
            return css; // default return
        };
        scheduler.serverList("sections", this.forTimelineList);
        scheduler.createTimelineView({
            name: "timeline",
            x_unit: "hour",
            x_date: "%H:%i",
            x_step: 8,
            x_size: 33,
            x_length: 33,
            event_dy: 60,
            resize_events: false,
            // y_unit: this.forTimelineList,
            y_unit: scheduler.serverList("sections"),
            y_property: "key",
            render: "bar",
            second_scale: {
                x_unit: "day", // unit which should be used for second scale
                x_date: "%F %d" // date format which should be used for second scale, "July 01"
            }
        });
        var dragStartDate = null;

        // and store initial dates of all moved events, so we could revert drag and drop if it's canceled from "onBeforeEventChange" 
        var initialDates = {};
        scheduler.attachEvent("onEventDrag", function (id, mode, e) {
            if (mode == "move") {
                // calculate the date change so far
                var shift = scheduler.getEvent(id).start_date - dragStartDate;
                var selectedEvents = this.getSelectedIds();
                selectedEvents.forEach(function (selectedId) {
                    if (selectedId == id) {
                        return;
                    }
                    // and move all selected events by the same value                   
                    var event = scheduler.getEvent(selectedId);
                    console.log(initialDates[selectedId]);
                    event.start_date = new Date(initialDates[selectedId].start_date.valueOf() + shift);
                    event.end_date = new Date(initialDates[selectedId].end_date.valueOf() + shift);
                    // call udpateEvent in order to repaint connected events
                    scheduler.updateEvent(selectedId);
                });
            }
            return true;
        });

        scheduler._click.buttons.delete = (id: number) => {
            //lease signed 
            this.openConfirm(id);
        };
        scheduler.date.timeline_start = scheduler.date.day_start;

        scheduler.showLightbox = (id: any) => {
            const event = scheduler.getEvent(id);
            var currentDate = new Date();
            const current_Date = new Date(currentDate.toLocaleDateString());
            const startDate = new Date(event.start_date.toLocaleDateString());

            console.log(event.start_date);
            console.log(event.end_date);

            event.end_date = new Date(event.end_date - 1);
            if ((startDate < current_Date) && event.LeaseBlockId == undefined) {
                const modalRef = this.modalService.open(PastDateConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
                modalRef.componentInstance.isPastDateOrOffDays = false;
                modalRef.result.then().catch((reason: ModalResult | any) => {
                    if (reason == 5) {
                        this.checkBlockedOffDays(event, id);
                        //scheduler.startLightbox(id, this.openForm(event));

                    } else {
                        scheduler.deleteEvent(event.id);
                    }
                });
            } else {
                this.checkBlockedOffDays(event, id);
                //scheduler.startLightbox(id, this.openForm(event));
            }

        };


        if (this.latestStartDate && this.latestSchedulerMode) {
            scheduler.init(this.schedulerContainer.nativeElement, this.latestStartDate, this.latestSchedulerMode);
        } else {
            scheduler.init(this.schedulerContainer.nativeElement, new Date(), 'week');
        }

        scheduler.deleteMarkedTimespan();
        scheduler.parse(JSON.stringify(this.SchedulerDayWeekMonth));
        this.displayClosedDays = [];
        if (this.allClosedDays) {
            this.allClosedDays.forEach(element => {
                this.displayClosedDays.push(WeekDay[element.Day]);
            });
            scheduler.addMarkedTimespan({
                days: this.displayClosedDays,
                zones: "fullday",
                css: "addMarked"
            });
            scheduler.updateView();
        }
        for (let i = 0; i < this.autoBlockOffDays.length; i++) {
            scheduler.addMarkedTimespan({
                start_date: new Date(this.autoBlockOffDays[i].startDate),
                end_date: new Date(this.autoBlockOffDays[i].EndDate),
                css: "addMarked"

            });
        }

        //// Malhar
        const currentDate = new Date();
        const day = currentDate && currentDate.getDate() || -1;
        const dayWithZero = day.toString().length > 1 ? day : '0' + day;
        const month = currentDate && currentDate.getMonth() + 1 || -1;
        const monthWithZero = month.toString().length > 1 ? month : '0' + month;
        const year = currentDate && currentDate.getFullYear() || -1;

        var dayCountOfWeek = currentDate.getDay();
        var finalDate = `${dayWithZero}-${monthWithZero}-${year}`;

        scheduler.addMarkedTimespan({
            start_time: finalDate,
            end_time: finalDate,
            css: "scheduleTime"
        });
        ////
        scheduler.updateView();
    }
    resetDate() {
        this.latestSchedulerMode = "";
        this.latestStartDate = "";
    }
    checkBlockedOffDays(event: any, id: number) {
        let body =
        {
            'facilityId': this.FacilityID,
            'startDate': this.datePipe.transform(event.start_date, 'yyyy-MM-dd'),
            'endDate': this.datePipe.transform(event.end_date, 'yyyy-MM-dd'),
            'startTime': this.getTwentyFourHourTime(event.start_date.toLocaleTimeString('en-US')),
            'endTime': this.getTwentyFourHourTime(event.end_date.toLocaleTimeString('en-US')),
            'modality': null,
            'resourceId': 0
        }

        this.blockLeaseSchedulerService.getAlreadyBlockedOffDays(true, body).subscribe((res) => {
            if (!this.displayClosedDays.includes(event._sday + 1)) {
                if (res.response) {

                    const modalRef = this.modalService.open(PastDateConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
                    modalRef.componentInstance.isPastDateOrOffDays = true;
                    modalRef.result.then().catch((reason: ModalResult | any) => {
                        if (reason == 5) {
                            scheduler.startLightbox(id, this.openForm(event));
                        } else {
                            scheduler.deleteEvent(event.id);
                        }
                    });
                } else {
                    scheduler.startLightbox(id, this.openForm(event));
                }
            } else {
                const modalRef = this.modalService.open(PastDateConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
                modalRef.componentInstance.isPastDateOrOffDays = true;
                modalRef.result.then().catch((reason: ModalResult | any) => {
                    if (reason == 5) {
                        scheduler.startLightbox(id, this.openForm(event));
                    } else {
                        scheduler.deleteEvent(event.id);
                    }
                });
            }

        }, (err: any) => {
            this.errorNotification(err);
        });
    }

    openConfirm(id: number) {
        const event = scheduler.getEvent(id);
        if (event.LeaseBlockId != undefined) {
            const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
            modalRef.componentInstance.LeaseBlockId = event.LeaseBlockId;
            modalRef.result
                .then()
                .catch((reason: ModalResult | any) => {
                    if ((reason == 6)) {
                        scheduler.deleteEvent(event.id);
                    }
                    this.backToCalendar();
                })
        }

    }
    delete(id: number) {
        scheduler.deleteEvent(id);
    }
    getSelectedIds() {
        var res = [];
        for (var i in this.selectedEvents) {
            res.push(i);
        }
        return res;
    }
    openCancel(id: number) {

    }
    openForm(event: any) {
        const modalRef = this.modalService.open(SchedulerPopupComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
        modalRef.componentInstance.isNew = scheduler.getState().new_event;
        modalRef.componentInstance.mode = scheduler.getState().mode;
        modalRef.componentInstance.event = event;
        modalRef.componentInstance.data = this.bodyRes;
        // modalRef.componentInstance.deleted.subscribe(() => this.openConfirm(event.id));
        modalRef.result
            .then()
            .catch((reason: ModalResult | any) => {
                if ((reason == 5)) {
                    this.reasonId = 5;
                    this.latestStartDate = event.start_date;
                    this.latestSchedulerMode = scheduler.getState().mode;
                    this.GetBlockLeaseData();
                    this.backToCalendar();
                }
                if ((reason == 4)) {
                    scheduler.endLightbox(false, null);
                    this.backToCalendar();
                }
                else if ((reason == 3 || reason == 6 || reason == 2)) {
                    scheduler.deleteEvent(event.id);
                    this.GetBlockLeaseData();
                    this.backToCalendar();
                }
            })

    }
    backToCalendar() {
        const elm = document.querySelector<HTMLElement>('.dhx_cal_cover')!;
        elm.style.display = 'none';
        //scheduler.lightbox.close();
    }
    show_minical() {
        if (scheduler.isCalendarVisible()) {
            scheduler.destroyCalendar();
        } else {
            scheduler.renderCalendar({
                position: "dhx_minical_icon",
                date: scheduler._date,
                navigation: true,
                handler: function (date, calendar) {
                    scheduler.setCurrentView(date);
                    scheduler.destroyCalendar()
                }
            });
        }
    }
    GetBlockLeaseData() {
        var userID = this.storageService.user.UserId
        this.SchedulerDayWeekMonth = []; this.forTimelineList = []; this.allClosedDays = [];
        this.blockLeaseSchedulerService.getBlockLeaseData(true, this.FacilityID, userID).subscribe((res) => {
            if (res.response)
                this.isDefaultSign = res.response[0].IsDefaultEsign ? res.response[0].IsDefaultEsign : 0
            if (res.response[0].BlockLeases)
                this.SchedulerDayWeekMonth = res.response[0].BlockLeases;
            if (res.response[0].AllClosedDays)
                this.allClosedDays = res.response[0].AllClosedDays;
            if (res.response[0].ModalityResources)
                var forTimelineView = res.response[0].ModalityResources;
            if (res.response[0].AutoBlockOffDays)
                this.autoBlockOffDays = res.response[0].AutoBlockOffDays;

            if (this.SchedulerDayWeekMonth) {
                this.isDisplayApproveBtn = (this.SchedulerDayWeekMonth.filter(dta => dta.LeaseId == null).length > 0) ? false : true;
            }
            console.log(this.autoBlockOffDays);

            if (forTimelineView && this.SchedulerDayWeekMonth) {
                if (forTimelineView.length > 0) {
                    for (let i = 0; i < forTimelineView.length; i++) {
                        if (forTimelineView[i].Contrast.toLocaleLowerCase() == 'w') {
                            this.forTimelineList.push({ key: i + 1, label: forTimelineView[i].ModalityType + ' w/ contrast- ' + forTimelineView[i].RESOURCENAME });

                        } else {
                            this.forTimelineList.push({ key: i + 1, label: forTimelineView[i].ModalityType + ' w/o Contrast- ' + forTimelineView[i].RESOURCENAME });
                        }
                        if (forTimelineView[i].BlockLeases) {
                            for (let j = 0; j < forTimelineView[i].BlockLeases.length; j++) {
                                this.SchedulerDayWeekMonth.filter(a => a.LeaseBlockId == forTimelineView[i].BlockLeases[j].LeaseBlockId)[0].key = i + 1;
                            }
                        }
                    }
                }
            }
            scheduler.clearAll();
            this.schedulerLoad();
            // if (this.reasonId == 5) {
            //     //scheduler.parse(JSON.stringify(this.SchedulerDayWeekMonth), "json");
            //     //scheduler.updateCollection("sections", this.forTimelineList);
            //     this.schedulerLoad();

            // } else {
            //     this.schedulerLoad();
            // }
        }, (err: any) => {
            this.errorNotification(err);
        });

    }
    GetAllParentFacilitiesByFacilityId() {
        var otherFacilities: any = [];
        this.approveGoToNext = false;
        this.blockLeaseSchedulerService.getAllParentFacilitiesByFacilityId(true, this.FacilityID).subscribe((res) => {
            if (res.response.OtherFacilities) {
                this.ParentCompanyName = res.response.ParentCompanyName;
                this.otherFacilitiesParsed = JSON.parse(res.response.OtherFacilities);
                if (this.otherFacilitiesParsed.length > 0) {
                    this.approveGoToNext = true;
                    var FACILITY_Data = this.otherFacilitiesParsed.find((x) => x.FacilityName == this.FacilityName);
                    let otherFacilitIndex = this.otherFacilitiesParsed.findIndex((x) => x.FacilityName == this.FacilityName);
                    if (otherFacilitIndex !== 0) {
                        this.FACILITY_NAME = this.otherFacilitiesParsed[0].FacilityName;
                    }
                    else {
                        this.FACILITY_NAME = this.otherFacilitiesParsed[1].FacilityName;
                    }
                    delete this.otherFacilitiesParsed[otherFacilitIndex];
                }

            }
        });
    }
    ApprovedGoNext() {
        this.FacilityID = this.otherFacilitiesParsed[0].FacilityId;
        this.FacilityName = this.otherFacilitiesParsed[0].FacilityName;
        this.bodyRes = {
            'FacilityID': this.FacilityID,
            'FacilityName': this.FacilityName,
            'fromSchedulingFacility':false
        }
        this.GetBlockLeaseData();
        let otherFacilitIndex = this.otherFacilitiesParsed.findIndex((x) => x.FacilityName == this.FACILITY_NAME);
        delete this.otherFacilitiesParsed[otherFacilitIndex];
        if (this.otherFacilitiesParsed[0]) {
            this.FACILITY_NAME = this.otherFacilitiesParsed[0].FacilityName;
            this.approveGoToNext = true;
        }
        else {
            this.approveGoToNext = false;
            this.approveAllCheckForButton = true;
        }
    }
    clearSign(): void {
        this.signaturePad.clear();
        this.model.signature = '';
    }
    clearSignApproveAddEsign(): void {
        this.signaturePadapproveAddEsignModel.clear();
        this.approveAddEsignModel.signature = '';
    }
    drawComplete() {
        this.model.signature = this.signaturePad.toDataURL();
    }
    drawCompleteapproveAddEsign() {
        this.approveAddEsignModel.signature = this.signaturePadapproveAddEsignModel.toDataURL();
    }
    signConfirm(isConfirmSign: boolean) {
        this.f.resetForm();
        this.signaturePad.clear();
        this.model.signature = '';
        this.model.firstName = '';
        this.model.lastName = '';
        this.model.Title = '';
    }
    approveAddEsignModelConfirm(isConfirmSign: boolean) {
        this.ff.resetForm();
        this.signaturePad.clear();
        this.approveAddEsignModel.signature = '';
        this.approveAddEsignModel.firstName = '';
        this.approveAddEsignModel.lastName = '';
        this.approveAddEsignModel.Title = '';
    }
    confirmBlockToLease(defaultSign: boolean, body: any = '') {
        if (this.isDefaultSign == 0 && body === '' && defaultSign) {
            this.validatedefaultsign.nativeElement.click();
            return;
        }
        this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
        if (defaultSign) {
            body = {
                FacilityID: this.FacilityID,
                IsDefaultSign: defaultSign
            }
        }
        this.blockLeaseSchedulerService.approveAndSendLeaseToFacility(true, body).subscribe((res) => {
            if (res.response) {
                if (res.responseCode == 200 || res.response.ResponseCode==200) {
                    this.notificationService.showNotification({
                        alertHeader: 'Success',
                        alertMessage:  res.response.message? res.response.message: res.response,
                        alertType: 200
                    })
                    this.signConfirm(false);
                    this.modaldismiss2.nativeElement.click();
                    this.modaldismissscheduler.nativeElement.click();
                    this.commonService.sendDataBlockLeaseScheduler('true');
                }
                else{
                    this.errorNotification(res);
                }
            }
        }, (err: any) => {
            this.errorNotification(err);
        });

    }
    submitSign(isItemSign: boolean) {
        if (this.model.signature == '') {
            return;
        }
        if (this.f.valid) {
            let data = {
                'FacilityID': this.FacilityID,
                'UserId': this.storageService.user.UserId,
                'PreciseSignature': this.model.signature,
                'PreciseUserTitle': this.model.Title,
                'PreciseUserFirstName': this.model.firstName,
                'PreciseUserLastName': this.model.lastName,
            }

            this.confirmBlockToLease(false, data)
            this.f.submitted = false;
        }
    }

    ApproveSubmitSign(isItemSign: boolean) {
        if (this.approveAddEsignModel.signature == '') {
            return;
        }
        if (this.ff.valid) {
            let data = {
                'FacilityID': this.FacilityID,
                'UserId': this.storageService.user.UserId,
                'DefaultSign': this.approveAddEsignModel.signature ?? 0,
                'PreciseUserTitle': this.approveAddEsignModel.Title,
                'PreciseUserFirstName': this.approveAddEsignModel.firstName,
                'PreciseUserLastName': this.approveAddEsignModel.lastName,
                'PreciseSignature': this.approveAddEsignModel.signature,
            }

            this.approveAllParentToLease(false, data)
            this.ff.submitted = false;
        }
    }

    errorNotification(err: any) {
        this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
        });
    }
    approveAllParentToLease(defaultSign: boolean, body: any = '') {
        if (this.isDefaultSign == 0 && body === '' && defaultSign) {
            this.validatedefaultsign.nativeElement.click();
            return;
        }
        this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
        if (defaultSign) {
            body = {
                FacilityID: this.FacilityID
            }
        }
        this.blockLeaseSchedulerService.ApproveAndSendLeaseToFacilityToAll(true, body).subscribe((res) => {
            if (res.response) {
                if (res.responseCode === 200) {

                    this.notificationService.showNotification({
                        alertHeader: 'Success',
                        alertMessage: res.response.message,
                        alertType: res.response.ResponseCode
                    })
                    this.signConfirm(false);
                    this.modaldismiss1.nativeElement.click();
                    this.modaldismissscheduler.nativeElement.click();
                    this.commonService.sendDataBlockLeaseScheduler('true');
                }
                else {
                    this.errorNotification(res.message);
                }
            }
        }, (err: any) => {
            this.errorNotification(err);
        });



    }
    getTwentyFourHourTime(time) {
        let hours = Number(time.match(/^(\d+)/)[1]);
        const minutes = Number(time.match(/:(\d+)/)[1]);
        const AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && Number(hours) < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        let sHours = hours.toString();
        let sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        return `${sHours} : ${sMinutes}`;
    }
}

export enum WeekDay {
    sunday = 0,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday
}

