import { Component, OnInit,ViewChild } from '@angular/core';


@Component({
  selector: 'app-lien-funding-co',
  templateUrl: './lien-funding-co.component.html',
  styleUrls: ['./lien-funding-co.component.css']
})
export class LienFundingCoComponent implements OnInit {
  
  readingread :boolean = true;
  check :boolean = true;
  batch :boolean = true;
  
  constructor() {
    
   }
  ngOnInit(): void {
   
  }
  logOut(){
    
  }
  clearFilter(){

  }
 
  onPendingSignatureTabClicked() {
    this.readingread=true;
    this.check=true;
    this.batch=false;
    
  }
  onFundingCoUnpaidTabClicked(){
    this.readingread=true;
    this.check=false;
    this.batch=true;
    
  }
  onFundingCoPaidTabClicked(){
    this.readingread=true;
    this.check=true;
    this.batch=true;
   
  }
}





