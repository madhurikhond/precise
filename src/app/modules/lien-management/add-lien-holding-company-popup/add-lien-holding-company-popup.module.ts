import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLienHoldingCompanyPopupComponent } from './add-lien-holding-company-popup.component';
import { SharedModule } from '../../shared/shared.module';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';



@NgModule({
  declarations: [AddLienHoldingCompanyPopupComponent],
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers:[RadPortalService],
  entryComponents: [AddLienHoldingCompanyPopupComponent]
})
export class AddLienHoldingCompanyPopupModule { }
