import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

export interface StandardResponse<T> {
    code: number;
    status: string;
    message: string;
    timestamp: string;
    data: T | null;
}

@Injectable()
export class ResponseInterceptor<T = unknown>
    implements NestInterceptor<T, StandardResponse<T | null>>
{
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<StandardResponse<T | null>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse<Response>();
        const httpStatus = response.statusCode;

        const httpStatusMessage = HttpStatus[httpStatus]
            ? HttpStatus[httpStatus].replace(/_/g, ' ')
            : 'Success';

        return next.handle().pipe(
            map((data: T): StandardResponse<T | null> => {
                return {
                    code: httpStatus,
                    status: httpStatusMessage,
                    message: 'Success',
                    timestamp: new Date().toISOString(),
                    data: data ?? null,
                };
            }),
        );
    }
}
