import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';

@Injectable({
  providedIn: 'root'
})
export class MyprofileService {

  constructor(private readonly _httpService: HttpService) { }

  getMasterDepartments(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`MasterValues/GetAllMasterDepartments?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getTeamMembers(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`MyProfile/GetTeamMembers?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getRoles(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`MyProfile/GetRoles?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllLinks(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`MasterValues/GetAllLinks?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getUserById(showGlobalLoader: boolean = true, userId: any) {
    return this._httpService.get(`Automation/GetUserById/${userId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateUser(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put(`Automation/UpdateUser`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePassword(showGlobalLoader: boolean = true, currentPassword: any, newPassword: any, userId: any) {
    return this._httpService.get('MyProfile/UpdatePassword?currentPassword=' + encodeURIComponent(currentPassword) + '&newPassword=' + encodeURIComponent(newPassword) + '&userId=' + encodeURIComponent(userId), showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getNotification(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MyProfile/GetNotification`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getNotificationByFilter(showGlobalLoader: boolean = true, notificationMessage: any, form: any, to: any, status: any) {
    return this._httpService.get('MyProfile/GetNotificationByFilter?notificationMessage=' + encodeURIComponent(notificationMessage) + '&form=' + encodeURIComponent(form) + '&to=' + encodeURIComponent(to) + '&status=' + encodeURIComponent(status), showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  unReadNotification(showGlobalLoader: boolean = true, notificationId: number, body: any) {
    return this._httpService.put('MyProfile/UnReadNotification/' + notificationId, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  unCompletedNotification(showGlobalLoader: boolean = true, notificationId: number, body: any) {
    return this._httpService.put('MyProfile/UnCompletedNotification/' + notificationId, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  completedNotification(showGlobalLoader: boolean = true, notificationId: number, body: any) {
    return this._httpService.put('MyProfile/CompletedNotification/' + notificationId, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  readNotification(showGlobalLoader: boolean = true, notificationId: number, body: any) {
    return this._httpService.put('MyProfile/ReadNotification/' + notificationId, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getMyDocTree(folderName: any){
    return this._httpService.get(`MasterValues/GetMyDocHierarchy?folderName=${folderName}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
}
