import { addDays, isAfter } from 'date-fns';
import isBefore from 'date-fns/isBefore';
import parseISO from 'date-fns/parseISO';

export class DateTimeUtil {
  static getCurrentTime(): Date {
    return new Date();
  }

  static createFromYMD(year: number, month: number, date: number): Date {
    const d = new Date(year, month - 1, date); // month starts with 0
    if (
      d.getFullYear() !== year ||
      d.getMonth() !== month - 1 ||
      d.getDate() !== date
    ) {
      return null;
    }
    return d;
  }

  /**
   * Is [compared] before [basis]?
   * @param compared
   * @param basis
   * @returns true if compared < basis
   */
  static isBefore(compared: Date, basis: Date): boolean {
    return isBefore(compared, basis);
  }

  /**
   * Is [compared] after [basis]?
   * @param compared
   * @param basis
   * @returns true if compared > basis
   */
  static isAfter(compared: Date, basis: Date): boolean {
    return isAfter(compared, basis);
  }

  static parseISOString(date: string): Date {
    const res: any = parseISO(date);
    if (res.toString() === 'Invalid Date') {
      return null;
    }
    return parseISO(date);
  }

  /**
   * @param {int} The month number, from 1 to 12
   * @param {int} The year, not zero based, required to account for leap years
   * @return {Date[]} List with date objects for each day of the month
   */
  static getDaysInMonth(year: number, month: number): Date[] {
    let date = this.createFromYMD(year, month, 1);
    const days = [];
    while (date.getMonth() === month - 1) {
      days.push(new Date(date));
      date = addDays(date, 1);
    }

    return days;
  }
}
