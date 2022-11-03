import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.css']
})
export class BiComponent implements OnInit {

  constructor(private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Bi');
  }

}
