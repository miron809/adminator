import { Component, OnDestroy, OnInit } from '@angular/core';
import { Action } from '../../../widgets/chat/shared/model/action';
import { ChatService } from '../../services/chat.service';
import { switchMap, takeUntil } from 'rxjs/operators';
import { from, Subject } from 'rxjs';
import { User } from '../../interfaces';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private chatService: ChatService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUserById();
  }

  getUserById() {
    this.spinner.show();
    const userId = {
      idToken: this.authService.token
    };

    this.userService.getUserById(userId)
      .pipe(
        takeUntil(this.unsubscriber),
        switchMap(response => from(response.users)))
      .subscribe(
        (user: User) => {
          this.initChat(user);
          this.spinner.hide(
          );
        },
        () => {
          this.spinner.hide();
          this.toastr.warning('Something went wrong, try later');
        }
      );
  }

  initChat(user) {
    this.chatService.initModel(user);
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
