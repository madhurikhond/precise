import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacillitiesRoutingModule } from './facillities-routing.module';
import { MyFacilityComponent } from './my-facility/my-facility.component';
import { SharedModule } from '../shared/shared.module';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { FacilityBillingComponent } from './facility-billing/facility-billing.component';
import { DxDataGridModule, DxCheckBoxModule } from 'devextreme-angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DxFileManagerModule, DxPopupModule, DxDateBoxModule } from 'devextreme-angular';
import { DxTreeViewModule,DxListModule, DxContextMenuModule } from 'devextreme-angular';
import { BlockLeaseSchedulerComponent } from './block-lease-scheduler/block-lease-scheduler.component';
import { CalendarSchedulerComponent } from './block-lease-scheduler/calendar-scheduler/calendar-scheduler.component';
import { SchedulerPopupComponent } from './block-lease-scheduler/calendar-scheduler/scheduler-popup/scheduler-popup.component';
import { ConfirmModalComponent } from './block-lease-scheduler/calendar-scheduler/confirm-modal/confirm-modal.component';
import { CreditReasonsSettingComponent } from './block-lease-scheduler/credit-reasons-settings/credit-reasons-settings.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { PastDateConfirmModalComponent } from './block-lease-scheduler/calendar-scheduler/past-date-confirm-modal/past-date-confirm-modal.component';
import { FacilityEsignComponent } from './block-lease-scheduler/facility-esign/facility-esign.component';
import { EditRecurringEventModalComponent } from './block-lease-scheduler/calendar-scheduler/edit-recurring-event-modal/edit-recurring-event-modal.component';

@NgModule({
  declarations: [MyFacilityComponent, FacilityBillingComponent, BlockLeaseSchedulerComponent, CalendarSchedulerComponent,SchedulerPopupComponent, ConfirmModalComponent, CreditReasonsSettingComponent, PastDateConfirmModalComponent, FacilityEsignComponent, EditRecurringEventModalComponent],
  imports: [
    SharedModule,
    FacillitiesRoutingModule,
    CKEditorModule,
    FormsModule,
    DxDataGridModule,
    DxCheckBoxModule,
    NgxPaginationModule,
    DxFileManagerModule,DxTreeViewModule,DxListModule,DxContextMenuModule,DxDateBoxModule,
    ContextMenuModule.forRoot(),
    SignaturePadModule
  ],  exports: [CalendarSchedulerComponent], providers:[FacilityService]
})
export class FacillitiesModule { }
