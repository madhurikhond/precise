import { EventEmitter, Output, ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FacilityService } from 'src/app/services/facillities/facility.service';


@Component({
  selector: 'app-facility-management',
  templateUrl: './facility-management.component.html',
  styleUrls: ['./facility-management.component.css']
})
export class FacilityManagementComponent implements OnInit {
  @ViewChild('searchBox', { static: true }) searchBoxRef: ElementRef;
  @ViewChild('selectUserType', { static: true }) UserTypeRef: ElementRef;

  isGoBtnDisabled: boolean;
  public searchTextBoxModal: any;
  public userDropDownModal: any;
  selectedUploadFile: File = null;
  fileMessage: string = '';
  isExcel: boolean = false;
  constructor(private facilityService: FacilityService) { }
  ngOnInit(): void {
    this.facilityService.setTextFilter().subscribe(textsearch => this.searchTextBoxModal = textsearch);
    this.facilityService.setUserDropFilter().subscribe((dropDownText) =>
      this.userDropDownModal = dropDownText);
    this.isGoBtnDisabled = true;
  }
  getSearchBoxText(searchText: any, selectedUserTypeText: any) {
    this.getFacilityFilterText(searchText, selectedUserTypeText);
  }
  onUserTypeChange(selectedUserTypeText: any, searchText: any) { 
    this.getFacilityFilterText(searchText, selectedUserTypeText);
  }
  getFacilityFilterText(searchText: any, selectedUserTypeText: any) {
    this.facilityService.getFacilityFilterText(searchText, selectedUserTypeText);
  }
  onActionChange(actionText: string) {
    this.isGoBtnDisabled = true;
    if (actionText !== 'Select an Action') {
      this.isGoBtnDisabled = false;

    }
  }
  clearFilters(searchBox: any, selectUserType: any, selectAction: any) {
    searchBox.value = '';
    selectUserType[0].selected = true;
    selectAction[0].selected = true;
    this.isGoBtnDisabled = true;
    this.facilityService.clearFilters('clearFilter');
  }
  goEventFire(actionValue: any) {    
      this.facilityService.sendActionDropText(actionValue);
  }
  onFileSelected(event: any) {
    
    this.fileMessage = '';
    this.selectedUploadFile = <File>event.target.files[0];
    this.isExcel = !!event.target.files[0].name.match(/(.xls|.xlsx)/);
    if (!this.isExcel) {
      this.fileMessage = 'Allow Only Excel (xls | xlsx) File.'
      return;
    }
  }
  
    
  searchFilter(searchText: any, selectedUserTypeText: any) {
    
    this.facilityService.getFacilityFilterText(searchText, selectedUserTypeText);
  } 
}
