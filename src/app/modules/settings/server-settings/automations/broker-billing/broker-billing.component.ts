import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-broker-billing',
  templateUrl: './broker-billing.component.html',
  styleUrls: ['./broker-billing.component.css']
})
export class BrokerBillingComponent implements OnInit {
  financialTypeList:any=[];
  radiusStatusList :any=[];
  selectedFinancialTypeList:any=[];
  selectedRadiusStatus:any=[];
  borkerBillingForm:FormGroup;
  constructor(private fb: FormBuilder,
              private readonly commonService:CommonMethodService) { }

  ngOnInit(): void {
    this.borkerBillingForm = this.fb.group({
     
      financialType:[''],
      radiusStatus:['']
    });
  }
  allowNumberOnly(event:any): boolean
  {
    return this.commonService.alowNumberOnly(event);
  }
  
}
