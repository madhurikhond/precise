import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {
  pageTitle:string='CALENDER';
  responseHierarchy: any = [];
  list: any = [];
  tabList: any=[];
  constructor(private router: Router ,  private readonly _storageService: StorageService) {
   }

  ngOnInit(): void {
    this.getPermission();
  }
  getPermission() {
    var pagetitleList: any = [];
    var data = this._storageService.UserRole;
    this.responseHierarchy = JSON.parse(data);
    if (this.responseHierarchy && this.responseHierarchy.length) {
      this.responseHierarchy.forEach((value) => {
        if (value && value.hierarchy) {
          value.hierarchy = JSON.parse(value.hierarchy);
        }
      });
    }
    for (let i = 0; i < this.responseHierarchy.length; i++) {
      this.list.push(this.responseHierarchy[i].hierarchy);
    }
    this.splitListAccToType(this.list);
  }
  splitListAccToType(list1: any) {
    list1.forEach((i) => {
      if (i.Type) {
        if ((i.Type == 3 && i.LinkedWith==4)||i.Type==4) {
          this.tabList.push(i);
        }
      }
    });
  }
//   public onRouterOutletActivate(event : any) {
//    let currentRoute= this.router.url.split('/')[2];
//    switch (currentRoute) {
//     case 'calender':
//         this.pageTitle='CALENDER'
//         break;
//     case 'team-members':
//       this.pageTitle='TEAM MEMBERS'
//         break;
//     case 'roles':
//       this.pageTitle='ROLES'
//         break;
//     case 'department':
//       this.pageTitle='DEPARTMENT'
//         break;
//     case 'links':
//       this.pageTitle='LINKS'
//         break;
//     case 'mydocuments':
//       this.pageTitle='MY DOCUMENTS'
//         break;
//     case 'profile':
//       this.pageTitle='MY PROFILE'
//         break;
//         case 'change-password':
//       this.pageTitle='CHANGE PASSWORD'
//         break;
//         case 'notification':
//       this.pageTitle='NOTIFICATION'
//         break;
//     default:
//       this.pageTitle='MY PROFILE'
//         break;}
//  }
}
