import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { Message } from './shared/model/message';
import { User } from './shared/model/user';
import { Action } from './shared/model/action';
import { ChatService } from '../../shared/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit {
  action = Action;
  user: User;
  messages: Message[] = [];
  messageContent: string;

  // getting a reference to the overall list, which is the parent container of the list items
  @ViewChild('chatBody', { static: false }) chatBody: ElementRef;

  // getting a reference to the items/messages within the list
  @ViewChildren('chatItem', { read: ElementRef }) chatItem;

  constructor(private chatService: ChatService) { }

  ngOnInit(): void {
    this.messages = this.chatService.messageHistory;
  }

  ngAfterViewInit(): void {
    // subscribing to any changes in the list of items / messages
    this.chatItem.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  sendMessage(message: string): void {
    this.chatService.sendMessage(message);
    this.messageContent = null;
  }

}
