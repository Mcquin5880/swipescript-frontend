import { CanActivateFn } from '@angular/router';
import {AccountService} from '../_services/account.service';
import {inject} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);

  if (accountService.roles().includes('ROLE_ADMIN')) {
    return true;
  } else {
    toastr.error('YOU SHALL NOT PASS!');
    return false;
  }
};
