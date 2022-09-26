import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-calender',
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit {

  constructor( private readonly commonMethodService: CommonMethodService,) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Calender');
  }

}
