import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { PickupComponent } from './pickup/pickup.component';
import { SubsComponent } from './subs.component';

const routes: Routes = [
    { path: '', component: SubsComponent, children:[
    { path:'',redirectTo:'pickup', pathMatch: 'full',canActivate:[RoleGuard] },
    { path:'pickup', component: PickupComponent, canActivate:[RoleGuard] } 
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubsRoutingModule { }
