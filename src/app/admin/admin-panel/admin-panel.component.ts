import {Component, inject} from '@angular/core';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {UserManagementComponent} from '../user-management/user-management.component';
import {NgIf} from '@angular/common';
import {AccountService} from '../../_services/account.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    TabsetComponent,
    TabDirective,
    UserManagementComponent,
    NgIf
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

  accountService = inject(AccountService);

}
