import { LitElement, html } from 'lit-element';
import moment from 'moment';
import '../lit-element-datepicker.js';

class TwoCalendars extends LitElement {
  static get properties() {
    return {
      dateFrom: {
        type: String
      }
    };
  }
  constructor() {
    super();
    this.dateFrom = '';
  }
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" />
        <button type="button" id="d1" @click="${this._openFirstCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" init-date="2013-03-08"></lit-element-datepicker>
      <div role="application">
        <label for="date2">Date:</label>
        <input id="date2" type="text" />
        <button type="button" id="d2" @click="${this._openSecondCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker2" init-date="${this.dateFrom}" min-date="${this.dateFrom}"></lit-element-datepicker>
    `;
  }
  dateFormat(date, format) {
    if(date !== '') {
      return moment(date).format(format);
    }
    return '';
  }
  _dateChanged(event) {
    if(event.currentTarget.id === 'datePicker') {
      this.dateFrom = event.detail;
      this.shadowRoot.querySelector('#date').value = this.dateFormat(event.detail, 'L');
    } else {
      this.shadowRoot.querySelector('#date2').value = this.dateFormat(event.detail, 'L');
    }
    
  }
  _openFirstCalendar() {
    this.shadowRoot.querySelector('#datePicker').showDlg();
  }
  _openSecondCalendar() {
    this.shadowRoot.querySelector('#datePicker2').showDlg();
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
customElements.define('two-calendars', TwoCalendars);