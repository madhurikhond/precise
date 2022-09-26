import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { LienManagementRouterModule } from './lien-management-routing.module';
import { LienManagementComponent } from './lien-management/lien-management.component';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { AddLienHoldingCompanyPopupModule } from './add-lien-holding-company-popup/add-lien-holding-company-popup.module';


@NgModule({
  declarations: [LienManagementComponent],
  imports: [
    CommonModule,
    SharedModule,
    LienManagementRouterModule,
    AddLienHoldingCompanyPopupModule
  ],
  providers:[RadPortalService]
})
export class LienManagementModule { }
