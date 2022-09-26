import { NgModule } from '@angular/core';
import { ReferrersRoutingModule } from './referrers-routing.module';
import { ReferrersComponent } from './referrers.component';
import { SharedModule } from '../shared/shared.module';
import { ReferrersService } from 'src/app/services/referrers.service';


@NgModule({
  declarations: [ReferrersComponent],
  imports: [
    SharedModule,
    ReferrersRoutingModule,
  ],
  providers:[ReferrersService]
})
export class ReferrersModule {
 }
