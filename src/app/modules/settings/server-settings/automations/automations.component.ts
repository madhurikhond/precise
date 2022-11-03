import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';

@Component({
  selector: 'app-automations',
  templateUrl: './automations.component.html',
  styleUrls: ['./automations.component.css']
})
export class AutomationsComponent implements OnInit {

  constructor(private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Automations');
  }

}
