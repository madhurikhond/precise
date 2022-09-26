import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadPortalTabRouting } from './rad-portal-tab-routing.module';
import { RadPortalTabComponent } from './rad-portal-tab.component';
import { SharedModule } from '../../shared/shared.module';
import { RadPortalService } from 'src/app/services/rad-portal-service/rad-portal.service';



@NgModule({
  declarations: [RadPortalTabComponent],
  imports: [
    CommonModule,
    SharedModule,
    RadPortalTabRouting
  ],
  providers:[RadPortalService]
})
export class RadPortalTabModule { }
