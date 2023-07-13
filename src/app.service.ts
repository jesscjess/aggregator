import { Injectable, NotFoundException } from '@nestjs/common';
// Note: please run `npm run aggregate-data` to create this file.
import  * as events from '../server/data/aggregated-events.json';
import { Events, findStartingHour } from "../src/utils/aggregate.data.helper";


@Injectable()
export class AppService {
  getAggregatedData(start: string, end: string, customerId: string): Events {
    if(!customerId || !events[customerId] ){
      return {}
    }
    const startDate = new Date(start);
    const endDate = new Date(end);

    // TODO: dates could be validated further using the pipe option in the controller
    if(this._isInvalidDate(startDate) && this._isInvalidDate(startDate)){
      throw new NotFoundException('Please send valid dates')

    }
    let startHour = new Date(startDate);
    let endHour = new Date(endDate);


    if(startDate > endDate){
      throw new NotFoundException('The end variable must be a point in time after the start variable.')
    }

    // Round start date up to the next hour if needed
    if(!this._isZeroMinutesPastHour(startHour)){
      startHour = this._incrementByHour(findStartingHour(startDate));
    }

    // Round end date down to the hour if needed
    if(!this._isZeroMinutesPastHour(endHour)){
      endHour = findStartingHour(endHour);
    }

    const hourDifference = this._calculateHourDifference(startHour, endHour);
    if(hourDifference > 24){
      throw new NotFoundException('The time difference between start and end should be less than 24 hours.')
    }
    const result = {};

    while (startHour < endHour){
      result[startHour.toISOString()] = events[customerId][startHour.toISOString()]
      startHour = this._incrementByHour(startHour);
    }
    return result;
  }


  private _isInvalidDate(date: Date): boolean {
    return isNaN(date.getTime());
  }

  private _calculateHourDifference(startDate: Date, endDate: Date): number {
    const startMs = startDate.getTime();
    const endMs = endDate.getTime();

    const hourDifference = Math.abs(endMs - startMs) / (1000 * 60 * 60);
    return Math.floor(hourDifference);
  }

  private _isZeroMinutesPastHour(date: Date): boolean {
    return date.getMinutes() === 0 && date.getSeconds() === 0;
  }

  private _incrementByHour(startingHour: Date){
    return new Date(startingHour.setHours(startingHour.getHours() + 1));

  }
}
