import { format, parseISO, addDays, subDays, getDate } from 'date-fns';

export class DateFormater {
  getNumberCurrentDate(): number {
    const now = new Date();
    const offset = -6 * 60; // UTC-6 para hora estándar de México
    const localTime = new Date(now.getTime() + offset * 60 * 1000);
    return getDate(localTime);
  }

  formatDate(date: Date, dateFormat: string): string {
    return format(date, dateFormat);
  }

  parseDate(dateString: string, dateFormat: string): Date {
    return parseISO(dateString);
  }

  addDaysToDate(date: Date, days: number): Date {
    return addDays(date, days);
  }

  subtractDaysFromDate(date: Date, days: number): Date {
    return subDays(date, days);
  }
}
