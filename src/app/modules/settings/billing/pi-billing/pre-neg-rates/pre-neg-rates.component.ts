import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-pre-neg-rates',
  templateUrl: './pre-neg-rates.component.html',
  styleUrls: []
})
export class PreNegRatesComponent implements OnInit {

  constructor(private readonly commonMethodService :CommonMethodService ) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Pi Billing');
  }

}
