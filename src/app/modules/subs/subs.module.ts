import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubsRoutingModule } from './subs-routing.module';
import { CopyservicemanagementComponent } from './copy service management/copyservicemanagement.component';
import { SharedModule } from '../shared/shared.module';
import { BiComponent } from './bi/bi.component';
import { RequestSearchComponent } from './request-search/request-search.component';
import {SubsService} from '../../services/subs-service/subs.service';
@NgModule({
  declarations: [CopyservicemanagementComponent, BiComponent, RequestSearchComponent],
  imports: [
    CommonModule,
    SharedModule,
    SubsRoutingModule
  ],
  providers:[SubsService]
})
export class SubsModule { }
