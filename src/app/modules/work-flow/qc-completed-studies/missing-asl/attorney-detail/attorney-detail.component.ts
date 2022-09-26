import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'attorney-detail',
  templateUrl: './attorney-detail.component.html',
  styleUrls: ['./attorney-detail.component.css']
})
export class AttorneyDetailComponent implements AfterViewInit {
  @Input() data: any;
  attorney: string;
  phone: string;
  fax: string;
  email: string;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.attorney = this.data.key;
    this.phone = this.data.data.items ? this.data.data.items[0].AttorneyPhone : this.data.data.collapsedItems[0].AttorneyPhone;
    this.fax = this.data.data.items ? this.data.data.items[0].AttorneyFaxNumber : this.data.data.collapsedItems[0].AttorneyFaxNumber;
    this.email = this.data.data.items ? this.data.data.items[0].AttorneyEmail : this.data.data.collapsedItems[0].AttorneyEmail;
  }
}
