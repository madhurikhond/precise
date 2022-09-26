import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';
import { BiComponent } from './bi/bi.component';
import { MarketingComponent } from './marketing/marketing.component';
import { PersonalInjuryComponent } from './personal-injury/personal-injury.component';
import { SchedulingComponent } from './scheduling/scheduling.component';

const routes: Routes = [
  { path: '', component: BiComponent, pathMatch: 'full' },
  { path: 'bi', component: BiComponent },
  { path: 'marketing',  component: MarketingComponent, canActivate: [AuthGuard,RoleGuard]},
  { path: 'scheduling',  component: SchedulingComponent, canActivate: [AuthGuard,RoleGuard]},
  { path: 'personal-injury',  component: PersonalInjuryComponent, canActivate: [AuthGuard,RoleGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BiRoutingModule { }
