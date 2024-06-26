import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { Role } from 'src/auth/models/roles.model';

import { ROLE_KEY } from './../../decorators/roles.decorator';
import { PayloadToken } from './../../models/token.models';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLE_KEY, context.getHandler());

    if (!roles) {
      const request = context.switchToHttp().getRequest();
      const user = request.user as PayloadToken;

      const isAuth = roles.some((role) => role === user.role);

      if (!isAuth) {
        throw new UnauthorizedException('Your wole is wrong');
      }
      return isAuth;
    }

    return true;
  }
}
