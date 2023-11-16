import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRequestInfo } from './user.type';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRequestInfo => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request;
    const { sub } = user;
    return { id: sub, ...user };
  },
);
