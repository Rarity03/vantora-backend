import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';

interface NestErrorResponse {
    statusCode: number;
    message: string | string[];
    error: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let httpStatus: number;
        let message: string | string[];
        let statusName: string;

        if (exception instanceof HttpException) {
            httpStatus = exception.getStatus();
            const errorResponse = exception.getResponse();

            if (
                typeof errorResponse === 'object' &&
                errorResponse !== null &&
                'error' in errorResponse &&
                'message' in errorResponse &&
                typeof (errorResponse as NestErrorResponse).error === 'string'
            ) {
                const nestError = errorResponse as NestErrorResponse;
                message = nestError.message;
                statusName = nestError.error;
            } else {
                message = exception.message;
                statusName = exception.name;
            }
        } else {
            httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
            statusName = 'InternalServerError';
            console.error('Unknown exception caught:', exception);
        }

        const responseBody = {
            code: httpStatus,
            status: statusName,
            timestamp: new Date().toISOString(),
            message: Array.isArray(message) ? message.join(', ') : message,
        };

        httpAdapter.reply(response, responseBody, httpStatus);
    }
}
