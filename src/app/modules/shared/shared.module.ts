import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LoaderComponent } from './components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
 import { CKEditorModule } from 'ng2-ckeditor';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { TwoDigitDecimaNumberDirective } from './directives/twodigitdecimalnumber.directive';
import { PlayerTypePipe } from './pipes/player-type.pipe';
import { BookmarkPipe } from './pipes/bookmark.pipe';
import { SqlFieldPipe } from './pipes/bookmark.pipe';
import { DxDataGridModule, DxDateBoxModule, DxSelectBoxModule,DxButtonModule, DxCheckBoxModule, DxTreeViewModule, DxListModule, DxContextMenuModule } from 'devextreme-angular';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PatientDetailComponent } from './components/patient-detail/patient-detail.component';
import { ReferrerDetailComponent } from './components/referrer-detail/referrer-detail.component';
import { ReferrersService } from 'src/app/services/referrers.service';
import { TooltipModule } from 'ng2-tooltip-directive';
import { PhoneNumberFormatePipe } from './pipes/phone-number-formate.pipe';
import { RequestSearchDetailComponent } from './components/request-search-detail/request-search-detail.component';
import { SubsService } from 'src/app/services/subs-service/subs.service';
import { SubsModule } from '../subs/subs.module';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { TaskManagementComponent } from './components/task-management/task-management.component'
import { PatientService } from 'src/app/services/patient/patient.service';
import { TaskManagementService } from 'src/app/services/task-management/task-management.service';
import { SaveSearchComponent } from './components/save-search/save-search.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentManagerComponent } from './components/document-manager/document-manager.component';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { ProgressComponent } from './components/progress/progress.component';
import { FileuploadDirective } from './directives/fileupload.directive';
import { SendDocumentComponent } from './components/send-document/send-document.component';
import { SendDocumentService } from 'src/app/services/send-document-service/Send.document.service';
import { CreateAlertComponent } from './components/create-alert/create-alert.component';
import { NegativeSignRemovePipe } from './pipes/negative-sign-remove.pipe';
import { CurrencyInputDirective } from './directives/currency-input.directive';
import { DocumentReferralAndFundingcoComponent } from './components/document-manager/document-referral-and-fundingco/document-referral-and-fundingco.component';
import { InvalidTabHighlightDirective } from './directives/invalid-tab-highlight.directive';
import { InvalidControlTabContainerDirective } from './directives/invalid-control-tab-container.directive';
import { FilterPipe } from './pipes/filter.pipe';
import { PrescreeningSmallWindowComponent } from './components/prescreening-small-window/prescreening-small-window.component';
import { PrescreengridComponent } from './components/prescreening-small-window/prescreengrid/prescreengrid.component';
import { PrescreeningSmallWindowRoutingModule } from './components/prescreening-small-window/prescreening-small-window-routing.module';
import { PrescreeningSmallWindowModule } from './components/prescreening-small-window/prescreening-small-window.module';
import { FacilityService } from 'src/app/services/facillities/facility.service';
import { BrokerComponent } from '../borker/broker.component';
import { DxAutocompleteModule} from 'devextreme-angular';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { OnlyNumbersWithoutCommaDirective } from './directives/only-numbers-without-comma-directive';
import { DwtComponent } from './components/dwt/dwt.component';
import { CallbackPipe } from './pipes/callback.pipe';
import { SafeurlPipe } from './pipes/safeurl.pipe';
import { DocdwtComponent } from './components/docdwt/docdwt.component';
import { SchdFacilitiesComponent } from '../facillities/facility-management/schd-facilities/schd-facilities.component';
import { DocumentManagerFacilityComponent } from '../facillities/facility-management/document-manager-facility/document-manager-facility.component';

//export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;
const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [LoaderComponent, TwoDigitDecimaNumberDirective,
    PlayerTypePipe, BookmarkPipe, SqlFieldPipe, PatientDetailComponent,
    ReferrerDetailComponent, PhoneNumberFormatePipe, RequestSearchDetailComponent,
    TaskManagementComponent, SaveSearchComponent, DocumentManagerComponent, FileuploadDirective,
    ProgressComponent, SendDocumentComponent, CreateAlertComponent, NegativeSignRemovePipe,
    CurrencyInputDirective, DocumentReferralAndFundingcoComponent, InvalidTabHighlightDirective,
    InvalidControlTabContainerDirective, FilterPipe,PrescreeningSmallWindowComponent,PrescreengridComponent,DocumentManagerFacilityComponent,
    BrokerComponent, OnlyNumbersDirective, OnlyNumbersWithoutCommaDirective, DwtComponent  ,  CallbackPipe,SchdFacilitiesComponent,
    SafeurlPipe,
    DocdwtComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxFileManagerModule,
    DxPopupModule,
    TooltipModule,
    NgxPaginationModule,
    DxAutocompleteModule,
    NgxMaskModule.forRoot(maskConfig),
    NgxDaterangepickerMd.forRoot(),
    PrescreeningSmallWindowRoutingModule,
    CKEditorModule,
    DxCheckBoxModule,
    DxFileManagerModule,
    DxTreeViewModule,
    DxListModule,
    DxContextMenuModule,
  ],
  exports: [
    LoaderComponent,
    PatientDetailComponent,
    ReferrerDetailComponent,
    RequestSearchDetailComponent,
    TaskManagementComponent,
    DocumentManagerComponent,
    SaveSearchComponent,
    CreateAlertComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxPaginationModule,
    NgSelectModule,
    DxDataGridModule,
    DxButtonModule,
    DxDateBoxModule,
    DxSelectBoxModule,
    DxFileManagerModule,
    DxPopupModule,
    TooltipModule,
    NgxMaskModule,
    PlayerTypePipe,
    BookmarkPipe,
    SqlFieldPipe,
    NgbModule,
    PhoneNumberFormatePipe,
    TwoDigitDecimaNumberDirective,
    NgxDaterangepickerMd,
    NegativeSignRemovePipe,
    CurrencyInputDirective,
    DocumentReferralAndFundingcoComponent,
    InvalidTabHighlightDirective,
    InvalidControlTabContainerDirective,
    FilterPipe,
    PrescreengridComponent,
    PrescreeningSmallWindowComponent,
    PrescreeningSmallWindowRoutingModule,
    SchdFacilitiesComponent,
    DocumentManagerFacilityComponent,
    DxFileManagerModule,
    DxTreeViewModule,
    DxListModule,
    DxContextMenuModule,

    PrescreeningSmallWindowRoutingModule,
    DwtComponent,
    DocdwtComponent
  ],
  providers: [PatientService, ReferrersService, SubsService, TaskManagementService, SendDocumentService, CurrencyPipe,FacilityService]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<any> {
    return {
      ngModule: SharedModule
    };
  }
}
