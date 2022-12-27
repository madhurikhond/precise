import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RADIOLOGIST_TYPE } from 'src/app/constants/route.constant';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';
declare const $: any
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  currentUrl: string = '';
  isSessionLoged: boolean = false;
  isPermissionChanged: boolean;
  constructor(private readonly storageService: StorageService,
    private readonly router: Router,
    private commonMethod: CommonMethodService
  ) {
    this.commonMethod.loginSession.subscribe((res) => {
      if (res) {
        this.isSessionLoged = res;
      }
    });
  }

  canActivate() {
    if (this.storageService.user) {
     
      this.isPermissionChanged = this.storageService.getItem("isPermissionChanged");
      if (this.isPermissionChanged) {

        $('#divRolePermissionChanged').click()
        return true;
      }
      this.router.events.subscribe((res) => {
        this.currentUrl = this.router.url;
      })
      var tokenExpiry = new Date(this.storageService.user.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        //if (this.currentUrl === '/' || '/login') {
        //  this.router.navigate(['login']);
        //  return false;
        //}
        this.commonMethod.setTitle('Login');
        this.storageService.clearAll();
        this.router.navigate(['login'], { replaceUrl: true });

        //this.commonMethod.setLoginSession(true);
        return false;
      }
      return true;
    }
    else {
      this.commonMethod.setTitle('Login');
      this.router.navigate(['login']);
      return false;
    }
  }

}
