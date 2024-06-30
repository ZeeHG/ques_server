import { ExceptionFilter,Catch,ArgumentsHost ,HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception:HttpException, host:ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const message=exception.message?exception.message:'error';
    response
      .status(status)
      .json({
        errno:-1,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }
}