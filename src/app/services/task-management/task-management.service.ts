import { EventEmitter, Injectable, Output } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';

@Injectable()
export class TaskManagementService {

   
  constructor(private readonly _httpService:HttpService) { }
  
  
  getAllActiveEpicUsers(showGlobalLoader : boolean = true){
    return this._httpService.get(`Automation/getAllActiveEpicUsers`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getTaskManagementSettingForLabelTab(showGlobalLoader : boolean = true){
    return this._httpService.get(`TaskManagement/GetTaskManagementSetting`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getTaskManagementSettingForSlackTab(showGlobalLoader : boolean = true){
    return this._httpService.get(`TaskManagement/GetTaskManagementSlackGlobalSettings`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateTaskManagementSettingForLabel(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/UpdateTaskManagementSetting`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  addTaskManagementSettingForLabel(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post(`TaskManagement/AddTaskManagementSetting`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  updateTaskManagementSlackGlobalSettings(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/UpdateTaskManagementSlackGlobalSettings`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  checkValidPatient(showGlobalLoader : boolean = true,patientId:string){
    return this._httpService.get(`TaskManagement/CheckValidPatient?patientId=${patientId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getEpicUser(showGlobalLoader : boolean = true,userId:string){
    return this._httpService.get(`TaskManagement/ActiveEpicUserForTaskManagement?userId=${userId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  createTask(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post(`TaskManagement/CreateTask`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  taskManagementApplyFilter(showGlobalLoader : boolean = true,body:any){
    return this._httpService.post(`TaskManagement/TaskManagementApplyFilter`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  getTaskDetailById(showGlobalLoader : boolean = true,taskId:any,userId:any){
    debugger
    return this._httpService.get(`TaskManagement/GetTaskDetailById?taskId=${taskId}&userId=${userId}`,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  markTaskCompleted(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/MarkTaskCompleted`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  markTaskArchived(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/MarkTaskArchived`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  markTaskToDo(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/MarkTaskToDo`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
  taskAssignToOther(showGlobalLoader : boolean = true,body:any){
    return this._httpService.put(`TaskManagement/TaskAssignToOther`,body,showGlobalLoader).pipe(
      map((res:ApiResponse) => res)
    );
  }
}

