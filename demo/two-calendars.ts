import { LitElement, html } from 'lit';
import { property, query, customElement } from 'lit/decorators.js';
import { DateTime } from 'luxon';
import '../src/lit-element-datepicker';

@customElement('two-calendars')
class TwoCalendars extends LitElement {
  @query('#date') date!: HTMLInputElement;
  @query('#date2') date2!: HTMLInputElement;

  @property({ type: Boolean }) opened = false;
  @property({ type: Boolean }) opened2 = false;
  @property({ type: String }) dateFrom = '';
  constructor() {
    super();
    this.addEventListener('date-changed', (event: Event) => {
      // type assertion
      this._dateChanged(<CustomEvent>event);
    });

  }
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" />
        <button type="button" id="d1" @click="${this._openFirstCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" init-date="2013-03-08" ?opened="${this.opened}"></lit-element-datepicker>
      <div role="application">
        <label for="date2">Date:</label>
        <input id="date2" type="text" />
        <button type="button" id="d2" @click="${this._openSecondCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker2" ?opened="${this.opened2}" init-date="${this.dateFrom}" min-date="${this.dateFrom}"></lit-element-datepicker>
    `;
  }
  dateFormat(date: string) {
    if (date !== '') {
      return DateTime.fromISO(date).toLocaleString();
    }
    return '';
  }
  _dateChanged(event: CustomEvent) {
    const node = event.currentTarget as HTMLElement;
    if (node.id === 'datePicker') {
      this.dateFrom = event.detail;
      this.date.value = this.dateFormat(event.detail);
    } else {
      this.date2.value = this.dateFormat(event.detail);
    }
  }
  _openFirstCalendar() {
    this.opened = true;
  }
  _openSecondCalendar() {
    this.opened2 = true;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'two-calendars': TwoCalendars;
  }
}
