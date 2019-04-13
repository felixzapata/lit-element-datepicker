import { LitElement, html } from 'lit-element';
import moment from 'moment';
import '../lit-element-datepicker.js';

class UsingLocale extends LitElement {
  static get properties() {
    return {
      datePickerValue: {
        type: String,
      },
      locale: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.datePickerValue = '';
    this.locale = 'es';
  }
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" />
        <button type="button" @click="${this._openCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" locale="${this.locale}"></lit-element-datepicker>
    `;
  }
  dateFormat(date, format) {
    if(date !== '') {
      return moment(date).format(format);
    }
    return '';
  }
  _dateChanged(event) {
    this.shadowRoot.querySelector('#date').value = this.dateFormat(event.detail, 'L');
  }
  _openCalendar() {
    this.shadowRoot.querySelector('#datePicker').showDlg();
  }
  firstUpdated() {
    this.dateChangedHandler = this._dateChanged.bind(this);
    this.shadowRoot.addEventListener('date-changed', this.dateChangedHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.shadowRoot.removeEventListener('date-changed', this.dateChangedHandler);
  }
}
customElements.define('using-locale', UsingLocale);