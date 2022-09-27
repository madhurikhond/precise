import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/common/storage.service';
declare const $: any;
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: [
  ]
})
export class NavbarComponent implements OnInit {
  currentPath = '';
  workFlowClick = false;
  accountingClick = false;
  PIClick = false;
  FacilitiesClick = false;
  radPortalClick = false;
  subsClick = false;
  BIClick = false;
  settingsClick = false;
  responseHierarchy: any = [];
  list:NavigationModel[]= [];
  constructor(private readonly storageService:StorageService) {
  }

  ngOnInit(): void {
    this.clearCSS();
    setTimeout(() => {
      this.makeActive();
    }, 100);
    this.getPermission();
  }



  makeActive() { 
    setTimeout(() => {      
    for (let index = 0; index < 2; index++) {
      $('.left-menu').find('.nav-link.active').parents('ul').parents('li').children(0).addClass('active jClass')
    }
  }, 1000);
  }

  activeCSS() {
    this.clearCSS();
    this.makeActive()
  }

 getPermission(){
  var data = this.storageService.UserRole;
    this.responseHierarchy = JSON.parse(data); 
    if (this.responseHierarchy && this.responseHierarchy.length) {
      this.responseHierarchy.forEach(value => {
        if (value && value.hierarchy) {
          value.hierarchy = JSON.parse(value.hierarchy);
        }
      })
    }
    for (let i = 0; i < this.responseHierarchy.length; i++) {      
      this.list.push(this.responseHierarchy[i].hierarchy);
   }
 }
 

  clearCSS() {
    $('.left-menu').find('.nav-link').removeClass('active jClass');
  }
  formatPath(path: string): string {
    return path.replace(' ','-');
  }


}
export class NavigationModel {
  public ModuleId: string;
  public PageTitle: string;
  public Url: string;
  public Icon: string;
  public ParentId: string;
  public ParentTitle : string;
  public Children: NavigationModel[];
}
