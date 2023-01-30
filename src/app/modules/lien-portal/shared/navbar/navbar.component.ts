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
  leftNavList:NavigationModel[]=[];
  // headerPopupList:NavigationModel[]=[];
  // rightNavList:NavigationModel[]=[];
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
      if(this.responseHierarchy[i].hierarchy.PageTitle == 'ORIGINAL LIEN OWNER')
        this.responseHierarchy[i].hierarchy.PageTitle = 'LIEN PORTAL';
        
      this.list.push(this.responseHierarchy[i].hierarchy);
   }
   this.splitListAccToType(this.list);
 }
//  splitListAccToType(list1: any)
//   {
//     list1.forEach((i) => {
//       if(i.Type)
//       {
//         if(i.Type==1)
//         {
//           this.leftNavList.push(i);
//         }
//         // if(i.Type==2)
//         // {
//         //   this.headerPopupList.push(i);
//         // }
//         // if(i.Type==3)
//         // {
//         //   this.rightNavList.push(i);
//         // }
//       }
//     });
//   }



splitListAccToType(list1: any) {
  list1.forEach((i) => {
    if (i.Type) {
      if (i.Type == 1) {
        if (i.Children && i.Children.length > 0)
          i.Children = this.splitListAccToType_child(i.Children);
        this.leftNavList.push(i);
      }
    }
  });
}

splitListAccToType_child(list: any) {
  if (list && list.length > 0) {
    list = list.filter(element => {
      if (element.Children && element.Children.length > 0)
        element.Children = this.splitListAccToType_child(element.Children);
      else
        if (!element.Url)
          return !element;
      return element;
    });
    return list;
  }
  return [];
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
