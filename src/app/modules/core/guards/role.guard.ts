import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, NavigationEnd, Router, RouterStateSnapshot } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  
  constructor(private readonly storageService: StorageService, private readonly router: Router) {}
  matches = [];
  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot) :boolean {  
    return this.rolePermissionAuthGuard(route['_routerState'].url); 
  }
  rolePermissionAuthGuard(routerUrl: string): boolean{
    this.matches = [];
    var isFreshLogin = this.storageService.getFreshLogin;
    this.matches=[];
     var data = this.storageService.UserRole;
    if (data) {
      let list: any = [];
      let responseHierarchy = JSON.parse(data);
      if (responseHierarchy && responseHierarchy.length) {
        responseHierarchy.forEach(value => {
          if (value && value.hierarchy) {
            value.hierarchy = JSON.parse(value.hierarchy);
          }
        })
      }
      for (let i = 0; i < responseHierarchy.length; i++) {
        list.push(responseHierarchy[i].hierarchy);
      }
    
     this.filter(list, routerUrl.toLowerCase());
     if (this.matches.length > 0) {
       return true;
     } else {
       if (this.matches)
         if (isFreshLogin) {
           this.router.navigate(['dashboard']);
           this.storageService.setFreshLogin='false'

         }
         else
         this.router.navigate(['unauthorize-access'], { replaceUrl: true });       
        return false;
      }    
     
    }
  }
  filter(arr, term) {       
    arr.forEach((i) => {
      if (i.Url.includes(term)) {
        this.matches.push(i);
      } 
      if (i.Children.length > 0) {
        this.filter(i.Children, term);
      }
    });
  }
}
