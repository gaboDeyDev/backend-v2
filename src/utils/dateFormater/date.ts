import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class DateUtils {
  static addDaysToDate(date: Date, days: number): Date {
    return dayjs(date).add(days, "day").toDate();
  }

  static subtractDaysFromDate(date: Date, days: number): Date {
    return dayjs(date).subtract(days, "day").toDate();
  }

  static formatDate(date: Date, format: string): string {
    return dayjs(date).format(format);
  }

  static getCurrentDate(): Date {
    return dayjs().tz("America/Mexico_City").toDate();
  }

  static getStartOfDay(date: Date): Date {
    return dayjs(date).startOf("day").toDate();
  }

  static getEndOfDay(date: Date): Date {
    return dayjs(date).endOf("day").toDate();
  }

  static getDifferenceInDays(date1: Date, date2: Date): number {
    return dayjs(date1).diff(dayjs(date2), "day");
  }

  static getDifferenceInHours(date1: Date, date2: Date): number {
    return dayjs(date1).diff(dayjs(date2), "hour");
  }
}
