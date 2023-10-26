import { LitElement, html } from 'lit';
import { property, query, customElement } from 'lit/decorators.js';
import { DateTime } from 'luxon';
import { DatePicker } from '../src/date-picker';

@customElement('using-locale')
class UsingLocale extends LitElement {
  static get properties() {
    return {
      locale: {
        type: String,
      },
    };
  }
  @query('#datePicker') calendar!: DatePicker;
  @query('#date') date!: HTMLInputElement;
  @property({ type: String }) locale = 'es';
  @property({ type: Boolean }) opened = false;

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
        <button type="button" @click="${this._openCalendar}">Select Date...</button>
      </div>
      <date-picker id="datePicker" locale="${this.locale}"></date-picker>
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
    'using-locale': UsingLocale;
  }
}
