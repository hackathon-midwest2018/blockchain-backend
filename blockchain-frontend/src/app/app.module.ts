import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from "./scene/scene.component";
import { StagingArea } from "./stagingArea/stagingArea.component";
import { SocketService } from "./socket/socket.service";
@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
    StagingArea
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
