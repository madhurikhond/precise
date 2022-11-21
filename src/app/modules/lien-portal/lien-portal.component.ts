import { Component, OnInit,ViewChild } from '@angular/core';


@Component({
  selector: 'app-rad-portal',
  templateUrl: './lien-portal.component.html',
  styleUrls: ['./lien-portal.component.css']
})
export class LienPortalComponent implements OnInit {
  
  fundingCmp :boolean = false;
  fundingSigned :boolean = false; 
  cptGroup :boolean = true;
  readingread :boolean = true;
  check :boolean = false;
  checknumber :boolean = false;
  
  constructor() {
    
   }
  ngOnInit(): void {
   
  }
  logOut(){
    
  }
  clearFilter(){

  }
 
  onPendingBillTabClicked() {
    this.fundingCmp=false;
    this.fundingSigned=false;
    this.cptGroup=true;
    this.readingread=true;
    this.check=false;
    this.checknumber=false;
    
  }
  onAssignUnpaidTabClicked(){
    this.fundingCmp=true;
    this.fundingSigned=true;
    this.cptGroup=false;
    this.readingread=false;
    this.check=false;
    this.checknumber=false;
    
  }
  onAssignPaidTabClicked(){
    this.fundingSigned=false;
    this.fundingCmp=true;
    this.cptGroup=false;
    this.readingread=false;
    this.check=true;
    this.checknumber=false;
   
  }
  onRetainedUnpaidTabClicked(){
    this.fundingSigned=false;
    this.fundingCmp=false;
    this.cptGroup=false;
    this.readingread=false;
    this.check=false;
    this.checknumber=false;
  }
  onRetainedPaidTabClicked(){
    this.fundingSigned=false;
    this.fundingCmp=true;
    this.cptGroup=false;
    this.readingread=false;
    this.check=false;
    this.checknumber=true;
  }


  
}




