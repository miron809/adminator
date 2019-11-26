import { Injectable } from '@angular/core';

@Injectable()
export class MenuButtonService {
  public isCollapsed = false;

  toggleCollapsed() {
    this.isCollapsed = !this.isCollapsed;
  }
}
