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
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';

declare let scheduler: any;

@Component({
    selector: 'app-calendar-scheduler',
    templateUrl: './calendar-scheduler.component.html',
    styleUrls: ['./calendar-scheduler.component.css']
})
export class CalendarSchedulerComponent implements OnInit {
    @ViewChild("scheduler_here", { static: true }) schedulerContainer: ElementRef;
    FacilityName: string = '';
    FacilityID: string = '';
    modalityResourcesList: any[] = [];
    selectedModalityResources: any = [];
    forTimelineList: Array<{ key: number, label: string }> = [];
    bodyRes: any = [];
    SchedulerDayWeekMonth: any = [];
    reasonId: number = 0;
    constructor(private readonly blockLeaseSchedulerService: BlockLeaseSchedulerService,
        private notificationService: NotificationService, private modalService: NgbModal
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

    // testData: any[] = [
    //     {
    //         id: 1,
    //         start_date: '2022-08-10 09:00',
    //         end_date: '2022-08-10 12:00',
    //         text: 'Front-end meeting',
    //         //sections: 1
    //     },
    //     {
    //         id: 2,
    //         start_date: '2022-09-05 10:00',
    //         end_date: '2022-09-06 16:00',
    //         text: 'Feed ducks and city walking',
    //         // sections: 2
    //     },
    //     {
    //         id: 3,
    //         start_date: '2022-09-07 10:00',
    //         end_date: '2022-09-07 14:00',
    //         text: 'Lunch with Ann & Alex',
    //         //sections: 4
    //     },
    //     {
    //         id: 4,
    //         start_date: '2022-07-20 16:00',
    //         end_date: '2022-07-20 17:00',
    //         text: 'World Darts Championship (morning session)',
    //         //sections: 5
    //     },
    //     {
    //         id: 5,
    //         start_date: '2020-07-22 12:00',
    //         end_date: '2020-07-22 20:00',
    //         text: 'Design workshop',
    //         //sections: 6
    //     },
    //     {
    //         id: 6,
    //         start_date: '2022-08-04 14:30',
    //         end_date: '2022-08-04 16:00',
    //         text: 'World Darts Championship (evening session)',
    //         //sections: 7
    //     }
    // ];

    elements = [ // original hierarhical array to display
        {
            key: 10, label: "Web Testing Dep.", open: true, children: [
                { key: 20, label: "Elizabeth Taylor" },
                {
                    key: 30, label: "Managers", children: [
                        { key: 40, label: "John Williams" },
                        { key: 50, label: "David Miller" }
                    ]
                },
                { key: 60, label: "Linda Brown" },
                { key: 70, label: "George Lucas" }
            ]
        },
        {
            key: 110, label: "Human Dep.", open: true, children: [
                { key: 80, label: "Kate Moss" },
                { key: 90, label: "Dian Fossey" }
            ]
        }
    ];
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
        //scheduler.load("../common/events.json")
        //console.log(JSON.stringify(this.testData));
        //scheduler.load(JSON.stringify(this.testData));
        // scheduler.locale.labels.timeline_tab ="Timeline";
        scheduler.date.timeline_start = scheduler.date.week_start;
        scheduler.plugins({
            multisection: true,
            timeline: true,
            // treetimeline: true,
            // daytimeline: true,
            multiselect: true,
        });
        scheduler.config.multisection = true;
        scheduler.templates.event_class = function (start, end, event) {
            var css = "";
            if (event.ModalityType) // if event has subject property then special class should be assigned
                css += "section_" + event.ModalityType;
            return css; // default return
        };



        var sections: any[] = [{
            "resourceId": 62, "label": "CT With Contrast",
            "children": [{ "key": "46", "label": "CT With Contrast" }]
        }, {
            "resourceId": 61, "label": "MRI With Contrast",
            "children": [{ "key": "45", "label": "MRI With Contrast" }]
        }];
        // var sections: any[] =[
        //     {key: 1, label: "James Smith"},
        //     {key: 2, label: "John Williams"},
        //     {key: 3, label: "David Miller"},
        //     {key: 4, label: "Linda Brown"}
        // ]
        console.log(this.forTimelineList);
        console.log(sections);
        scheduler.createTimelineView({
            name: "timeline",
            x_unit: "hour",
            x_date: "%H:%i",
            x_step: 8,
            x_size: 33,
            x_length: 33,
            event_dy: 60,
            resize_events: false,
            y_unit: this.forTimelineList,
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

        // scheduler.attachEvent("onBeforeDrag", function (id, mode, e) {
        //     // store all initial dates
        //     if (mode == "move") {
        //         dragStartDate = new Date(scheduler.getEvent(id).start_date);
        //         var selectedEvents = this.getSelectedIds();
        //         if (Array.isArray(selectedEvents)) {
        //             selectedEvents.forEach(function (id) {
        //                 var event = scheduler.getEvent(id);
        //                 alert('in');
        //                 initialDates[id] = {
        //                     start_date: new Date(event.start_date),
        //                     end_date: new Date(event.end_date)
        //                 };
        //             });
        //         }
        //     }
        //     return true;
        // });

        // scheduler.templates.event_class = function (start, end, event) {
        //     console.log("section_" + event.ModalityType);
        //     var original = scheduler.getEvent(event.id);
        //     if (!scheduler.isMultisectionEvent(original))
        //         return "";
        //     return "multisection section_" + event.ModalityType;
        // };

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
                    alert('in');
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
            this.openConfirm(id);
        };
        // scheduler.attachEvent("onDragEnd", function (id, mode, e) {
        //     if (mode == "move") {
        //         var selectedEvents = this.getSelectedIds();

        //         if (scheduler.getEvent(id).start_date.valueOf() == dragStartDate.valueOf()) {
        //             // if the main event position hasn't changed after drag and drop,
        //             // it may mean that dnd was canceled and we must revert changes to the selected events
        //             var selectedEvents = this.getSelectedIds();
        //             selectedEvents.forEach(function (selectedId) {
        //                 if (selectedId == id) {
        //                     return;
        //                 }
        //                 var event = scheduler.getEvent(selectedId);
        //                 alert('in');
        //                 event.start_date = new Date(initialDates[selectedId].start_date);
        //                 event.end_date = new Date(initialDates[selectedId].end_date);
        //                 scheduler.updateEvent(selectedId);
        //             });
        //         } else {
        //             // changes were applied, trigger data save for all dragged events
        //             selectedEvents.forEach(function (selectedId) {
        //                 if (selectedId == id) {
        //                     return;
        //                 }
        //                 scheduler.addEvent(scheduler.getEvent(id));
        //             });
        //         }
        //     }
        //     return true;
        // });

        scheduler.date.timeline_start = scheduler.date.day_start;
        scheduler.createUnitsView({
            name: "unit",
            property: "section_id",
            list: this.elements
        });
        scheduler.showLightbox = (id: any) => {
            const event = scheduler.getEvent(id);
            var currentDate = new Date();           
            if (event.start_date.toLocaleDateString() < currentDate.toLocaleDateString()) {
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
    }
    openConfirm(id: number) {
        const modalRef = this.modalService.open(ConfirmModalComponent, { centered: true, backdrop: 'static', size: 'sm', windowClass: 'modal fade modal-theme in modal-small' });
        modalRef.componentInstance.deleted.subscribe(() => this.delete(id));
        modalRef.result.then().catch((reason: ModalResult | any) => {
            // if (this.isError(reason)) {
            //   console.error(reason);
            // }
        });
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
        modalRef.componentInstance.deleted.subscribe(() => this.openConfirm(event.id));
        modalRef.result
            .then()
            .catch((reason: ModalResult | any) => {
                if ((reason == 5)) {
                    this.reasonId = 5;
                    this.GetBlockLeaseData();
                }
                if ((reason == 4)) {
                    scheduler.endLightbox(false, null)
                }
                else if ((reason == 3 || reason == 6)) {
                    scheduler.deleteEvent(event.id);
                }
                this.backToCalendar();
            })
        //.finally(() => scheduler.endLightbox(false, null));
    }
    backToCalendar() {
        const elm = document.querySelector<HTMLElement>('.dhx_cal_cover')!;
        elm.style.display = 'none';
        scheduler.lightbox.close();
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
        this.SchedulerDayWeekMonth = []; this.forTimelineList = [];
        this.blockLeaseSchedulerService.getBlockLeaseData(true, this.FacilityID).subscribe((res) => {
            this.SchedulerDayWeekMonth = res.response[0].BlockLeases;
            var forTimelineView = res.response[0].ModalityResources;
            if (forTimelineView) {
                if (forTimelineView.length > 0) {
                    for (let i = 0; i < forTimelineView.length; i++) {
                        if (forTimelineView[i].Contrast.toLocaleLowerCase() == 'w') {
                            this.forTimelineList.push({ key: i + 1, label: forTimelineView[i].ModalityType + ' with contrast' });

                        } else {
                            this.forTimelineList.push({ key: i + 1, label: forTimelineView[i].ModalityType + ' without contrast' });
                        }
                        for (let j = 0; j < forTimelineView[i].BlockLeases.length; j++) {
                            this.SchedulerDayWeekMonth.filter(a => a.LeaseId == forTimelineView[i].BlockLeases[j].LeaseId)[0].key = i + 1;
                        }
                    }
                }
            }
            scheduler.clearAll();
            if (this.reasonId == 5) {
                scheduler.parse(JSON.stringify(this.SchedulerDayWeekMonth), "json");
            } else {
                this.schedulerLoad();
            }
        }, (err: any) => {
            this.errorNotification(err);
        });
    }
    errorNotification(err: any) {
        this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
        });
    }
}

