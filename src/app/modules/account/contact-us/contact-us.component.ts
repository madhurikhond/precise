import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonRegex } from 'src/app/constants/commonregex';
import { AccountService } from 'src/app/services/account.service';
import { CommonMethodService } from 'src/app/services/common/common-method.service';
import { NotificationService } from 'src/app/services/common/notification.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  contactUsForm: FormGroup;
  submitted = false
  constructor(private fb: FormBuilder,
    private readonly accountService: AccountService,
    private readonly notificationService: NotificationService, 
    private readonly commonMethodService: CommonMethodService,
    private router: Router) { }
    readonly commonRegex=CommonRegex;
  ngOnInit(): void {
    this.contactUsForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(this.commonRegex.EmailRegex)]],
      company: [''],
      phone: ['', [Validators.pattern(this.commonRegex.PhoneRegex)]],
      message: ['', [Validators.required]],
    })
    this.commonMethodService.setTitle('Contact us');

  }
  //Contact us form submission
  onSubmit() {
    this.submitted = true;
    if (!this.contactUsForm.valid) {
      return;
    }
    this.accountService.ContactUs(JSON.stringify(JSON.stringify(this.contactUsForm.value)), true).subscribe((res) => {
      var data: any = res; 
      if (data?.responseCode && data.message) {
        this.showNotificationOnSucess(data.message); 
        this.contactUsForm.reset();
        this.submitted=false;
      }
      else { 
      }

    }, (err: any) => {
      this.showError(err);
    }
    );
  }
  showNotificationOnSucess(data: any) {
    this.notificationService.showNotification({
      alertHeader: 'Success',
      alertMessage: data,
      alertType: 200
    });
  }

  // common Error Method
  showError(err: any) {
    this.notificationService.showNotification({
      alertHeader: err.statusText,
      alertMessage: err.message,
      alertType: err.status
    });
  }


  get cuForm() { return this.contactUsForm.controls; }
}
