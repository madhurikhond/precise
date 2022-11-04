import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgbTabsetConfig } from '@ng-bootstrap/ng-bootstrap';
import { PatientPortalService } from 'src/app/services/patient-portal/patient.portal.service';
import { AppointmentDetails, CompletedAppointmentDetails, UpcomingAppointmentDetails } from 'src/app/models/Appointment-Details';
import { StorageService } from 'src/app/services/common/storage.service';

@Component({
  selector: 'app-my-appointments',
  templateUrl: './my-appointments.component.html',
  styleUrls: ['./my-appointments.component.css'],
  providers: [NgbTabsetConfig]
})
export class MyAppointmentsComponent implements OnInit {

  appointmentDetails:AppointmentDetails;
  currentLanguage: any;
  isTool:boolean = false;
  isToolEs: boolean = false;


  constructor(config: NgbTabsetConfig,private patientPortalService: PatientPortalService,
    private storageService: StorageService) {
    config.justify = 'center';
    config.type = 'pills';
   }

  ngOnInit(): void {
    this.currentLanguage = this.storageService.getPatientLanguage();
   this.GetAppointmentDetails();
 }

 GetAppointmentDetails(){
  var request ={
    patientId : this.patientPortalService.patientDetail.patientId,
  }
 this.patientPortalService.GetAppointmentDetails(request).subscribe(res=>{
  this.appointmentDetails = res.result;
 })
 }

 toolTipVisible(){
  this.isTool = !this.isTool;
 }

 toolTipVisibleForES(){
  this.isToolEs = !this.isToolEs;
 }

 hideToolTip(){
  this.isTool = false;
  this.isToolEs = false;
 }

}

