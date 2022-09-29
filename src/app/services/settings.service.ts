import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../models/response';
import { HttpService } from './common/http.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private _httpService: HttpService) { }

  getMasterDocumentTypeList(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterDocumentType/GetAllDocumentTypes', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getFileExtensionList(showGlobalLoader: boolean = true) {
    return this._httpService.get('Automation/GetFileExtensions', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );

  }

  getDefaultAutoRouteSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get('Automation/GetDefaultAutoRouteSetting', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getEmailTemplates(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`EmailTemplate/GetAllEmailTemplates?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getEmailTemplateById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('EmailTemplate/GetEmailTemplateById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateEmailTemplate(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('EmailTemplate/UpdateEmailTemplate', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllProcGroups(showGlobalLoader: boolean = true) {
    return this._httpService.get('ProcGroup/GetAllProcGroups', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addProcGroup(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('ProcGroup/AddProcGroup', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateProcGroup(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('ProcGroup/UpdateProcGroup', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteProcGroup(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete('ProcGroup/DeleteProcGroup/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getProcGroupById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('ProcGroup/GetProcGroupById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getProcGroups(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`ProcGroup/GetAllProcGroup?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  saveAutoRouteSetting(autoRouteSettingModel: any, showGlobalLoader: boolean = true) {
    return this._httpService.post('Automation/AddUpdateAutoRouteSetting', autoRouteSettingModel, showGlobalLoader);
  }

  getGeneralSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get('Automation/GetAllTwillioGeneralSetting', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getMasterFinancialTypes(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterValues/GetFinancialTypes', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getMasterStatusNames(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterValues/GetStatusNames', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addGeneralSettings(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Automation/AddTwillioGeneralSetting', showGlobalLoader, body).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateGeneralSettings(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateTwillioGeneralSetting', showGlobalLoader, body).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getGeneralSettingById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('Automation/GetTwillioGeneralSettingById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllStudyTypeAllowMultiple(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`ProcGroup/GetAllStudyTypeAllowMultiples?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  geStudyTypeAllowMultipleById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('ProcGroup/GetStudyTypeAllowMultipleById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addStudyTypeAllowMultipleSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('ProcGroup/AddStudyTypeAllowMultiple', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateStudyTypeAllowMultiple(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('ProcGroup/UpdateStudyTypeAllowMultiple', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateMasterBPartDescription(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('ProcGroup/UpdateMasterBPartDescription', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllMasterBPartDescriptions(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`ProcGroup/GetAllMasterBPartDescriptions?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getMasterBPartDescriptionById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('ProcGroup/GetMasterBPartDescriptionById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addBPartDescription(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('ProcGroup/AddMasterBPartDescription', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getMasterModalities(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterValues/GetScheduledModality', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  GetAllOrderedSMSSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get('Automation/GetAllOrderedSMSSetting', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateOrderedSmsSettings(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateOrderedSMSSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllBodyPart1(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetAllBodyParts`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllLateralitieslist(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetAllLateralities`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllDXCodes(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`ProcGroup/GetAllDXCodes?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addDXCode(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('ProcGroup/AddDXCode', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateDXCode(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put(`ProcGroup/UpdateDXCode`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getDXCodeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`ProcGroup/GetDXCodeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllCallingSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllTwilioCallingSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateCallSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put(`Automation/UpdateTwilioCallingSetting`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllCallConfirmSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllCallConfirmSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateCallConfirmSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateCallConfirmSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllCasePaymentSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllPaymentSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updatePaymentCaseSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdatePaymentSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  //  #region Automation-> Liens->Pi
  //Get
  getAttorneyPiLiensSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllAttorneyAndPatientLiensSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  //put
  updatePiAttorneyLienSettings(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateAttorneyAndPatientLiensSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  // #endregion

  getAllOrderReviewSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllOrderedReviewSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateOrderedReviewSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateOrderedReviewSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllUserList(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetAllUserList`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllCheckImageSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllCheckImageSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateCheckImageSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateCheckImageSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  // #region Automation-> Liens->Broker PSL And Psl alert
  //Get
  GetAllPatientStudySchedulingSetting(showGlobalLoader: boolean = true) {

    return this._httpService.get(`Automation/GetAllPatientStudySchedulingSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  //put
  UpdatePatientStudySchedulingSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdatePatientStudySchedulingSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
    // //#endregion
  }


  // #region Automation-> Scheduling->NoShow
  //Get
  GetAllNoShowSmsSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllNoShowSmsSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  // Put
  updateNoShowSettingSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateNoShowSmsSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  //#endregion

  getAllNoPslDetailSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllNoPSLDetailSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateNoPslDetailSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateNoPSLDetailSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllPatientStudySchedulingSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllPatientStudySchedulingSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updatePatientStudySchedulingSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdatePatientStudySchedulingSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }


  getMasterAAppointmentStatuses(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterValues/GetAppointmentStatuses', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }


  getAllSMSSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllSMSSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateSmsSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateSMSSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getMasterPriorityNames(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetPriorityNames`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  //  #region Automation-> Liens->E-sign
  //Get
  getEsignLiensSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllESignLienSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  //put
  updateEsignLiensSettings(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateESignLienSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  // #endregion

  getAllARSFTPSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllARSFTPSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateARSFTPSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateARSFTPSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllMasterSftpSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetSFTPProfiles`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllSlackSttings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllSlackServiceSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getSlackSettingByID(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get('Automation/GetSlackServiceSettingById/' + id, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateSlackSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateSlackServiceSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addSlackSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Automation/AddSlackServiceSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllNewExportSttings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllNewExportSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateExportSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateNewExportSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getTestStudyForSMSTest(showGlobalLoader: boolean = true, accessionNumber: string) {
    return this._httpService.get(`Automation/GetTestStudyForSMSTest?accessionNumber=${accessionNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllSFTPSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllSFTPSettings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateSFTPSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateSFTPSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  //  #region Automation-> PI Accept Liability
  getAllAcceptLiabilitySetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllAcceptLiabilitySetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePiAcceptLiabilitySetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateAcceptLiabilitySetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  // #endregion

  getAllReminderStatus(showGlobalLoader: boolean = true, reminderType: string, pageNo: number, pageSize: number) {
    return this._httpService.get(`Automation/GetAllReminderStatus/ReminderType/PageNo?ReminderType=${reminderType}&PageNo=${pageNo}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllRefStudySettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllRefStudySumSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateRefStudySetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateRefStudySumSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllServiceSettings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllServiceSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateServiceSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateServiceSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  //  #region Automation-> Scheduler->Pend PI Accept Liab
  //Get
  getPendPiAcceptLiabWithoutGridSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetPICreateAlertSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPICreateAlertSettingGrid(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetPICreateAlertSettingGrid`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  //put
  // updateEsignLiensSettings(showGlobalLoader : boolean = true,body:any){
  //   return this._httpService.put('Automation/UpdateESignLienSetting',body, showGlobalLoader).pipe(
  //     map((res:ApiResponse) => res)
  //   );
  // }
  // #endregion

  getAllArPaymentCaseCondtitionsGrid(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllARPaymentCaseConditions`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addArPaymentCaseCondtitionGrid(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Automation/AddARPaymentCaseCondition', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteARPaymentCaseConditionById(showGlobalLoader: boolean = true, caseConditionId: number) {
    return this._httpService.get(`Automation/DeleteARPaymentCaseConditionById/${caseConditionId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateArPaymentCaseCondtitionGrid(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateARPaymentCaseCondition', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getStatusForStatusOrder(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetStatuForStatusOrder`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllTemplateMappings(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetAllTemplateMappings`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateTemplateMapping(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateTemplateMapping', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getDefaultSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetDefaultSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateDefaultSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateDefaultSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllPaymentStatus(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetAllPaymentStatus`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAllReports(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Report/GetReportFolderFiles`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }


  getAlertTypes(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Alerts/GetAllAlertTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addAlertTypes(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Alerts/AddAlertTypes', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateAlertTypes(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Alerts/UpdateAlertTypes', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }


  getAlertsUnsatisfiedSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Alerts/GetAlertsUnsatisfiedSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateAlertUnsatisfiedSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Alerts/UpdateAlertUnsatisfiedSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addAlertReasonSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Alerts/AddAlertReasonSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAlertReasonsSetting(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Alerts/GetAlertReasonsSetting?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getAlertReasonSettingById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Alerts/GetAlertReasonSettingById/Id?Id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateAlertReasonSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Alerts/UpdateAlertReasonSetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  generateDuplicateReasonSetting(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Alerts/GenerateDuplicateReasonSetting/Id?Id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAlertEditDropdown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Alerts/GetAlertEditDropdown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getUsers(showGlobalLoader: boolean = true, topSearchText: string, status: string, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Automation/GetUsers?searchText=${topSearchText}&status=${status}&pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getUserById(showGlobalLoader: boolean = true, userId: number) {
    return this._httpService.get(`Automation/GetUserById/${userId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  sendActivationEmail(showGlobalLoader: boolean = true, userId: number) {
    return this._httpService.post(`Account/SendActivationEmail/${userId}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addDepartment(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('MasterValues/AddMasterDepartment', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateDepartment(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('MasterValues/UpdateMasterDepartment', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteDepartment(showGlobalLoader: boolean = true, departmentId: number) {
    return this._httpService.delete(`MasterValues/DeleteMasterDepartment?departmentId=${departmentId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getDepartmentById(showGlobalLoader: boolean = true, departmentId: number) {
    return this._httpService.get(`MasterValues/GetMasterDocumentById/${departmentId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getDepartments(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number, searchText = '') {
    return this._httpService.get(`MasterValues/GetAllMasterDepartments?pageSize=${pageSize}&pageNumber=${pageNumber}&searchText=${searchText}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addLink(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('MasterValues/AddLink', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateLink(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('MasterValues/UpdateLink', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  deleteLink(showGlobalLoader: boolean = true, linkId: number) {
    return this._httpService.delete(`MasterValues/DeleteLink?linkId=${linkId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getLinkById(showGlobalLoader: boolean = true, linkId: number) {
    return this._httpService.get(`MasterValues/GetLinkById/${linkId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getLinks(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number, searchText = '') {
    return this._httpService.get(`MasterValues/GetAllLinks?pageSize=${pageSize}&pageNumber=${pageNumber}&searchText=${searchText}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getUserEditDropdown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetUserEditDropdown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  updateUser(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateUser', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getCaseConditionByAssociationId(showGlobalLoader: boolean = true, associationId: number) {
    return this._httpService.get(`Automation/GetCaseConditionByAssociationId/${associationId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addCaseCondition(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Automation/AddCaseCondition', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateCaseCondition(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Automation/UpdateCaseCondition', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteCaseConditionById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Automation/DeleteCaseConditionById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllAlertTypes(showGlobalLoader: boolean = true) {
    return this._httpService.get('Alerts/GetAllAlertTypes', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAlertReasonsByAlertType(showGlobalLoader: boolean = true, alertType: string) {
    return this._httpService.get(`Alerts/GetAlertReasonsByAlertType/${alertType}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePICreateAlertSettingGridById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Automation/DeletePICreateAlertSettingGridById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePICreateAlertSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put(`Automation/UpdatePICreateAlertSetting`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePICreateAlertSettingGrid(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put(`Automation/UpdatePICreateAlertSettingGrid`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPICreateAlertSettingGrid(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`Automation/AddPICreateAlertSettingGrid`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDocumentTypesList(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterDocumentType/GetAllDocumentTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDocumentTypeById(showGlobalLoader: boolean = true, documentTypeId: number) {
    return this._httpService.get(`MasterDocumentType/GetDocumentTypeById/${documentTypeId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addDocumentType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('MasterDocumentType/AddDocumentType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateDocumentType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('MasterDocumentType/UpdateDocumentType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSftpList(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetAllSFTP?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  getSftpById(showGlobalLoader: boolean = true, sftpId: number) {
    return this._httpService.get(`MasterValues/GetSFTPById/${sftpId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  CRUD_SFTP(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('MasterValues/CRUD_SFTP', body, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addSftp(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('MasterValues/AddSFTP', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateSftp(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('MasterValues/UpdateSFTP', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  testSftpConnection(showGlobalLoader: boolean = true, sftpId: number) {
    return this._httpService.post(`MasterValues/TestSFTPConnection?sftpId=${sftpId}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }

  addUpdateSchedulingFacilitySetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Scheduler/AddUpdateSchedulingFacilitySetting', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSchedulingFacilitySetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Scheduler/GetSchedulingFacilitySetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFinancialTypeExcludeFacility(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Scheduler/GetFinancialTypeExcludeFacility?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFacilityExculdeList(financialTypeId: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Scheduler/GetFacilityExculdeList?financialTypeId=${financialTypeId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveFinancialTypeExcludeList(showGlobalLoader: boolean = true, financialTypeId: number, body: any) {
    return this._httpService.post(`Scheduler/SaveFinancialTypeExcludeList?financialTypeId=${financialTypeId}`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveNotification(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Scheduler/SaveNotification', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getGroups(showGlobalLoader: boolean = true) {
    return this._httpService.get('MasterValues/GetGroups', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPermission(showGlobalLoader: boolean = true, groupName) {
    return this._httpService.get(`Account/GetPermission?groupName=${groupName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveRolePermission(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`Account/SaveRolePermission`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  savePickupStatus(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`UI/AddUpdatePickupStatus`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPickupStatus(showGlobalLoader: boolean = true) {
    return this._httpService.get(`UI/GetPickupStatus`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveASLSetting(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`UI/AddUpdateASLSetting`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getASLSetting(showGlobalLoader: boolean = true) {
    return this._httpService.get(`UI/GetASLSetting`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getCompletedStudies(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetCompletedStudies?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveStudyStatusMark(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`Settings/SaveStudyStatusMark`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addDefaultMinPricing(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddDefaultMinPricing', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateDefaultMinPricing(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdateDefaultMinPricing', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteDefaultMinPricing(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeleteDefaultMinPricing?id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDefaultMinPricingById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetDefaultMinPricingById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDefaultMinPricings(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Settings/GetAllDefaultMinPricings?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addOverridePricing(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddOverridePricing', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateOverridePricing(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdateOverridePricing', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteOverridePricing(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeleteOverridePricing?id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getOverridePricingById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetOverridePricingById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllOverridePricings(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Settings/GetAllOverridePricings?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDropdownOverridePricing(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetDropdownOverridePricing`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  copyOverridePricing(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.post(`Settings/CopyOverridePricing?id=${id}`, null, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveFacilityGroup(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/SaveFacilityGroup', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getModalityNames(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetModalityNames`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getFacilityGroupById(showGlobalLoader: boolean = true, procGroupId: number) {
    return this._httpService.get(`Settings/GetFacilityGroupById/${procGroupId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllFacilityGroups(showGlobalLoader: boolean = true, pageNumber: number, pageSize: number) {
    return this._httpService.get(`Settings/GetAllFacilityGroups?pageSize=${pageSize}&pageNumber=${pageNumber}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllDatabaseTables(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllDatabaseTables`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBookMarkFields(showGlobalLoader: boolean = true, tableName: string) {
    return this._httpService.get(`Settings/GetBookMarkFields/${tableName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  saveBookmarkFields(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`Settings/SaveBookmarkFields`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBookmarkFields_UseBookmark(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetBookmarkFields_UseBookmark`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPlayerTypes(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetPlayerTypes`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getARSettingDropdown(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetARSettingDropdown`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPaymentBasedBrokerType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddPaymentBasedBrokerType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePaymentBasedBrokerType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePaymentBasedBrokerType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePaymentBasedBrokerType(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeletePaymentBasedBrokerType/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPaymentBasedBrokerTypeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPaymentBasedBrokerTypeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPaymentBasedBrokerTypes(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPaymentBasedBrokerTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPaymentBasedFinancialType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddPaymentBasedFinancialType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePaymentBasedFinancialType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePaymentBasedFinancialType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePaymentBasedFinancialType(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeletePaymentBasedFinancialType/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPaymentBasedFinancialTypeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPaymentBasedFinancialTypeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPaymentBasedFinancialTypes(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPaymentBasedFinancialTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPaymentType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddPaymentType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePaymentType(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePaymentType', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePaymentType(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeletePaymentType/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPaymentTypeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPaymentTypeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPaymentTypes(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPaymentTypes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPaymentBank(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddPaymentBank', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePaymentBank(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePaymentBank', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePaymentBank(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeletePaymentBank/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPaymentBankById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPaymentBankById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPaymentBanks(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPaymentBanks?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addQBAccount(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddQBAccount', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateQBAccount(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdateQBAccount', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteQBAccount(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeleteQBAccount/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getQBAccountById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetQBAccountById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllQBAccounts(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllQBAccounts?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  addPayee(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AddPayee', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePayee(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePayee', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  deletePayee(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.delete(`Settings/DeletePayee/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPayeeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPayeeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPayee(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPayee?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updatePiInvoice(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdatePiInvoice', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPiInvoiceById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetPiInvoiceById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllPiInvoices(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllPiInvoices?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateProcCode(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.put('Settings/UpdateProcCode', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getProcCodeById(showGlobalLoader: boolean = true, id: number) {
    return this._httpService.get(`Settings/GetProcCodeById/${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllProcCodes(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetAllProcCodes?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getBrokerBill(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetBrokerBill?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getPersonalInjuryBill(pageNumber: number, pageSize: number, showGlobalLoader: boolean = true) {
    return this._httpService.get(`Settings/GetPersonalInjuryBill?pageNumber=${pageNumber}&pageSize=${pageSize}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  assignBulkProcCode(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Settings/AssignBulkProcCode', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getDepartmentForActiveEmployee(showGlobalLoader: boolean = true) {
    return this._httpService.get('DashBoard/GetDepartmentForActiveEmployee', showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllMasterModalities(showGlobalLoader: boolean = true) {
    return this._httpService.get(`MasterValues/GetMasterModalities`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllReminders(data: any, showGlobalLoader: boolean = true) {
    return this._httpService.post(`Settings/GetAllReminders`, data, showGlobalLoader).pipe(map((res: ApiResponse) => {
      return res;
    }));
  }
  addUpdateRemiders(showGlobalLoader: boolean = true, body: string) {
    return this._httpService.post('Settings/AddUpdateRemiders', body, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getAllEmailSendFrom(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetEmailSendFrom`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateAllEmailSendFrom(showGlobalLoader: boolean = true, body: string) {
    return this._httpService.post(`Automation/UpdateEmailSendFrom`, body, showGlobalLoader, true).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSMSTemplate(showGlobalLoader: boolean = true) {
    return this._httpService.get(`Automation/GetSmsTemplate`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  sendSMS(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post('Automation/GetTestStudyForSMSTest', body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    )
  }
  deleteRoleGroupName(showGlobalLoader: boolean = true, groupName) {
    debugger
    return this._httpService.delete(`Automation/DeleteRoleGroupName?groupName=${groupName}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  updateRoleGroupName(showGlobalLoader:boolean = true,  groupName,oldGroupName) {
    debugger
    return this._httpService.get(`Automation/UpdateRoleGroupName?groupName=${groupName}&oldGroupName=${oldGroupName}`,showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    ) 
  }
}
