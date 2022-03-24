interface IDateProvider {
  compareInHours(start_date: Date, end_date: Date): number;
  convertToUTC(date: Date): string;
  dateNow(): Date;
  compareInDays(start_date: Date, end_date: Date): number;
  addDays(days: number, date?: Date): Date;
  addHours(hours: number): Date;
  compareIfIsBefore(start_date: Date, end_date: Date): boolean;
}

export { IDateProvider };
