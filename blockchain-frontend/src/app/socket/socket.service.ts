import { Injectable } from '@angular/core';
const SERVER_URL = 'ws://localhost:2998';
import { Observable, of, Observer } from 'rxjs';

@Injectable()
export class SocketService {
    private socket;
    public obs;
    public observer: Observable<any>;

    constructor(){
        this.socket = null;
        this.obs = null;
    }
    

    initSocket() {
        this.socket = new WebSocket(SERVER_URL);
        // this.onMessage();
        this.socket.onmessage = (event) => {
            console.log(this.obs);
            this.obs.next(JSON.parse(event.data));
        };       
    }

    onMessage(){
        return new Observable((observer) => {
            this.obs = observer;
            console.log(this.obs);
        })
    
    }
}