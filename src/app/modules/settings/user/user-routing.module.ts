import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../../core/guards/role.guard';
import { DepartmentComponent } from './department/department.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { LinkComponent } from './link/link.component';
import { NotificationComponent } from './notification/notification.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { UserComponent } from './user.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '', component: UserComponent, children:[      
      { path: '', redirectTo: 'users', pathMatch: 'full'},
      { path: 'users', component: UsersComponent, canActivate: [RoleGuard] },
      { path: 'role-permission', component: RolePermissionComponent },
      { path: 'department', component: DepartmentComponent },
      { path: 'link', component: LinkComponent },
      { path: 'file-manager', component: FileManagerComponent },
      { path: 'notification', component: NotificationComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
