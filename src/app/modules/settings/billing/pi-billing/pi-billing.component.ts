import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-pi-billing',
  templateUrl: './pi-billing.component.html',
  styleUrls: []
})
export class PiBillingComponent implements OnInit {

  constructor(private readonly commonMethodService : CommonMethodService ) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Pi Billing'); 
  }
}
