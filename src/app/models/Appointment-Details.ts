export class AppointmentDetails {
  upcomingAppointmentDetails: UpcomingAppointmentDetails;
  completedAppointmentDetails: CompletedAppointmentDetails;
  scheduledAppointmentDetails: ScheduledAppointmentDetails;
  scheduleHelperNumber: string = '';
}

export class UpcomingAppointmentDetails {
  address: string = '';
  city: string = '';
  zipCode: string = '';
  state: string = '';
  patientStudyDetail: string = '';
  date: string = '';
  day: string = '';
  time: string = '';
  isWalkedIn: true;
  mapLink: string = '';
  preArrivalTime: string = '';
  englishBody: string = '';
  spanishBody: string = '';
}

export class CompletedAppointmentDetails {
  patientStudyDetail: string = '';
  date: string = '';
  time: string = '';
}

export class ScheduledAppointmentDetails {
  patientStudyDetail: string = '';
  status: string = '';
}
