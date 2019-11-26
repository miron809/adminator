import { Component, OnInit } from '@angular/core';
import { MenuButtonService } from '../../services/menu-button.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isUserDropDownShow = false;
  isEmailDropDownShow = false;

  constructor(private menuButtonService: MenuButtonService) { }

  ngOnInit() {
  }

}
