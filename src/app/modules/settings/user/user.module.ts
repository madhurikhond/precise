import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DepartmentComponent } from './department/department.component';
import { SharedModule } from '../../shared/shared.module';
import { LinkComponent } from './link/link.component';
import { RolePermissionComponent } from './role-permission/role-permission.component';
import { FileManagerComponent } from './file-manager/file-manager.component';
import { NotificationComponent } from './notification/notification.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CKEditorModule } from 'ng2-ckeditor';
import { FormsModule } from '@angular/forms';
// import { TreeModule } from 'ng2-tree';
import { NgxMaskModule } from 'ngx-mask';
//import { TreeModule } from '@circlon/angular-tree-component';
import { ContextMenuModule } from 'ngx-contextmenu';
import { DxFileManagerModule, DxPopupModule } from 'devextreme-angular';
import { DxTreeViewModule,DxListModule, DxContextMenuModule } from 'devextreme-angular';




@NgModule({
  declarations: [UsersComponent, UserComponent, DepartmentComponent, LinkComponent, RolePermissionComponent, FileManagerComponent, NotificationComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    NgxPaginationModule,
    SharedModule,
    CKEditorModule,
    FormsModule,
    //TreeModule,
    DxFileManagerModule,DxTreeViewModule,DxListModule,DxContextMenuModule,
    ContextMenuModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    NgxMaskModule.forRoot({ 
    }),
  ], exports:[
    DxFileManagerModule
  ]
})
export class UserModule { }
