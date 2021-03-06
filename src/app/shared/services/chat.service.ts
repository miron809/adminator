import { Injectable } from '@angular/core';
import { Message } from '../../widgets/chat/shared/model/message';
import { Event } from '../../widgets/chat/shared/model/event';
import { Action } from '../../widgets/chat/shared/model/action';
import { SocketService } from '../../widgets/chat/shared/services/socket.service';
import { User } from '../../widgets/chat/shared/model/user';

@Injectable()

export class ChatService {
  public user: User;
  messages: Message[] = [];
  ioConnection: any;

  constructor(private socketService: SocketService) { }

  public initModel(user): void {
    this.user = {
      id: user.localId,
      name: user.displayName,
      avatar: user.photoUrl,
    };
  }

  public initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.onMessage()
      .subscribe((message: Message) => {
        this.messages.push(
          {...message,
          date: new Date()}
          );
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

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this.socketService.send({
      from: this.user,
      content: message,
      date: new Date()
    });
  }

  public sendNotification(action: Action): void {
    let message: Message;

    if (action === Action.JOINED) {
      message = {
        from: this.user,
        action
      };
    }
    this.socketService.send(message);
  }

  public disconnect(): void {
    this.socketService.disconnect();
    this.messages = [];
  }
}
