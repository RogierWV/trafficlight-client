import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends WebSocketSubject<any> {
  constructor() {
    super(`ws://${window.location.hostname}/ws`)
  }
}
