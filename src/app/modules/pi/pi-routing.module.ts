import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { ProRataCalculatorComponent } from './pro-rata-calculator/pro-rata-calculator.component';
import { SettlementsComponent } from './settlements/settlements.component';
import { CaseUpdateAndCollectionComponent } from './case-update-and-collection/case-update-and-collection.component';
import { FacilityService } from 'src/app/services/facillities/facility.service';

const routes: Routes = [
  { path: 'pro-rata-calculator', component: ProRataCalculatorComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'settlements', component: SettlementsComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'case-update-and-collection',  component:CaseUpdateAndCollectionComponent, canActivate: [AuthGuard,RoleGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers : [FacilityService]
})
export class PiRoutingModule { }
