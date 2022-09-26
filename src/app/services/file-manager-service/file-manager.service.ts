import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';
export class folderTree {
  id:number;
  folderName: string;
  folderPath:string;
  isDirectory: boolean;
  items?: folderTree[];
}
export class FileItem {
    name: string;
    isDirectory: boolean;
    uploadedBy:string;
    docType: string;
    owner:number;
    uploadedOn:string;   
    docId:number;
    docTypeId:number;
    fileBase64:string;    
}
export class MenuItem {
  id: string;
  text: string;
}
const menuItems: MenuItem[] = [
  { id: 'delete', text: 'Delete' },
  { id: 'rename', text: 'Rename' },
  { id: 'new_folder', text: 'New Folder' },  
];

const menufacilityItems: MenuItem[] = [
  { id: 'delete', text: 'Delete' },
  { id: 'rename', text: 'Rename' },
  { id: 'upload', text: 'Upload' },  
];

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {

  constructor(private readonly _httpService: HttpService) { }
  getFolderTreeFileManager(){
    return this._httpService.get(`FileManager/GetFolderHierarchy`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  createNewFolder(path:any){
    return this._httpService.get(`FileManager/CreateNewFolder?newFolderNamePath=${path}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  uploadFile(showGlobalLoader: boolean = true, fromData: FormData) {
    return this._httpService.post(`FileManager/UploadFile`, fromData, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  renameFolder(oldFolderPath:string,newFolderPath:string){
    return this._httpService.get(`FileManager/RenameFolder?oldFolderPath=${oldFolderPath}&newFolderPath=${newFolderPath}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteFolder(folderPath:string){
    return this._httpService.get(`FileManager/DeleteFolder?folderPath=${folderPath}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFiles(Owner:string, UploadedPage:string, oldUploadedPage:string){
    return this._httpService.get(`FileManager/getAllFiles?Owner=${Owner}&UploadedPage=${UploadedPage}&oldUploadedPage=${oldUploadedPage}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  // deleteFile(fileName: string, docId: number,owner: number, UploadedPage:string, oldUploadedPage:string ) {
  //   return this._httpService.delete(`FileManager/deleteFile?fileName=${fileName}&docId=${docId}&owner=${owner}&UploadedPage=${UploadedPage}&oldUploadedPage=${oldUploadedPage}`, true).pipe(
  //     map((res: ApiResponse) => res)
  //   );
  // }
  deleteFiles(multipleDeleteJSON:string) {
    return this._httpService.post(`FileManager/deleteFile`,multipleDeleteJSON,true, true).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getMenuItems(): MenuItem[] {
    return menuItems;
  }


   //Doc-Manager for facility :

   getFacilityFolderHierarchy(FacilityName:string,FacilityId:string,FromPage:string){
    return this._httpService.get(`FileManager/GetFacilityFolderHierarchy?FacilityName=${FacilityName}&FacilityId=${FacilityId}&FromPage=${FromPage}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  uploadFacilityFile(showGlobalLoader: boolean = true, fromData: FormData,FolderHierarchy:string) {
    return this._httpService.post(`FileManager/FacilityUploadFile?FolderHierarchy=${FolderHierarchy}`, fromData, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllFacilityFiles(Owner:string, UploadedPage:string, oldUploadedPage:string,FacilityName:string,FacilityId:string){
    return this._httpService.get(`FileManager/getAllFacilityFiles?Owner=${Owner}&UploadedPage=${UploadedPage}&oldUploadedPage=${oldUploadedPage}&FacilityName=${FacilityName}&FacilityId=${FacilityId}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteFacilityFiles(multipleDeleteJSON:string,FromPage:string) {
    return this._httpService.post(`FileManager/DeleteFacilityFile?FromPage=${FromPage}`,multipleDeleteJSON,true, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  facilityDeleteFolder(folderPath:string){
    return this._httpService.get(`FileManager/FacilityDeleteFolder?folderPath=${folderPath}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  facilityRenameFolder(oldFolderPath:string,newFolderPath:string){
    return this._httpService.get(`FileManager/FacilityRenameFolder?oldFolderPath=${oldFolderPath}&newFolderPath=${newFolderPath}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  facilityRenameFile(FacilityInputJSON:string, RnameText:string, FromPage:string) {
    return this._httpService.post(`FileManager/RenameFacilityFile?RenameFileName=${RnameText}&FromPage=${FromPage}`,FacilityInputJSON,true, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  facilitySendEmail(FacilityInputJSON:string,FilePath:string,DocId:string, facilityId:number,FromPage:string) {
    return this._httpService.post(`FileManager/FacilitySendEmail?FilePath=${FilePath}&DocId=${DocId}&facilityId=${facilityId}&FromPage=${FromPage}`,FacilityInputJSON,true, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  facilitySendFax(FaxNumber:string,FilePath:string,DocId:string, facilityId:number, FromPage:string) {
    return this._httpService.post(`FileManager/facilitySendFax?FaxNumber=${FaxNumber}&FilePath=${FilePath}&DocId=${DocId}&facilityId=${facilityId}&FromPage=${FromPage}`,true, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  
  getMenuFacilityItems(): MenuItem[] {
    return menufacilityItems;
  }
}
