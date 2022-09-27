import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageSizeArray } from 'src/app/constants/pageNumber';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.css']
})
export class LinkComponent implements OnInit {
  modelValue: string = 'modal';
  modelValue1: string = 'modal';
  addLinkForm: FormGroup;
  editLinkForm: FormGroup;
  totalRecords: number;
  pageNumber: number = 1;
  pageSize: number = 50;
  linkList: any = []
  submitted = false;
  linkId: number;

  resizingModes: string[] = ['widget', 'nextColumn'];
  columnResizingMode: string;
  showFilterRow: boolean;
  applyFilterTypes: any = [{ key: 'auto', name: 'Immediately' }, { key: 'onClick', name: 'On Button Click' }];
  currentFilter: any;
  showHeaderFilter: boolean;
  SearchForm: FormGroup;
  searchText: string;
  readonly pageSizeArray = PageSizeArray;
  constructor(private fb: FormBuilder, private settingService: SettingsService,
    private notificationService: NotificationService, private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.columnResizingMode = this.resizingModes[0];
    this.showFilterRow = true;
    this.currentFilter = this.applyFilterTypes[0].key;
    this.showHeaderFilter = false;

    this.commonMethodService.setTitle('Link');
    this.getLinks();
    this.addLinkForm = this.fb.group({
      link: ['', [Validators.required]],
      anchor: [''],
      description: [''],
      category: ['']
    });

    this.editLinkForm = this.fb.group({
      link: ['', [Validators.required]],
      anchor: [''],
      description: [''],
      category: ['']
    });
    this.SearchForm = this.fb.group({
      Search: ['']
    });
  }
  onPageSizeChange(event) {
    this.pageSize = event;
    this.pageNumber = 1;
    this.getLinks();
  }

  Search() {
    this.searchText = this.SearchForm.get('Search').value
    this.getLinks()
  }
  Clear() {
    this.SearchForm.patchValue({
      Search: ''
    });
    this.searchText = '';
    this.getLinks()
  }
  getLinks() {
    this.settingService.getLinks(true, this.pageNumber, this.pageSize, this.searchText).subscribe((res) => {
      var data: any = res;
      this.totalRecords = 1;
      this.linkList = [];
      if (data.response != null && data.response.length > 0) {
        this.linkList = data.response;
        this.totalRecords = res.totalRecords
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  pageChanged(event) {
    this.pageNumber = event;
    this.getLinks()
  }

  onInsertSubmit() {
    this.submitted = true;
    this.modelValue = 'modal';
    if (this.addLinkForm.invalid) {
      this.modelValue = '';
      return;
    }
    this.saveLink();
  }

  onUpdateSubmit() {
    this.submitted = true;
    this.modelValue1 = 'modal';
    if (this.editLinkForm.invalid) {
      this.modelValue1 = '';
      return;
    }
    this.saveLink();
  }

  add() {
    this.linkId = null;
    this.submitted = false;
    this.addLinkForm.reset();
  }

  edit(linkId) {
    this.submitted = false;
    this.editLinkForm.reset();
    this.linkId = linkId;
    this.getLinkById(linkId);
  }

  delete(linkId) {
    this.linkId = linkId;
  }

  getLinkById(linkId) {
    this.settingService.getLinkById(true, linkId).subscribe((res) => {
      var data: any = res;
      if (data.response != null) {
        this.editLinkForm.patchValue({
          link: data.response.Link,
          anchor: data.response.Anchor,
          description: data.response.Description,
          category: data.response.Category
        });
      }
      else {
        this.notificationService.showNotification({
          alertHeader: data.statusText,
          alertMessage: data.message,
          alertType: data.responseCode
        });
      }
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  saveLink() {
    if (this.linkId == null) {
      var data = {
        'linkId': this.linkId,
        'link': this.addForm.link.value,
        'anchor': this.addForm.anchor.value,
        'description': this.addForm.description.value,
        'category': this.addForm.category.value
      }
      this.settingService.addLink(true, data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getLinks();
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
    else {
      var data = {
        'linkId': this.linkId,
        'link': this.editForm.link.value,
        'anchor': this.editForm.anchor.value,
        'description': this.editForm.description.value,
        'category': this.editForm.category.value
      }
      this.settingService.updateLink(true, data).subscribe((res) => {
        if (res) {
          this.notificationService.showNotification({
            alertHeader: 'Success',
            alertMessage: res.message,
            alertType: res.responseCode
          })
        }
        this.getLinks();
      },
        (err: any) => {
          this.notificationService.showNotification({
            alertHeader: err.statusText,
            alertMessage: err.message,
            alertType: err.status
          });
        });
    }
  }

  deleteLink() {
    this.settingService.deleteLink(true, this.linkId).subscribe((res) => {
      if (res) {
        this.notificationService.showNotification({
          alertHeader: 'Success',
          alertMessage: res.message,
          alertType: res.responseCode
        })
      }
      this.getLinks();
    },
      (err: any) => {
        this.notificationService.showNotification({
          alertHeader: err.statusText,
          alertMessage: err.message,
          alertType: err.status
        });
      });
  }

  get addForm() { return this.addLinkForm.controls; }
  get editForm() { return this.editLinkForm.controls; }
}
