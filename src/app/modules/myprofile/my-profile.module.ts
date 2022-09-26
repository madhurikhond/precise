import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from 'ng2-ckeditor';
import { MyProfileRoutingModule } from './my-profile-routing.module';
import { MyProfileComponent } from './myprofile.component';
import { CalenderComponent } from './calender/calender.component';
import { TeamMembersComponent } from './team-members/team-members.component';
import { RolesComponent } from './roles/roles.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LinksComponent } from './links/links.component';
import { MyDocumentsComponent } from './my-documents/my-documents.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './myprofile/my-profile.component';
import { DepartmentsComponent } from './department/department.component';
import { NotificationsComponent } from './notification/notification.component';
import { DxDataGridModule} from 'devextreme-angular/ui/data-grid';
import { DxDateBoxModule} from 'devextreme-angular/ui/date-box';
import { DxContextMenuModule } from 'devextreme-angular/ui/context-menu';
import { DxTemplateModule } from 'devextreme-angular/core';
import { DxTreeViewModule } from 'devextreme-angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [MyProfileComponent,CalenderComponent,TeamMembersComponent, 
    RolesComponent,ChangePasswordComponent,DepartmentsComponent,LinksComponent,
    MyDocumentsComponent,NotificationsComponent,ProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    DxDataGridModule,
    CKEditorModule,
    DxDateBoxModule,
    DxContextMenuModule,
    DxTemplateModule,
    MyProfileRoutingModule,
    DxTreeViewModule,
    FormsModule
  ]
})
export class MyProfileModule { }
