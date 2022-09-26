import { Component, OnInit } from '@angular/core';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { NotificationService } from 'src/app/services/common/notification.service';
import { LogsService } from 'src/app/services/logs.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-failure',
  templateUrl: './failure.component.html',
  styleUrls: ['./failure.component.css']
})
export class FailureComponent implements OnInit {

  totalRecords: number
  failurelist:any =[]
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
  pageSize : number;
  searchText: string='';
  readonly pageSizeArray=PageSizeArray;
  constructor(
    private logService:LogsService,
    private notificationService:NotificationService,
    private readonly commonMethodService : CommonMethodService 
  ) {
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
    this.getAllFailure()
    this.logService.filterResult.subscribe((res: any) => {
      this.searchText = res.searchText;
      this.pageNumber = 1;
      this.pageSize = 20;
      this.getAllFailure(); 
      this.commonMethodService.setTitle('Failure');    
    });
    this.logService.clearClickedEvent.subscribe((res: string) => {
      if (res === 'clearFilter') {
        this.searchText = '';
        this.pageNumber = 1;
        this.pageSize = 20;
        this.getAllFailure();     
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
    this.getAllFailure();
  }

  getAllFailure() {
    this.logService.getAllFailure(true,this.searchText, this.pageNumber, this.pageSize).subscribe((res)=>{
      var data:any=res;
      this.totalRecords = res.response
    if (res.response != null && res.response.length > 0) {   
      this.failurelist = res.response
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
  showError(err: any){
    this.notificationService.showNotification({
       alertHeader : err.statusText,
       alertMessage:err.message,
       alertType: err.status
    });
  }

  pageChanged(event){
    this.pageNumber = event;
    this.getAllFailure()
  }

}
