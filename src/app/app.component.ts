import { Component } from '@angular/core';
import { MenuButtonService } from './shared/services/menu-button.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private menuButtonService: MenuButtonService) {}

}
