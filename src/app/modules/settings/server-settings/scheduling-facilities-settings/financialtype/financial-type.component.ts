import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-financial-type',
  templateUrl: './financial-type.component.html',
  styleUrls: ['./financial-type.component.css']
})
export class FinancialTypeComponent implements OnInit {

  constructor(private readonly commonMethodService:  CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Scheduling Facilities Settings');  
  }

}
