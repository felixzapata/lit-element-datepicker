import { DateTime, Info } from 'luxon';

function fromISO(date: string) {
  return DateTime.fromISO(date);
}

function now() {
  return DateTime.now();
}

function fromJSDate(date: Date) {
  return DateTime.fromJSDate(date);
}

function toISO(date: DateTime) {
  return date.toISO();
}

function getWeekdaysNames(locale: string) {
  return Info.weekdays('long', { locale });
}

function getMonthsNames(locale: string) {
  return Info.months('long', { locale });
}

function getStartWeekDay(year: number, month: number, locale: string) {
  return fromJSDate(new Date(year, month, 1)).setLocale(locale).weekday - 1
}

export type DatePickerDate = DateTime;

export {
  fromISO,
  now,
  fromJSDate,
  getStartWeekDay,
  getMonthsNames,
  getWeekdaysNames,
  toISO,
};
