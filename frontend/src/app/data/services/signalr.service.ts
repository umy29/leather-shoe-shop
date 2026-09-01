import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection | undefined;

  public shoesUpdated$ = new Subject<void>();
  public ordersUpdated$ = new Subject<void>();

  public startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
                            .withUrl('http://localhost:5277/appHub')
                            .withAutomaticReconnect()
                            .build();

    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch(err => console.log('Error while starting connection: ' + err));

    this.addListeners();
  }

  private addListeners() {
    this.hubConnection?.on('ShoesUpdated', () => {
      this.shoesUpdated$.next();
    });

    this.hubConnection?.on('OrdersUpdated', () => {
      this.ordersUpdated$.next();
    });
  }
}
