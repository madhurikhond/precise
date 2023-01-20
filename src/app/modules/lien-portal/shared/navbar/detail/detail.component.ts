import { Component, Input, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  @Input() parentItem:any
  @Input() index:number=0;
  @Input() parentId=''
  @Input() liClass=''
  constructor() {
   }

  ngOnInit(): void {  
    
  } 

  makeActive() { 

  }
}
