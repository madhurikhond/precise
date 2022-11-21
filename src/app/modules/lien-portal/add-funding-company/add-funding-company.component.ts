import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-funding-company',
  templateUrl: './add-funding-company.component.html',
  styleUrls: ['./add-funding-company.component.css']
})
export class AddFundingCompanyComponent implements OnInit {
  assignment = [];

  constructor() { }

  ngOnInit(): void {
    this.getData();
  }

  onCompanyInfoTabClicked(){}

  onPricingTabClicked(){}

  onMaterialGroupChange(event) {
    console.log(event);
  }
  getData() {
    return (this.assignment = [
      { id: 1, name: 'Email' },
      { id: 2, name: 'Radflow API' },
    ]);
    
  }
}
