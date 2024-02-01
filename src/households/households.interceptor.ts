import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HouseholdsService } from './households.service';

export const INTERCEPT_ROUTES = [
  '/transactions',
  '/budgets',
  '/classifications',
];

@Injectable()
export class HouseholdsInterceptor implements NestInterceptor {
  constructor(private readonly householdsService: HouseholdsService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (this.shouldIntercept(request) && user) {
      const householdId = await this.householdsService.getHouseholdIdByUserId(
        user.sub,
      );
      request['householdId'] = householdId;
    }

    return next.handle().pipe(tap());
  }

  private shouldIntercept(request: any): boolean {
    return INTERCEPT_ROUTES.some((route) => request.url.startsWith(route));
  }
}
