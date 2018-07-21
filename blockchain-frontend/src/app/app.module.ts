import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SceneComponent } from "./scene/scene.component";
import { SocketComponent } from "./socket/socket.component";
import { SocketService } from "./socket/socket.service";
@NgModule({
  declarations: [
    AppComponent,
    SceneComponent,
    SocketComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
