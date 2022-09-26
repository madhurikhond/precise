import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ReadingRadPortaRoutingModule } from './reading-rad-portal-routing.module';
import { ReadingRadPortalComponent } from './reading-rad-portal/reading-rad-portal.component';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';
import { GenerateBillAndSellLienPopupModule } from './generate-bill-and-sell-lien-popup/generate-bill-and-sell-lien-popup.module';
import { GenerateBillAndHoldLienModule } from './generate-bill-and-hold-lien/generate-bill-and-hold-lien.module';

@NgModule({
  declarations: [ReadingRadPortalComponent,],
  imports: [
    CommonModule,
    SharedModule,
    ReadingRadPortaRoutingModule,
    GenerateBillAndSellLienPopupModule,
    GenerateBillAndHoldLienModule
  ],
  providers:[RadPortalService, DatePipe]
})
export class ReadingRadPortalModule { }
