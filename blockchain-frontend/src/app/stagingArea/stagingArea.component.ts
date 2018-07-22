import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { SocketService } from '../socket/socket.service';

@Component({
  selector: 'staging-area',
  templateUrl: './stagingArea.component.html',
  styleUrls: ['./stagingArea.component.css']
})
export class StagingArea implements AfterViewInit{
    constructor(private socketService: SocketService) {}
    /* LIFECYCLE */
    ngAfterViewInit() {
    }
}
