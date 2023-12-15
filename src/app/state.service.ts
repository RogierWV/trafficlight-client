import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';

export enum LightColor {
  Red = "red",
  Orange = "orange",
  Green = "green"
}

export enum LightType {
  Dummy,
  Car,
  Ped,
  Bicycle,
  Bus,
  Train
}

export interface Light {
  trafficLight: number;
  count?: number;
  status: LightColor;
  type?: LightType
}

export interface State {
  state: Light[];
}

export function isLight(o: any): o is Light {
  return "trafficLight" in o && "status" in o;
}

export function isLightArray(o: any): o is Light[] {
  return Array.isArray(o) && 
    o.map(l => isLight(l))
      .reduce((p,n) => p && n, true);
}

export function isState(o: any): o is State {
  return "state" in o && isLightArray(o.state);
}

const dummyWL: Light = {trafficLight: 0, count: 0,status: LightColor.Red, type: LightType.Dummy};

@Injectable({
  providedIn: 'root'
})
export class StateService {
  
  state: State = {
    state: [
      dummyWL, // dummy node to ensure array indexing gets correct item
      {trafficLight: 1, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 2, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 3, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 4, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 5, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 6, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 7, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 8, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 9, type: LightType.Car, count: 0, status: LightColor.Red},
      {trafficLight: 10, type: LightType.Car, count: 0, status: LightColor.Red},
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      {trafficLight: 21, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 22, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 23, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 24, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 25, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 26, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 27, type: LightType.Ped, count: 0, status: LightColor.Red},
      {trafficLight: 28, type: LightType.Ped, count: 0, status: LightColor.Red},
      dummyWL,
      dummyWL,
      {trafficLight: 31, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 32, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 33, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 34, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 35, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 36, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 37, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      {trafficLight: 38, type: LightType.Bicycle, count: 0, status: LightColor.Red},
      dummyWL,
      dummyWL,
      dummyWL,
      {trafficLight: 42, type: LightType.Bus, count: 1, status: LightColor.Red},
      dummyWL,
      dummyWL,
      {trafficLight: 45, type: LightType.Train, count: 0, status: LightColor.Red},
      {trafficLight: 46, type: LightType.Train, count: 0, status: LightColor.Red},
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
      dummyWL,
    ]
  };
  constructor( private ws: WebsocketService ) {
    ws.subscribe({
      next: msg => {
        let newState: State;
        if(typeof msg == "string") {
          newState = JSON.parse(msg);
        } else if (isState(msg)) {
          newState = msg;
        } else {
          console.log(typeof msg);
        }
        this.state.state = this.state.state.map((l: Light) => {
          if (l.type != LightType.Dummy) {
            l.status = newState.state.filter((nl: Light) => nl.trafficLight === l.trafficLight)[0].status
          }
          return l;
        });
      }
    });
  }

  scheduleUpdates(ms: number) {
    setTimeout(() => {
      this.send();
      this.scheduleUpdates(ms);
    }, ms);
  }

  send() {
    this.ws.next({
      state: this.state.state.filter(l => l.type != LightType.Dummy).map(
        ({status, type, ...item}) => item)
    });
  }
}
