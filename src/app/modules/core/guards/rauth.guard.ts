import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { RADIOLOGIST_TYPE } from 'src/app/constants/route.constant';
import { LienPortalResponseStatus, LienPortalURL } from 'src/app/models/lien-portal-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { TokenService } from 'src/app/services/common/token.service';
import { LienPortalService } from 'src/app/services/lien-portal/lien-portal.service';

@Injectable()
export class RAuthGuard implements CanActivate {

  currentUrl: string = '';
  loginStatus: boolean = false;
  isSessionLoged: boolean = false;
  constructor(private readonly storageService: StorageService, private tokenService: TokenService,
    private readonly router: Router, private lienPortalService: LienPortalService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.currentUrl = state.url;
    var token = this.storageService.LienJWTToken;
    if (this.storageService.user) {
      if (this.storageService.user.UserType != RADIOLOGIST_TYPE) {
        this.router.navigate(['unauthorize-access'], {
          replaceUrl: true,
        });
        return false;
      }
      
      if (token != null && token != undefined) {
        var decodedToken = this.tokenService.getDecodedAccessToken(this.storageService.LienJWTToken);
        var tokenExpiry = new Date(decodedToken.exp * 1000);
        var today = new Date();
        if (tokenExpiry < today) {
          this.lienPortalService.GetLienPartnerToken().subscribe((res: any) => {
            if (res) {
              if (res.responseStatus == LienPortalResponseStatus.Success) {
                this.storageService.PartnerId = res.result.partnerId;
                this.storageService.LienJWTToken = res.result.jwtToken;
                if (this.isPageRefresh()) {
                  if (this.isUserLoggedIn()) {
                    return true;
                  }
                  else {
                    this.router.navigate(['login']);
                    return false;
                  }
                }
                if (this.globalUserLogin()) {
                  this.router.navigate([this.currentUrl]);
                  return true;
                }
                else {
                  this.router.navigate(['login']);
                  return false;
                }
              }
              else {
                this.router.navigate(['login']);
                return false;
              }
            }
          },
            (err: any) => {
              this.router.navigate(['login']);
              return false;
            })
        }
        else {
          if (this.isPageRefresh()) {
            if (this.isUserLoggedIn()) {
              return true;
            }
            else {
              this.router.navigate(['login']);
              return false;
            }
          }
          if (this.globalUserLogin()) {
            return true;
          }
          else {
            this.router.navigate(['login']);
            return false;
          }
        }
      }
      else {
        this.router.navigate(['login']);
        return false;
      }

      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

  private isPageRefresh(): boolean {
    return (!this.router.navigated);
  }

  private isUserLoggedIn(): boolean {
    var rad_detail = this.storageService.user;
    var today = new Date();
    if (this.storageService.LienTimeout) {
      var expireDate = new Date(this.storageService.LienTimeout);
      if (today > expireDate) {
        this.loginStatus = true;
        return false;
      }
      else {
        if (rad_detail !== null && rad_detail != undefined) {
          return true;
        } else
          return false;
      }
    } else {
      return false;
    }
  }

  globalUserLogin(): boolean {
    if (this.isUserLoggedIn()) {
      var today = new Date();
      if (this.storageService.LienTimeout) {
        var expireDate = new Date(this.storageService.LienTimeout);
        if (today > expireDate) {
          return false;
        }
        else {
          return true;
        }
      } else {
        return false;
      }
    }
    else {
      if (this.loginStatus) {
        this.loginStatus = false;
        return false;
      }
      else
        return true;
    }

  }
}

