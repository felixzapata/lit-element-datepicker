import { LitElement, html } from 'lit-element';
import moment from 'moment';
import '../src/lit-element-datepicker.js';

class InitMaxDate extends LitElement {
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" />
        <button type="button" @click="${this._openCalendar}">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" locale="es" init-date="2013-03-08" min-date="2013-02-11" max-date="2013-04-08"></lit-element-datepicker>
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
customElements.define('init-max-date', InitMaxDate);