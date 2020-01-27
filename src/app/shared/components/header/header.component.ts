import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuButtonService } from '../../services/menu-button.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces';
import { from, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isUserDropDownShow = false;
  user: User;
  private unsubscriber: Subject<void> = new Subject<void>();

  constructor(
    private menuButtonService: MenuButtonService,
    private authService: AuthService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.spinner.show();
    this.getUserById();
  }

  getUserById() {
    const userId = {
      idToken: this.authService.token
    };

    this.userService.getUserById(userId)
      .pipe(
        takeUntil(this.unsubscriber),
        switchMap(response => from(response.users)))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
          this.toastr.warning('Something went wrong, try later');
        }
      );
  }

  closeDropdown() {
    this.isUserDropDownShow = false;
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}
