import { LitElement, html } from 'lit';
import { property, query, customElement } from 'lit/decorators.js';
import { DateTime } from 'luxon';
import '../src/lit-element-datepicker';

@customElement('init-max-date')
class InitMaxDate extends LitElement {
  @query('#date') date!: HTMLInputElement;

  @property({ type: Boolean }) opened = false;
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" />
        <button type="button" @click="${this._openCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" ?opened="${this.opened}" locale="es" init-date="2013-03-08" min-date="2013-02-11" max-date="2013-04-08"></lit-element-datepicker>
    `;
  }
  dateFormat(date: string) {
    if (date !== '') {
      return DateTime.fromISO(date).toLocaleString();
    }
    return '';
  }
  _dateChanged(event: CustomEvent) {
    this.date.value = this.dateFormat(event.detail);
  }
  _openCalendar() {
    this.opened = true;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'init-max-date': InitMaxDate;
  }
}

