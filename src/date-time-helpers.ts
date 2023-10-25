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

function setLocale(locale: string) {
  return DateTime.local().setLocale(locale);
}

function toISO(date: DateTime) {
  return date.toISO();
}

function weekdays(locale: string) {
  return Info.weekdays('long', { locale });
}

function months(locale: string) {
  return Info.months('long', { locale });
}

export type DateWrapper = DateTime;

export {
  fromISO,
  now,
  fromJSDate,
};
