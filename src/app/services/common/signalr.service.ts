import { EventEmitter, Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  information = new EventEmitter<string>();
  private hubConnection: HubConnection;

  constructor() {
    this.createConnection();
    this.register();
    this.startConnection();
  }

  private createConnection() {
    let domain = environment.onlyDomain ? environment.onlyDomain : window.location.origin + '/api/';
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(domain + 'inform')
      .configureLogging(LogLevel.Debug)
      .build();
  }

  private register(): void {
    this.hubConnection.on('HubCommunication', (param: string) => {
      this.information.emit(param);
    });
  }

  private startConnection(): void {


    this.hubConnection.stop().then(() => {
      console.log('Connection started.');
    })

    this.hubConnection
      .start()
      .then(() => {
        console.log('Connection started.');
      })
      .catch(err => {
        console.log('Connection fail !');
      });
  }
}