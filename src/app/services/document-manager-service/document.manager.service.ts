import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DocumentManagerAlert } from 'src/app/models/document.manager';
import { ApiResponse } from 'src/app/models/response';
import { HttpService } from '../common/http.service';

@Injectable()
export class DocumentmanagerService {

  constructor(private readonly _httpService: HttpService) { }

  getPatientFileById(showGlobalLoader: boolean = true, patientId: string, docTabText: string) {
    return this._httpService.get(`DocumentManager/GetFiles?patientId=${patientId}&docTabText=${docTabText}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFilesByKey(showGlobalLoader: boolean = true,body){
    
    return this._httpService.post(`DocumentManager/GetFileByKey`, body,showGlobalLoader,true).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getFilesByKeys(showGlobalLoader: boolean = true,files){
    
    return this._httpService.post(`DocumentManager/GetFileByKeys`, files,showGlobalLoader,true).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteFile(showGlobalLoader: boolean = true, fileName: string, patientId: string, docId: number) {
    return this._httpService.delete(`DocumentManager/deleteFile?fileName=${fileName}&patientId=${patientId}&docId=${docId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteAllFiles(showGlobalLoader : boolean = true, body:string) {
    return this._httpService.post(`DocumentManager/DeleteAllFiles`,body,showGlobalLoader,true).pipe(
      map((res:ApiResponse) => res)
    );
  }
  
  getDocumentType(showGlobalLoader: boolean = true) {
    return this._httpService.get(`DocumentManager/GetDocumentType`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  uploadFile(showGlobalLoader: boolean = true, fromData: FormData) {
    return this._httpService.post(`DocumentManager/uploadFile`, fromData, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  uploadedDocumentForRxOrSimpleUpload(showGlobalLoader: boolean = true, body: DocumentManagerAlert) {
    return this._httpService.post(`DocumentManager/UploadedDocumentForRxOrSimpleUpload`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  AddUpdateDocumentsForReferrarAndFundingCo(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`DocumentManager/AddUpdateDocumentsForForBrokerandReferrer`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetUploadedDocumentsForReferrarAndFundingCo(showGlobalLoader: boolean = true, ReferreId: string, UploadedPage: string,ReferrerName:string) {
    return this._httpService.get(`DocumentManager/GetUploadedDocumentsForBrokerandReferrer?ReferreId=${ReferreId}&UploadedPage=${UploadedPage}&ReferrerName=${ReferrerName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteBrokerandReferrerFile(showGlobalLoader: boolean = true, fileName: string, patientId: string, docId: number,fromPage:string,referrerName:string) {
    return this._httpService.delete(`DocumentManager/DeleteBrokerandReferrerFile?fileName=${fileName}&patientId=${patientId}&docId=${docId}&fromPage=${fromPage}&referrerName=${referrerName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  renameFile(showGlobalLoader: boolean = true, oldFileName: string, newFileName: string,patientId: string, docId: number,owner:Number,fromPage:string,ReferrerName:string,docType:string) {
    return this._httpService.get(`DocumentManager/RenameFile?oldFileName=${oldFileName}&newFileName=${newFileName}&patientId=${patientId}&docId=${docId}&owner=${owner}&fromPage=${fromPage}&docType=${docType}&ReferrerName=${ReferrerName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPatientName(showGlobalLoader: boolean = true, patientId: string) {
    return this._httpService.get(`DocumentManager/getPatientName?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFolderTreeFileManager(){
    return this._httpService.get(`FileManager/GetFolderHierarchy`,true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFilesForFileManager(path:any){
    return this._httpService.get(`FileManager/GetFilesForFileManager?path=${path}`,true).pipe(
      map((res: ApiResponse) => res)
    );
  } 
  //DocumentManager/DocumentManagerUploadedDocumentByDocId
  UpdateDocumentByDocId(docId: number, docFromAttorneyStatus: boolean = true){
    return this._httpService.post(`DocumentManager/UpdateDocumentByDocId?docId=${docId}&docFromAttorneyStatus=${docFromAttorneyStatus}`, true,true,true).pipe(
      map((res: ApiResponse) => res)
    );

  }
  UploadFileBarCode(showGlobalLoader: boolean = true, body: string) {
    return this._httpService.post(`DocumentManager/UploadFileBarCode`, body, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );

  }

  
}








