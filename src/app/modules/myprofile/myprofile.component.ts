import { Component, OnInit } from '@angular/core';
import { Router  } from '@angular/router';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyProfileComponent implements OnInit {
  pageTitle:string='CALENDER';
  constructor(private router: Router ) {
   }

  ngOnInit(): void {
  }
  public onRouterOutletActivate(event : any) {
   let currentRoute= this.router.url.split('/')[2];
   switch (currentRoute) {
    case 'calender':
        this.pageTitle='CALENDER'
        break;
    case 'team-members':
      this.pageTitle='TEAM MEMBERS'
        break;
    case 'roles':
      this.pageTitle='ROLES'
        break;
    case 'department':
      this.pageTitle='DEPARTMENT'
        break;
    case 'links':
      this.pageTitle='LINKS'
        break;
    case 'mydocuments':
      this.pageTitle='MY DOCUMENTS'
        break;
    case 'profile':
      this.pageTitle='MY PROFILE'
        break;
        case 'change-password':
      this.pageTitle='CHANGE PASSWORD'
        break;
        case 'notification':
      this.pageTitle='NOTIFICATION'
        break;
    default:
      this.pageTitle='MY PROFILE'
        break;}
 }
}
