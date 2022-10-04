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

declare let scheduler: any;

@Component({
    selector: 'app-calendar-scheduler',
    templateUrl: './calendar-scheduler.component.html',
    styleUrls: ['./calendar-scheduler.component.css']
})
export class CalendarSchedulerComponent implements OnInit {
    @ViewChild("scheduler_here", { static: true }) schedulerContainer: ElementRef;
    @ViewChild('f', { static: true }) f: NgForm | any;
    model: any = { signature: '' };
    @ViewChild(SignaturePad) signaturePad: SignaturePad;
    signaturePadOptions: Object = { // passed through to szimek/signature_pad constructor
        'minWidth': 2,
        pecColor: 'rgb(66,133,244)',
        backgroundcolor: 'rgb(255,255,255)',
        canvasWidth: 750,
        canvasHeight: 200
    };
    FacilityName: string = '';
    FacilityID: string = '';
    TotalLeaseHours: string;
    modalityResourcesList: any[] = [];
    selectedModalityResources: any = [];
    forTimelineList: Array<{ key: number, label: string }> = [];
    bodyRes: any = [];
    SchedulerDayWeekMonth: any = [];
    allClosedDays: any = [];
    reasonId: number = 0;
    constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
        private notificationService: NotificationService, private modalService: NgbModal,
        private readonly storageService: StorageService
    ) {
        blockLeaseSchedulerService.sendDataToCalendarScheduler.subscribe(res => {
            if (res) {
                this.bodyRes = res;
                this.FacilityName = res.FacilityName;
                this.FacilityID = res.FacilityID;
                this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
                setTimeout(() => {
                    this.GetBlockLeaseData();
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
            if ((startDate < current_Date) && event.LeaseBlockId == undefined) {
                const modalRef = this.modalService.open(PastDateConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
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

        };
        scheduler.init(this.schedulerContainer.nativeElement, new Date(), 'week');
        scheduler.parse(JSON.stringify(this.SchedulerDayWeekMonth));
        let displayClosedDays = [];
        if (this.allClosedDays) {
            this.allClosedDays.forEach(element => {
                displayClosedDays.push(WeekDay[element.Day]);
            });
            scheduler.addMarkedTimespan({
                days: displayClosedDays,
                zones: "fullday",
                css: "addMarked"
            });
            scheduler.updateView();
        }
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
                    this.GetBlockLeaseData();
                    this.backToCalendar();
                }
                if ((reason == 4)) {
                    scheduler.endLightbox(false, null);
                    this.backToCalendar();
                }
                else if ((reason == 3 || reason == 6)) {
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
        this.SchedulerDayWeekMonth = []; this.forTimelineList = []; this.allClosedDays = [];
        this.blockLeaseSchedulerService.getBlockLeaseData(true, this.FacilityID).subscribe((res) => {
            if (res.response[0].BlockLeases)
                this.SchedulerDayWeekMonth = res.response[0].BlockLeases;
            if (res.response[0].AllClosedDays)
                this.allClosedDays = res.response[0].AllClosedDays;
            if (res.response[0].ModalityResources)
                var forTimelineView = res.response[0].ModalityResources;
            if (res.response[0].TotalLeasedHours) {
                this.TotalLeaseHours = JSON.parse(res.response[0].TotalLeasedHours).TotalLeaseHours;
                if (this.TotalLeaseHours == '00:') {
                    this.TotalLeaseHours = '';
                }
            }
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
            if (this.reasonId == 5) {
                scheduler.parse(JSON.stringify(this.SchedulerDayWeekMonth), "json");
                scheduler.updateCollection("sections", this.forTimelineList);

            } else {
                this.schedulerLoad();
            }
        }, (err: any) => {
            this.errorNotification(err);
        });

    }
    clearSign(): void {
        this.signaturePad.clear();
        this.model.signature = '';
    }
    drawComplete() {
        this.model.signature = this.signaturePad.toDataURL();
    }
    signConfirm(isConfirmSign: boolean) {
        this.f.resetForm();
        this.signaturePad.clear();
        this.model.signature = '';
    }
    confirmBlockToLease(defaultSign: boolean, body: any = '') {
        this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
        if (defaultSign) {
            body = {
                FacilityID: this.FacilityID
            }
        }
        this.blockLeaseSchedulerService.approveAndSendLeaseToFacility(true, body).subscribe((res) => {
            if (res.response) {
                if (res.responseCode == 200) {
                    this.notificationService.showNotification({
                        alertHeader: 'Success',
                        alertMessage: res.response.message,
                        alertType: res.response.ResponseCode
                    })
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
                'DefaultSign': this.model.signature
            }
            this.confirmBlockToLease(false, data)
            this.f.submitted = false;
        }
    }
    errorNotification(err: any) {
        this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
        });
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

