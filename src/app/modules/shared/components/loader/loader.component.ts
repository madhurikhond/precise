import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../../services/common/loading.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  isLoading: boolean = false;
  constructor(loadingService: LoadingService) {
    loadingService.onLoadingChanged.subscribe(res => {
      this.isLoading = res;
    });
  }

  ngOnInit(): void {
  }

}
