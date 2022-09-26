import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DwtService } from '../../../../services/dwt.service';

@Component({
  selector: 'app-docdwt',
  templateUrl: './docdwt.component.html',
  styleUrls: ['./docdwt.component.css']
})
export class DocdwtComponent implements OnInit {
  @ViewChild('hiddenDynamsoftScannerPopUp1', { static: false }) hiddenDynamsoftScannerPopUp: ElementRef;

  eventsSubject: Subject<void> = new Subject<void>();

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.eventsSubject.next(event);
  }
  @Input() data;
  currentEnv = "";
  bStartUp = true;
  bNoInstall = false;
  bMobile = false;
  bShowCameraOption = false;
  bUseCameraViaDirectShow = false;
  startText = 'start Scanner';
  constructor(protected dwtService: DwtService,) { }

  ngOnInit(): void {
    let env = this.dwtService.runningEnvironment;
    if (env.bMobile) {
      this.bMobile = env.bMobile;
      this.currentEnv += env.bChrome ? "Chrome " + env.strChromeVersion : "";
      this.currentEnv += env.bFirefox ? "Firefox " + env.strFirefoxVersion : "";
      this.currentEnv += env.bSafari ? "Safari" : "";
    } else {
      if (env.bWin)
        this.bShowCameraOption = true;
      this.currentEnv += env.bWin ? "Windows, " : "";
      this.currentEnv += env.bLinux ? "Linux, " : "";
      this.currentEnv += env.bChrome ? "Chrome " + env.strChromeVersion : "";
      this.currentEnv += env.bFirefox ? "Firefox " + env.strFirefoxVersion : "";
      this.currentEnv += env.bSafari ? "Safari" : "";
      this.currentEnv += env.bIE ? "Internet Explorer" + env.strIEVersion : "";
      this.currentEnv += env.bEdge ? "Edge" : "";
    }
    this.bStartUp = !this.bStartUp;
    this.dwtService.bUseService = !this.bNoInstall;
    this.dwtService.bUseCameraViaDirectShow = this.bUseCameraViaDirectShow && !this.bNoInstall;

  }

  toggleStartDemo() {

    if (this.startText === 'start Scanner') {
      this.startText = 'Close Scanner'
    }
    else {
      this.startText = 'start Scanner'
    }
    this.bStartUp = !this.bStartUp;
    this.dwtService.bUseService = !this.bNoInstall;
    this.dwtService.bUseCameraViaDirectShow = this.bUseCameraViaDirectShow && !this.bNoInstall;

  }
  Start() {
    this.hiddenDynamsoftScannerPopUp.nativeElement.click();
  }
}
