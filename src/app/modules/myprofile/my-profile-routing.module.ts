import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './myprofile.component';
import { CalenderComponent } from './calender/calender.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { RolesComponent } from './roles/roles.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LinksComponent } from './links/links.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { ProfileComponent } from './myprofile/my-profile.component';
import { DepartmentsComponent } from './department/department.component';
import { NotificationsComponent } from './notification/notification.component';

const routes: Routes = [
  {
    path: '', component: MyProfileComponent, children:[
   { path: '', redirectTo:'calender', pathMatch:'full' },
   { path: 'calender', component: CalenderComponent},
   { path: 'team-members', component: TeamMembersComponent},
   { path: 'roles', component: RolesComponent},
   { path: 'department', component:DepartmentsComponent},
   { path: 'links', component: LinksComponent},
   { path: 'mydocuments', component:MyDocumentsComponent},
   { path: 'profile', component: ProfileComponent},
   { path: 'change-password', component:ChangePasswordComponent},
   { path: 'notification', component: NotificationsComponent},
    ] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
