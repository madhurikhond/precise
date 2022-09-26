import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExcludeFacilitiesComponent } from './exclude-facilities/exclude-facilities.component';
import { FinancialTypeComponent } from './financial-type.component';

const routes: Routes = [
  {
    path: '', component: FinancialTypeComponent, children:[
      {
        path:'',redirectTo:'exclude-facilities', pathMatch: 'full'
      },
      {
        path:'exclude-facilities', component:ExcludeFacilitiesComponent
      }  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialTypeRoutingModule { }
