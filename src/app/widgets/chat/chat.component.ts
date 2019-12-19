import { Component, OnInit } from '@angular/core';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { Action } from './shared/model/action';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  action = Action;
  user: User;
  messages: Message[] = [];
  messageContent: string;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.chatService.messages$.subscribe(resp => {
      if (resp) {
        this.messages.push(resp);
      }
    });
  }

  sendMessage(message: string): void {
    this.chatService.sendMessage(message);
    this.messageContent = null;
  }

}
