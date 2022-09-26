import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { WorkflowService } from 'src/app/services/work-flow-service/workflow.service';

@Component({
  selector: 'app-comm-failure',
  templateUrl: './comm-failure.component.html',
  styleUrls: ['./comm-failure.component.css']
})
export class CommFailureComponent implements OnInit {

  isGoBtnDisabled: boolean;
  public searchTextBoxModal: any;
  public resolvedDropDownModal: any;
  pageNumber: number = 1;
  pageSize: number = 50;
  constructor(private workflowService: WorkflowService,private readonly router: Router) { }

  ngOnInit(): void {
    this.workflowService.setTextFilter().subscribe(textsearch => this.searchTextBoxModal = textsearch);
    this.isGoBtnDisabled = true;
  }

  searchFilter(searchText: any) { 
    this.workflowService.getFacilityText(searchText);
  }
  clearFilters(searchBox: any) {
    searchBox.value = '';
    this.isGoBtnDisabled = true;
    this.workflowService.clearFilters('clearFilter');
  } 
}
