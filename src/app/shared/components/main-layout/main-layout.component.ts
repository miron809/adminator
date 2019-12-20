import { Component, OnDestroy, OnInit } from '@angular/core';
import { Action } from '../../../widgets/chat/shared/model/action';
import { ChatService } from '../../services/chat.service';
import { SocketService } from '../../../widgets/chat/shared/services/socket.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  constructor(
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.initChat();
  }

  initChat() {
    this.chatService.initModel();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.chatService.initIoConnection();
      this.chatService.sendNotification(Action.JOINED);
    }, 0);
  }

  ngOnDestroy(): void {
    this.chatService.disconnect();
  }

}
