import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-pay-rad',
  templateUrl: './pay-rad.component.html',
  styles: [
  ]
})
export class PayRadComponent implements OnInit {
  dropDownList:any=[
    {dropDownName: 'Show All'},
    {dropDownName: 'Ready for Pickup'},
    {dropDownName: 'Processing'},
    {dropDownName: 'Picked Up'},
    {dropDownName: 'Picked Up Today'},
    {dropDownName: 'Entered Today'},
    {dropDownName: 'See Notes'}
   ]; 
   
  constructor(private readonly commonMethodService : CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Pay Rad');
  }
  filterDropDownOnChange()
  {
     
  }
}
