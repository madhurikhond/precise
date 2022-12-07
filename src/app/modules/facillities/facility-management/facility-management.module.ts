import { NgModule } from '@angular/core';
import { FacilityManagementRoutingModule } from './facility-management-routing.module';
import { ParentCompComponent } from './parent-comp/parent-comp.component';
import { SharedModule } from '../../shared/shared.module';
import { FacilityManagementComponent } from './facility-management.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
import { DxAutocompleteModule, DxButtonModule } from 'devextreme-angular';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { DxTreeViewModule,DxListModule, DxContextMenuModule } from 'devextreme-angular';
import { PayInvoiceModalComponent } from './schd-facilities/pay-invoice-modal/pay-invoice-modal.component';

// const maskConfig: Partial<IConfig> = {
//   validation: false,
// };
@NgModule({
  declarations: [ ParentCompComponent,FacilityManagementComponent,PayInvoiceModalComponent],
  imports: [
    CKEditorModule,
    SharedModule,
    FormsModule,
    FacilityManagementRoutingModule,
    DxButtonModule,
    DxAutocompleteModule,
    DxFileManagerModule,DxTreeViewModule,DxListModule,DxContextMenuModule,
    ContextMenuModule.forRoot(),
  ]
})
export class FacilityManagementModule { }
