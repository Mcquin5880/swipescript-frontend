import {Component, inject, OnInit} from '@angular/core';
import {AdminService} from '../../_services/admin.service';
import {User} from '../../_models/user';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {

  private adminService = inject(AdminService);
  users: User[] = [];

  ngOnInit(): void {
    this.getUserWithRoles();
  }

  getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
      next: users => {
        this.users = users;
      }
    })
  }

  deleteUser(username: string) {
    this.adminService.deleteUser(username).subscribe({
      next: () => {
        console.log('User deleted successfully:', username);
        this.getUserWithRoles();
      },
      error: (err) => {
        console.error('Failed to delete user:', err);
      }
    });
  }
}
