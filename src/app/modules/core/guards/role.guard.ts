import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router
  ) {}
  matches = [];
  redirectLinkWithPermission: any;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    return this.rolePermissionAuthGuard(route['_routerState'].url);
  }
  rolePermissionAuthGuard(routerUrl: string): boolean {
    this.matches = [];
    var isFreshLogin = this.storageService.getFreshLogin;
    this.matches = [];
    var valReturn: any;
    var data = this.storageService.UserRole;
    if (data) {
      try {
        let list: any = [];
        var leftList: any=[];
        let responseHierarchy = JSON.parse(data);
        if (responseHierarchy && responseHierarchy.length) {
          responseHierarchy.forEach((value) => {
            if (value && value.hierarchy) {
              value.hierarchy = JSON.parse(value.hierarchy);
            }
          });
        }
        for (let i = 0; i < responseHierarchy.length; i++) {
          list.push(responseHierarchy[i].hierarchy);
        }
        if (routerUrl.includes('?')) {
          var check = routerUrl;
          var a = check.split('?');
          routerUrl = a[0];
        }
        this.filter(list, routerUrl.toLowerCase());
        if (this.matches.length > 0) {
          return true;
        } else {
          if (this.matches)
            if (isFreshLogin) {
              list.forEach((i) => {
                if (i.Type) {
                  if (i.Type == 1) {
                    leftList.push(i);
                  }
                }});
              if (leftList[0].Url !== '') {
                this.redirectLinkWithPermission= leftList[0].Url;
              } else if (leftList[0].Url == '' && leftList[0].Children) {
                this.redirectLinkWithPermission = leftList[0].Children[0].Url;
              }
              this.router.navigate([this.redirectLinkWithPermission]);
              this.storageService.setFreshLogin = 'false';
            } else
              this.router.navigate(['unauthorize-access'], {
                replaceUrl: true,
              });
          return false;
        }
      } catch (ex) {
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
        localStorage.removeItem('_cr_u_infor');
        localStorage.removeItem('jwt_t');
        window.location.reload();
      }
    }
  }
  filter(arr, term) {
    arr.forEach((i) => {
      var masterUrl = i.MasterUrl.toLowerCase();
      if (term.includes(masterUrl) && masterUrl !== '') {
        this.matches.push(i);
      }
      if (i.Children.length > 0) {
        this.filter(i.Children, term);
      }
    });
  }
}
