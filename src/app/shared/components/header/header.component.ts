import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuButtonService } from '../../services/menu-button.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserDropDownShow = false;
  isEmailDropDownShow = false;
  user: User;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private menuButtonService: MenuButtonService,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getUserById();
  }

  getUserById() {
    this.spinner.show();
    const userId = this.authService.userId;
    this.userService.getUserById(userId)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((user: User) => {
        if (user) {
          this.user = user;
          this.spinner.hide();
        }
      }, () => {
        this.spinner.hide();
      });
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
