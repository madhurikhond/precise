import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { DefaultMinPricingComponent } from './default-min-pricing/default-min-pricing.component';
import { OverridePricingComponent } from './override-pricing/override-pricing.component';
import { PreNegRatesComponent } from './pre-neg-rates.component';


const routes: Routes = [
  {
    path: '', component: PreNegRatesComponent, children: [
      { path: '', redirectTo: 'default-min-pricing', pathMatch: 'full'},
      { path: 'default-min-pricing', component: DefaultMinPricingComponent, canActivate: [AuthGuard] },
      { path: 'override-pricing', component: OverridePricingComponent, canActivate: [AuthGuard] },
    ]}
  ];
  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreNegRatesRoutingModule { }
