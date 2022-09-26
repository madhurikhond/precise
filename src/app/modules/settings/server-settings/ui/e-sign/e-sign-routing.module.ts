import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/modules/core/guards/auth.guard';
import { RoleGuard } from 'src/app/modules/core/guards/role.guard';
import { ESignComponent } from './e-sign.component';
import { ElecAgreeComponent } from './elec-agree/elec-agree.component';

const routes: Routes = [
  { path: '', redirectTo: 'elec-agree', pathMatch: 'full' },
  { path: 'elec-agree', component: ElecAgreeComponent, canActivate: [AuthGuard,RoleGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ESignRoutingModule { }
