import { core } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styles: [
  ]
})
export class CoreComponent implements OnInit {
  isOpened = true;
  constructor(private common:CommonMethodService,
    private storageService: StorageService) {
      if(this.storageService.getItem('isSideNavOpned')){
        this.isOpened = this.storageService.getItem('isSideNavOpned');
      }
     }

  ngOnInit(): void {
    this.common.isSidenavOpened.subscribe((value:any)=>{
      if(value){
         this.isOpened = !this.isOpened;
         this.storageService.setItem('isSideNavOpned',this.isOpened);
      }
    })
  }
}
