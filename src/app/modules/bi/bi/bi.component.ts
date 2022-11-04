import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-bi',
  templateUrl: './bi.component.html',
  styleUrls: ['./bi.component.css']
})
export class BiComponent implements OnInit {
  redirectLinkWithPermission:any;
  constructor(private readonly _commonMethodService: CommonMethodService,
    private readonly router: Router,
    private readonly storageService: StorageService,) {
    this._commonMethodService.getPowerBIUrl(true).subscribe((res: any) => {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = res.response;
      link.setAttribute('visibility', 'hidden');
      link.click();
      this.redirectLinkWithPermission = this.redirectLinkPremission(this.storageService.UserRole)
      this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? [this.redirectLinkWithPermission] : [this.storageService.LastPageURL]);
    });
  }

  ngOnInit(): void {
    
  }
  redirectLinkPremission(data: any)
  {
    var valReturn: any;
    let list: any = [];
    let responseHierarchy = JSON.parse(data);
        if (responseHierarchy && responseHierarchy.length) {
          responseHierarchy.forEach((value) => {
            if (value && value.hierarchy) {
              value.hierarchy = JSON.parse(value.hierarchy);
            }
          });
        }
        for (let i = 0; i < responseHierarchy.length; i++) {
          list.push(responseHierarchy[i].hierarchy);
          if(list[0].Url!=='')
          {
            valReturn=list[0].Url
          }
          else if(list[0].Url=='' && list[0].Children)
          {
            valReturn=list[0].Children[0].Url
          }
        }
        return valReturn;
  }
}
