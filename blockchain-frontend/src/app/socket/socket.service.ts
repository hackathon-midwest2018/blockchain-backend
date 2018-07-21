import { Injectable } from '@angular/core';
const SERVER_URL = 'ws://localhost:2998';

@Injectable()
export class SocketService {
    private socket;
    
    public initSocket(): void {
        // this.socket = socketIo(SERVER_URL);
        this.socket = new WebSocket(SERVER_URL);
    }

    public onMessage(){
        this.socket.onmessage('message', (data: any) => {
            console.log(data);
        });
    }
}