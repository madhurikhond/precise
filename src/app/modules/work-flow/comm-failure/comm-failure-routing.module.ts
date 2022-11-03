import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { CommFailureComponent } from './comm-failure.component';
import { NeedToResolveComponent } from './need-to-resolve/need-to-resolve.component';
import { ResolvedComponent } from './resolved/resolved.component';

const routes: Routes = [
  {
    path: '', component: CommFailureComponent, children:[      
      { path: '', redirectTo: 'need-to-resolve', pathMatch: 'full',canActivate:[RoleGuard]},
      { path: 'need-to-resolve', component: NeedToResolveComponent,canActivate:[RoleGuard] },
      { path: 'resolved', component: ResolvedComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommFailureRoutingModule { }
