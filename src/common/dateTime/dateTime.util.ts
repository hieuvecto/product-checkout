import { isAfter } from 'date-fns';
import isBefore from 'date-fns/isBefore';

export class DateTimeUtil {
  static getCurrentTime(): Date {
    return new Date();
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
}
