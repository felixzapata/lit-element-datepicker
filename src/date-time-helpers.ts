import { DateTime, Info } from 'luxon';

function getDateFromISO(date: string) {
  return DateTime.fromISO(date);
}

function getDateNow() {
  return DateTime.now();
}

function getDateFromJSDate(date: Date) {
  return DateTime.fromJSDate(date);
}

function toISO(date: DateTime) {
  return date.toISO();
}

function getWeekdaysNames(format: 'long' | 'short', locale: string) {
  return Info.weekdays(format, { locale });
}

function getMonthsNames(format: 'long' | 'short', locale: string) {
  return Info.months(format, { locale });
}

function getStartWeekDay(year: number, month: number, locale: string) {
  return getDateFromJSDate(new Date(year, month, 1)).setLocale(locale).weekday - 1
}

function getDay(date: DatePickerDate) {
  return date.day;
}

function getMonth(date: DatePickerDate) {
  return date.month;
}

function getYear(date: DatePickerDate) {
  return date.year;
}

export type DatePickerDate = DateTime;

export {
  getDay,
  getMonth,
  getYear,
  getDateFromISO,
  getDateNow,
  getDateFromJSDate,
  getStartWeekDay,
  getMonthsNames,
  getWeekdaysNames,
  toISO,
};
