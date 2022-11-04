import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { LogsService } from 'src/app/services/logs.service';

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.css']
})
export class CommunicationComponent implements OnInit {
  isGoBtnDisabled: boolean;
  public searchTextBoxModal: any;
  constructor(private commonMethodService: CommonMethodService, private logService:LogsService) { }

  ngOnInit(): void {
    
    this.commonMethodService.setTitle('Communication')
    this.logService.setTextFilter().subscribe(textsearch => this.searchTextBoxModal = textsearch);
    this.isGoBtnDisabled = true;
  }
  searchFilter(searchText: any) {
    this.logService.getCommunicationText(searchText);
  }
  clearFilters(searchBox: any) {
    searchBox.value = '';
    this.isGoBtnDisabled = true;
    this.logService.clearFilters('clearFilter');
  } 

}
