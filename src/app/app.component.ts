import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { WebsocketService } from './websocket.service';
import { StateService } from './state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  title = 'client';
  constructor(
    private ws: WebsocketService,
    private state: StateService) {}

  ngOnInit(): void {
    this.ws.subscribe({
      next: msg => console.log(msg),
      error: err => console.error(err),
      complete: () => console.log("websocket closed")
    });
    this.state.scheduleUpdates(1000);
  }
}
