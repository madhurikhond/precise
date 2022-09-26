import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../services/common/loading.service';
import { BrokerService } from 'src/app/services/broker.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;
  constructor(loadingService: LoadingService ,brokerService :BrokerService ) {
    brokerService.sendDataToLoaderComponentFromBrokerComponent.subscribe(res => {
      this.isLoading = res;
     });
    loadingService.onLoadingChanged.subscribe(res => {
      this.isLoading = res;
    });
  }

  ngOnInit(): void {
  }

}
