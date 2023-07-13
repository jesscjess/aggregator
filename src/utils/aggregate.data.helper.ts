export interface EventRow {
  customerId: string,
  eventType: string,
  transactionId: string,
  timestamp: Date,

}

export interface Events {
  [id: string]: number
}

export function findStartingHour(date: Date): Date {
  const roundedDate = new Date(date);

  // Round the minutes to the starting hour
  roundedDate.setMinutes(Math.floor(roundedDate.getMinutes() / 60) * 60);

  roundedDate.setSeconds(0);
  roundedDate.setMilliseconds(0);

  return roundedDate;
}