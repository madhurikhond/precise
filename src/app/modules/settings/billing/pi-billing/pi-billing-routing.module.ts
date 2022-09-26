import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { BpartComponent } from './bpart/bpart.component';
import { DxCodesComponent } from './dx-codes/dx-codes.component';
import { FacilitiesComponent } from './facilities/facilities.component';
import { PiBillingComponent } from './pi-billing.component';
import { PiInvoicePricingComponent } from './pi-invoice-pricing/pi-invoice-pricing.component';
import { ProcCodesComponent } from './proc-codes/proc-codes.component';
import { ProcGroupsComponent } from './proc-groups/proc-groups.component';
import { StudyDescriptionComponent } from './study-description/study-description.component';

const routes: Routes = [
{
  path: '',
  component: PiBillingComponent,
  children: [
    { path: '', redirectTo: 'proc-groups', pathMatch: 'full'},
    { path: 'proc-groups', component: ProcGroupsComponent, canActivate: [AuthGuard,RoleGuard] },
    { path: 'bpart', component: BpartComponent, canActivate: [AuthGuard] },
    { path: 'dx-codes', component: DxCodesComponent, canActivate: [AuthGuard] },
    { path: 'facilities', component: FacilitiesComponent, canActivate: [AuthGuard] },
    { path: 'pi-invoice-pricing', component: PiInvoicePricingComponent, canActivate: [AuthGuard] },
    { path: 'pre-neg-rates', loadChildren: () => import('./pre-neg-rates/pre-neg-rates.module').then(m => m.PreNegRatesModule), canActivate: [AuthGuard] },
    { path: 'proc-codes', component: ProcCodesComponent, canActivate: [AuthGuard] },
    { path: 'study-description', component: StudyDescriptionComponent, canActivate: [AuthGuard] },
  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PiBillingRoutingModule { }
