import { LitElement, html } from 'lit';
import { property, query, customElement } from 'lit/decorators.js';
import { DateTime } from 'luxon';
import '../src/lit-element-datepicker';

@customElement('default-language')
class DefaultLanguage extends LitElement {
  @query('#date') date!: HTMLInputElement;

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
      <lit-element-datepicker ?opened="${this.opened}" id="datePicker"></lit-element-datepicker>
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
    'default-languge': DefaultLanguage;
  }
}

