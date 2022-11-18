import { EventEmitter, Injectable, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { Workbook } from 'exceljs';
import saveAs from 'file-saver';
import DataGrid from 'devextreme/ui/data_grid';
import { HttpService } from './http.service';
import { ApiResponse } from 'src/app/models/response';
import { map } from 'rxjs/operators';
const commonTitle = 'Precise MRI';

@Injectable()
export class CommonMethodService {
  loginSession: Subject<boolean> = new BehaviorSubject<boolean>(null);
  title = new Subject<string>();
  showTaskManagementWindowEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
   toDoTaskCountForHeader: EventEmitter<number> = new EventEmitter<number>();
  private savedSearchMessageSubject = new Subject<any>();
  savedSearchMessage = this.savedSearchMessageSubject.asObservable();
  private docManagerSubjectForDocComp = new Subject<any>();
  public preScreeningUser = new Subject<any>();
  docManagerSubjectObservableForDocComp = this.docManagerSubjectForDocComp.asObservable();
  private sideNav = new BehaviorSubject('');
  isSidenavOpened = this.sideNav.asObservable();
  public viewerRecords = new Subject<any>();

  private reqSearch = new BehaviorSubject('');
  reqSearchClose = this.reqSearch.asObservable();

  private docManagerSubjectForDocCompforRefAndFundingCo = new Subject<any>();
  docManagerSubjectObservableForDocCompforRefAndFundingCo = this.docManagerSubjectForDocCompforRefAndFundingCo.asObservable();

  private createAlertPopUpSubject = new Subject<any>();
  createAlertPopUpObservable = this.createAlertPopUpSubject.asObservable();

  private preScreenPatientIDSubject = new BehaviorSubject('');
  preScreenPatientID = this.preScreenPatientIDSubject.asObservable();
  
  private getCreateAlerts = new BehaviorSubject('');
  getCreateAlerts$ = this.getCreateAlerts.asObservable();
  private leaseSave = new Subject<any>();
  leaseSaveObserver = this.leaseSave.asObservable();
  constructor(private _titleService: Title, private readonly _httpService: HttpService) {
    this.preScreeningUser.next(null)
    this.viewerRecords.next(null)
  }
  toggleSideNav(state: any) {
    this.sideNav.next(state);
  }
  
  toggleReqSearchpopup(state : any){
    this.reqSearch.next(state)
  }

  clearAllSubjects() {
    this.title.next();
    // this.userPermissions.next();
    // this.projectbidStatus.next();
    // this.toaster.next();
    // this.projectPermission.next(false);
    // this.fullMenuActive.next();
    // this.isImportedSpecFileStatus.next();
    // this.isSpecDivision.next();
    this.loginSession.next();
    this.preScreeningUser.next(null)
    this.viewerRecords.next(null)
  }

  setTitle(title: string) {
    if (title !== undefined) {
      this.title.next();
      this.title.next(title);
      this._titleService.setTitle(`${title} - ${commonTitle}`);
    }
  }

  getTitle(): Observable<any> {
    return this.title.asObservable();
  }

  clearTitle() {
    this.title.next('');
  }

  setLoginSession(isLogin: boolean) {
    if (isLogin !== undefined) {
      this.loginSession.next(isLogin);
    }
  }
  getWeekDays() {

    const items = [
      { 'day': 'Sunday' },
      { 'day': 'Monday' },
      { 'day': 'Tuesday' },
      { 'day': 'Wednesday' },
      { 'day': 'Thrusday' },
      { 'day': 'Friday' },
      { 'day': 'Saturday' }
    ];
    return items;
  }
  alowNumberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 45 || charCode == 47 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onExporting(instance: DataGrid, fileName: string) {
    debugger;
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(fileName);
    exportDataGrid({
      component: instance,
      worksheet: worksheet,
      keepColumnWidths: true,
      topLeftCell: { row: 2, column: 2 },
      customizeCell: ({ gridCell, excelCell }) => {
        if (gridCell.rowType === 'data') {
          if (gridCell.column.dataField === 'ISREADYTOBILL') {
            excelCell.value = gridCell.value === true ? 'Yes' : 'No';
          }
          if (gridCell.column.dataField === 'BillSent') {
            excelCell.value = gridCell.value === true ? 'Yes' : 'No';
          }
          if (gridCell.column.dataField === 'PatientLien') {
            excelCell.value = gridCell.value === true ? 'Yes' : 'No';
          }
          if (gridCell.column.dataField === 'AttorneyLien') {
            excelCell.value = gridCell.value == true ? 'Yes' : 'No';
          }
          if (gridCell.column.dataField === 'NoShowFee') {
            excelCell.value = gridCell.value === true ? 'Yes' : 'No';
          }
        }
        if (gridCell.rowType === 'group') {
          excelCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'BEDFE6' } };
        }
        if (gridCell.rowType === 'totalFooter' && excelCell.value) {
          excelCell.font.italic = true;
        }
      }
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName + '.xlsx');
      });
    });
    // e.cancel = true;
  }
  showTaskManagementWindow(isShow: boolean) {
    this.showTaskManagementWindowEmitter.emit(isShow);
  }
  savedSearch(showGlobalLoader: boolean = true, body: any) {
    return this._httpService.post(`MasterValues/SavedSearch`, body, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  getSavedSearchList(showGlobalLoader: boolean = true, userId: any, pageName: any) {
   
    return this._httpService.get(`MasterValues/getSavedSearchList?userId=${userId}&pageName=${pageName}`, showGlobalLoader)
    .pipe(
      map((res: ApiResponse) => res)
    );
  }
  deleteSavedSearch(showGlobalLoader: boolean = true, id: any) {
    return this._httpService.delete(`MasterValues/DeleteSavedSearch?id=${id}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  checkPatientExist(showGlobalLoader: boolean = true, patientId: string) {
    return this._httpService.get(`DocumentManager/CheckPatientExist?patientId=${patientId}`, showGlobalLoader).pipe(
      map((res: ApiResponse) => res)
    );
  }
  sendDataToSavedSearchComponent(body: any) {
    this.savedSearchMessageSubject.next(body);
  }

  sendDataToDocumentManager(patientId: any) {
    this.docManagerSubjectForDocComp.next(patientId);
  }

  setPreScreeningUser(details: any) {
    this.preScreeningUser.next(details)
  }

  setViewerRecords(details: any) {
    this.viewerRecords.next(details)
  }
  sendDataToDocumentManagerForRefAndFundingCo(data: any) {    
    this.docManagerSubjectForDocCompforRefAndFundingCo.next(data);
  }
  sendDatatoCreateAlertPage(isOpen:boolean)
  {
    this.createAlertPopUpSubject.next(isOpen);
  }
  setPreScreenPatientID(PatientID: string) {
    this.preScreenPatientIDSubject.next(PatientID)
  }
  loadCreateAlertRecords(patientID: string) {
  
    this.getCreateAlerts.next(patientID)
  }
  sendDataBlockLeaseScheduler(data: any) {
    this.leaseSave.next(data);
  }
}
