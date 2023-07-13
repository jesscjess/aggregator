import { Controller, Get, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { Events } from "../src/utils/aggregate.data.helper";


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':customerId')
  getAggregatedData(
    @Query('start') start: string,
    @Query('end') end: string,
    @Param('customerId') customerId: string
  ): Events {
    return this.appService.getAggregatedData(start, end, customerId);
  }
}
