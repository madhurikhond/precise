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
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { DxTreeViewModule,DxListModule, DxContextMenuModule } from 'devextreme-angular';
import { FrontDeskPortalComponent } from './facility-billing/front-desk-portal.component';
@NgModule({
  declarations: [MyFacilityComponent, FacilityBillingComponent,FrontDeskPortalComponent],
  imports: [
    SharedModule,
    FacillitiesRoutingModule,
    CKEditorModule,
    FormsModule,
    DxDataGridModule,
    DxCheckBoxModule,
    NgxPaginationModule,
 
    ContextMenuModule.forRoot()
  ], providers:[FacilityService],
  exports:[
   
  ]
})
export class FacillitiesModule { }
