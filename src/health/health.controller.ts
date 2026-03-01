import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() { }

  @Get('')
  findAll() {
    return {
      service: 'sindicatos dey dev v6',
      timestamp: new Date().toISOString(),
      status: 'ok',
    };
  }
}
