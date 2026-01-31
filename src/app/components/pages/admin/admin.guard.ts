import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  const currentUser = userService.getCurrentUser();

  if (currentUser && currentUser.role === 'ADMIN') {
    return true;
  } else {
    // Redirect to dashboard with error message
    router.navigate(['/dashboard'], {
      queryParams: { error: 'admin_access_denied' }
    });
    return false;
  }
};
