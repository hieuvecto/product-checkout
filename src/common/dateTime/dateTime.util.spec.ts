import { DateTimeUtil } from './dateTime.util';

describe('DateTimeUtil', () => {
  it('createFromYMD', () => {
    const ok = DateTimeUtil.createFromYMD(1992, 7, 25);
    expect(ok.getFullYear()).toEqual(1992);
    expect(ok.getMonth()).toEqual(6); // Month starts at 0
    expect(ok.getDate()).toEqual(25);

    const ng = DateTimeUtil.createFromYMD(2000, 13, 40);
    expect(ng).toBeNull();
  });

  it('isBefore', () => {
    const earlier = new Date('2021-01-01 00:00:00');
    const later = new Date('2021-01-01 01:00:00');
    expect(DateTimeUtil.isBefore(earlier, later)).toBeTruthy();
    expect(DateTimeUtil.isBefore(later, earlier)).toBeFalsy();
  });

  it('success: parseISOString', () => {
    const d = new Date(Date.UTC(2021, 4, 24, 7, 34, 19, 400)); // month start at 0
    expect(DateTimeUtil.parseISOString('2021-05-24T07:34:19.400Z')).toEqual(d);
  });

  it('fail: parseISOString', () => {
    expect(DateTimeUtil.parseISOString('')).toBeNull();
  });

  const days2020 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const days2021 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  it('success: getDaysInMonth - gets day counts for leap years', function () {
    const actual = days2020.map((day, index) => {
      const daysInMonth = DateTimeUtil.getDaysInMonth(2020, index + 1);
      return daysInMonth.length;
    });
    expect(actual).toEqual(days2020);
  });

  it('success: getDaysInMonth - gets day counts for non-leap years', function () {
    const actual = days2021.map(
      (day, index) => DateTimeUtil.getDaysInMonth(2021, index + 1).length,
    );
    expect(actual).toEqual(days2021);
  });
});
