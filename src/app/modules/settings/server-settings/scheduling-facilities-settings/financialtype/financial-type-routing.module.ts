import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { ExcludeFacilitiesComponent } from './exclude-facilities/exclude-facilities.component';
import { FinancialTypeComponent } from './financial-type.component';

const routes: Routes = [
  {
    path: '', component: FinancialTypeComponent, children:[
      {
        path:'',redirectTo:'exclude-facilities', pathMatch: 'full',canActivate:[RoleGuard]
      },
      {
        path:'exclude-facilities', component:ExcludeFacilitiesComponent,canActivate:[RoleGuard]
      }  
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinancialTypeRoutingModule { }
