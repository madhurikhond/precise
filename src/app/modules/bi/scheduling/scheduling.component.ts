import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css']
})
export class SchedulingComponent implements OnInit {

  constructor(private readonly _commonMethodService: CommonMethodService,
    private readonly router: Router,
    private readonly storageService: StorageService,) {
    this._commonMethodService.getPowerBIUrl(true).subscribe((res: any) => {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = res.response;
      link.setAttribute('visibility', 'hidden');
      link.click();
      this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['dashboard'] : [this.storageService.LastPageURL]);
    });
  }

  ngOnInit(): void {
  }

}
