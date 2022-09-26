import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.css']
})
export class DefaultsComponent implements OnInit {

  constructor(
    private readonly commonMethodService : CommonMethodService 
  ) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Ar Settings');
  }

}
