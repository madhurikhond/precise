import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-revised-bill',
  templateUrl: './revised-bill.component.html',
  styleUrls: ['./revised-bill.component.css']
})
export class RevisedBillComponent implements OnInit {
  revisedForm: FormGroup;
  submitted = false;
  
  constructor(private fb: FormBuilder,  
     private readonly commonMethodService: CommonMethodService) { }

  ngOnInit(): void {
    this.commonMethodService.setTitle('Revised Bill');
    this.revisedForm = this.fb.group({
      patientId:['', [Validators.required]]
    }); 
  }

  onSubmit(){
    this.submitted = true;
    if (this.revisedForm.invalid) {
      return;
    }
    alert('Form valid.');
    //this.saveDocumentType();
  }

  get rForm() { return this.revisedForm.controls; }
}
