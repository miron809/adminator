import { Injectable } from '@angular/core';
import { Message } from '../../widgets/chat/shared/model/message';
import { Event } from '../../widgets/chat/shared/model/event';
import { Action } from '../../widgets/chat/shared/model/action';
import { SocketService } from '../../widgets/chat/shared/services/socket.service';
import { User } from '../../widgets/chat/shared/model/user';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Injectable()

export class ChatService {
  public user: User;
  messages: Message[] = [];
  ioConnection: any;

  constructor(private socketService: SocketService) { }

  public initModel(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
      name: 'test',
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  public initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(message);
      });

    this.socketService.onEvent(Event.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(Event.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  get messageHistory() {
    return this.messages;
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message
    });
  }

  public sendNotification(action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action: action
      };
    }
    this.socketService.send(message);
  }

  public disconnect(): void {
    this.socketService.disconnect();
    this.messages = [];
  }


}
