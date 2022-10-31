import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { patientPortalResponseStatus, PatientPortalURL } from 'src/app/models/patient-response';
import { StorageService } from 'src/app/services/common/storage.service';
import { TokenService } from 'src/app/services/common/token.service';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';

@Injectable()
export class PAuthGuard implements CanActivate {

  currentUrl: string = '';
  loginStatus:boolean = false;
  isSessionLoged: boolean = false;
  constructor(private readonly storageService: StorageService, private tokenService: TokenService,
    private readonly router: Router, private patientPortalService: PatientPortalService
  ) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.currentUrl = state.url;

    var token = this.storageService.PartnerJWTToken;
    if (token != null && token != undefined) {
      var decodedToken = this.tokenService.getDecodedAccessToken(this.storageService.PartnerJWTToken);
      var tokenExpiry = new Date(decodedToken.exp * 1000);
      var today = new Date();
      if (tokenExpiry < today) {
        this.patientPortalService.GetPartnerToken().subscribe((res: any) => {
          if (res) {
            if (res.responseStatus == patientPortalResponseStatus.Success) {
              this.storageService.PartnerId = res.result.partnerId;
              this.storageService.PartnerJWTToken = res.result.jwtToken;
              if (this.isPageRefresh()) {
                if (this.isUserLoggedIn()) {
                  this.router.navigate([PatientPortalURL.PATIENT_DASHBOARD]);
                  return true;
                }
                else {
                  this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
                  return false;
                }
              }
              if (this.globalUserLogin()) {
                this.router.navigate([this.currentUrl]);
                return true;
              }
              else {
                this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
                return false;
              }
            }
            else {
              this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
              return false;
            }
          }
        },
          (err: any) => {
            this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
            return false;
          })
      }
      else {
        if (this.isPageRefresh()) {
          if (this.isUserLoggedIn()) {
            this.router.navigate([PatientPortalURL.PATIENT_DASHBOARD]);
            return true;
          }
          else {
            this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
            return false;
          }
        }
        if (this.globalUserLogin()) {
          return true;
        }
        else {
          this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
          return false;
        }
      }
    }
    else {
      this.router.navigate([PatientPortalURL.PATIENT_PORTAL]);
      return false;
    }
  }

  private isPageRefresh(): boolean {
    return (!this.router.navigated);
  }

  private isUserLoggedIn(): boolean {
    var p_detail = localStorage.getItem("p_detail");
    var today = new Date();
    if (this.storageService.PTimeout) {
      var expireDate = new Date(this.storageService.PTimeout);
      if (today > expireDate) {
        this.loginStatus = true;
        return false;
      }
      else {
        if (p_detail !== null && p_detail != undefined) {
          return true;
        } else
          return false;
      }
    } else {
      return false;
    }
  }

  globalUserLogin(): boolean {
    if(this.isUserLoggedIn())
    {
      var today = new Date();
      if (this.storageService.PTimeout) {
        var expireDate = new Date(this.storageService.PTimeout);
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
    else{
      if(this.loginStatus)
      {
        this.loginStatus = false;
        return false;
      }
      else
        return true;
    }
   
  }
}

