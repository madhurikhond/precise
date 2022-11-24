import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FundingCoSettingComponent } from '../lien-funding-co/funding-co-setting/funding-co-setting.component';
import { PatientComponent } from '../patient/patient.component';
import { PrescreengridComponent } from '../shared/components/prescreening-small-window/prescreengrid/prescreengrid.component';
import { CoreComponent } from './core.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '', component: CoreComponent, children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard,RoleGuard] },
      { path: 'settings', loadChildren: () => import('./../settings/settings.module').then(m => m.SettingsModule), canActivate: [AuthGuard] },
      { path: 'funding-companies', loadChildren: () => import('../borker/broker.module').then(m => m.BrokerModule), canActivate: [AuthGuard,RoleGuard] },
      { path: 'facilities', loadChildren: () => import('../facillities/facillities.module').then(m => m.FacillitiesModule), canActivate: [AuthGuard] },
      { path: 'referrers', loadChildren: () => import('../referrers/referrers.module').then(m => m.ReferrersModule), canActivate: [AuthGuard, RoleGuard] },
      { path: 'pi', loadChildren: () => import('../pi/pi.module').then(m => m.PiModule), canActivate: [AuthGuard] },
      { path: 'bi', loadChildren: () => import('../bi/bi.module').then(m => m.BiModule), canActivate: [AuthGuard] },
      { path: 'accounting', loadChildren: () => import('../accounting/accounting.module').then(m => m.AccountingModule), canActivate: [AuthGuard] },
      { path: 'subs', loadChildren: () => import('../subs/subs.module').then(m => m.SubsModule), canActivate: [AuthGuard] },
      { path: 'work-flow', loadChildren: () => import('../work-flow/workflow.module').then(m => m.WorkflowModule), canActivate: [AuthGuard] },
      { path: 'myprofile', loadChildren: () => import('../myprofile/my-profile.module').then(m => m.MyProfileModule), canActivate: [AuthGuard] },
      { path: 'auto-route-v2', loadChildren: () => import('../auto-route-v2/auto-route-v2.module').then(m => m.AutoRouteV2Module), canActivate: [AuthGuard] },
      { path: 'rad-portal', loadChildren: () => import('../reading-rad-portal/reading-rad-portal.module').then(m => m.ReadingRadPortalModule), canActivate: [AuthGuard] },
      { path: 'lien-management', loadChildren: () => import('../lien-management/lien-management.module').then(m => m.LienManagementModule), canActivate: [AuthGuard] },
      { path: 'lien-funding-co', loadChildren: () => import('../lien-funding-co/lien-funding-co.module').then(m => m.LienFundingCoModule) },
      { path: 'lien-funding-co-setting', component: FundingCoSettingComponent},
      { path: 'shared', loadChildren: () => import('../shared/shared.module').then(m => m.SharedModule)},
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {

}
