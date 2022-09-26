import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulingFacilitiesSettingsComponent } from './scheduling-facilities-settings.component';
import { GeneralTabComponent } from './general/general.component';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';

const routes: Routes = [
  {
  path: '', component: SchedulingFacilitiesSettingsComponent, children:[
    {
      path:'',redirectTo:'general', pathMatch: 'full',canActivate:[RoleGuard]
    },
    {
      path:'general', component:GeneralTabComponent,canActivate:[RoleGuard]
    },
    {
      path:'financialtype', loadChildren: () => import('./financialtype/financial-type.module').then(m => m.FinancialTypeModule),canActivate:[RoleGuard]
    },  
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingfacilitiessettingsRoutingModule { }
