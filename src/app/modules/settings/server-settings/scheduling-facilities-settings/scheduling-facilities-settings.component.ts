import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
@Component({
  selector: 'app-scheduling-facilities-settings',
  templateUrl: './scheduling-facilities-settings.component.html',
  styleUrls: ['./scheduling-facilities-settings.component.css']
})
export class SchedulingFacilitiesSettingsComponent implements OnInit {

  constructor(private readonly commonMethodService : CommonMethodService ) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Scheduling Facilities Settings');  
  }

}
