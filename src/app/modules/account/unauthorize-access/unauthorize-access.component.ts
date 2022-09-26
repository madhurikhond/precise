import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-unauthorize-access',
  templateUrl: './unauthorize-access.component.html',
  styleUrls: ['./unauthorize-access.component.css']
})
export class UnauthorizeAccessComponent implements OnInit {

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,) { }

  ngOnInit(): void {
  }
  backPage():void{
    this.router.navigate((this.storageService.LastPageURL === null || this.storageService.LastPageURL === '') ? ['login'] : [this.storageService.LastPageURL]);
  }
}
