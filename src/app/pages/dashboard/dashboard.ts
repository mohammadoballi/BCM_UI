import { Component } from '@angular/core';
import { UI_COMPONENTS } from '../../shared/components/UI/ui-module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [...UI_COMPONENTS],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

}
