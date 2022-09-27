import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulingFacilitiesSettingsComponent } from './scheduling-facilities-settings.component';
import { GeneralTabComponent } from './general/general.component';

const routes: Routes = [
  {
  path: '', component: SchedulingFacilitiesSettingsComponent, children:[
    {
      path:'',redirectTo:'general', pathMatch: 'full'
    },
    {
      path:'general', component:GeneralTabComponent
    },
    {
      path:'financialtype', loadChildren: () => import('./financialtype/financial-type.module').then(m => m.FinancialTypeModule)
    },  
  ]
}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchedulingfacilitiessettingsRoutingModule { }
