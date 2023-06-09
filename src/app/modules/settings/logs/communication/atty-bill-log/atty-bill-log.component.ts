import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DateTimeFormatCustom } from 'src/app/constants/dateTimeFormat';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-atty-bill-log',
  templateUrl: './atty-bill-log.component.html',
  styleUrls: ['./atty-bill-log.component.css']
})
export class AttyBillLogComponent implements OnInit {

  totalRecords: number
  attyBilllist:any =[]
  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  applyFilterTypes: any;
  currentFilter: any;
  showFilterRow: boolean;
  showHeaderFilter: boolean;
  allMode: string;
  checkBoxesMode: string;
  selectedItemKeys: any[] = [];
  pageNumber: number = 1;
  pageSize : number ;
  searchText: string='';
  readonly dateTimeFormatCustom = DateTimeFormatCustom;
  readonly pageSizeArray=PageSizeArray;
  constructor(private fb: FormBuilder,
    private logService:LogsService,
    private notificationService:NotificationService,
    private commonMethodService: CommonMethodService) {
      this.allMode = 'page';
      this.checkBoxesMode = 'always'
      this.showFilterRow = true;
      this.showHeaderFilter = false;
      this.applyFilterTypes = [{
        key: 'auto',
        name: 'Immediately'
      }, {
        key: 'onClick',
        name: 'On Button Click'
      }];
      this.columnResizingMode = this.resizingModes[0];
      this.currentFilter = this.applyFilterTypes[0].key;
    }

  ngOnInit(): void {
    this.pageSize= this.pageSizeArray.filter(x=>x.IsSelected).length>0? this.pageSizeArray.filter(x=>x.IsSelected)[0].value:this.pageSizeArray[0].value;
    this.getAllAttyBills()
    this.logService.filterResult.subscribe((res: any) => {
      this.searchText = res.searchText;
      this.pageNumber = 1;
      this.pageSize = 20;
      this.getAllAttyBills();  
      this.commonMethodService.setTitle('Atty bill Log');   
    });
    this.logService.clearClickedEvent.subscribe((res: string) => {
      if (res === 'clearFilter') {
        this.searchText = '';
        this.pageNumber = 1;
        this.pageSize = 20;
        this.getAllAttyBills();     
      }
    });      
  }

  startEdit(e) {
    if(e.rowType === 'data') {
        e.component.editRow(e.rowIndex);
    }
  }
  
  selectionChanged(data: any) {
    this.selectedItemKeys = data.selectedRowKeys;
  }
  
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.  getAllAttyBills();
  }
  getAllAttyBills() {
      this.logService.getAllAttyBills(true, this.searchText, this.pageNumber, this.pageSize).subscribe((res)=>{
        var data:any=res;
        this.totalRecords = res.totalRecords
      if (res.response != null && res.response.length > 0) { 
        this.attyBilllist=res.response;  
      }
      else{
        this.notificationService.showNotification({
          alertHeader : data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },(err : any) => {
      this.showError(err);
    });
  }

    // common Error Method
    showError(err: any) {
    this.notificationService.showNotification({
      alertHeader : err.statusText,
      alertMessage:err.message,
      alertType: err.status
    });
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getAllAttyBills()
  }

}
