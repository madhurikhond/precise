import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private readonly _storageService: StorageService,
    private readonly _router: Router,
    private readonly _commonMethodService: CommonMethodService) { }

  data: any = '';
  username: any = '';
  list: any = [];


  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    this.data = this._storageService.user;
    this.username = this.data.FirstName;
  }

  logOut() {
    this._commonMethodService.clearAllSubjects();
    this._storageService.clearAll();
    localStorage.removeItem('user');
    localStorage.removeItem('roles');
    this._router.navigate(['login']);
    localStorage.removeItem('_cr_u_infor');
    localStorage.removeItem('storage');
    localStorage.removeItem('isPermissionChanged');
  }

}
