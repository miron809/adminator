import { Component, OnDestroy, OnInit } from '@angular/core';
import { Action } from '../../../widgets/chat/shared/model/action';
import { User } from '../../../widgets/chat/shared/model/user';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

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

}
