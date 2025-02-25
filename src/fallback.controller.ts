import { Controller, Get, Res } from '@nestjs/common';
import { join } from 'path';
import { Response } from 'express';

@Controller()
export class FallbackController {
  @Get('*')
  sendIndex(@Res() res: Response) {
    const clientPath = join(__dirname, '..', 'client', 'dist', 'index.html')
    console.log(clientPath)
    res.sendFile(clientPath);
  }
}
 