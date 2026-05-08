import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  const allowedRoles = (route.data?.['roles'] as string[] | undefined)?.map((role) =>
    role.toUpperCase()
  );

  if (!allowedRoles?.length) {
    return true;
  }

  const currentRole = auth.getRole();
  if (currentRole && allowedRoles.includes(currentRole)) {
    return true;
  }

  router.navigateByUrl(auth.getHomeUrl());
  return false;
};
