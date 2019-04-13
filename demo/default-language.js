import { LitElement, html } from 'lit-element';
import moment from 'moment';
import '../lit-element-datepicker.js';

class DefaultLanguage extends LitElement {
  static get properties() {
    return {
      datePickerValue: {
        type: String,
        value: ''
      }
    };
  }
  render() {
    return html`
      <div role="application">
        <label for="date">Date:</label>
        <input id="date" type="text" value="${dateFormat(datePickerValue, 'L')}" />
        <button type="button">Select Date...</button>
      </div>
      <lit-element-datepicker id="datePicker" date="${datePickerValue}"></lit-element-datepicker> 
    `;
  }
  dateFormat(date, format) {
    if(date !== '') {
      return moment(date).format(format);
    }
    return '';
  }
  _openCalendar() {
    this.shadowRoot.querySelector('#datePicker').showDlg();
  }
  firstUpdated() {
    this.openCalendarHandler = this._openCalendar.bind(this);
    this.shadowRoot.querySelector('button').addEventListener('click', this.openCalendarHandler);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.openCalendarHandler = this._openCalendar.bind(this);
    this.shadowRoot.querySelector('button').addEventListener('click', this.openCalendarHandler);
  }
}
customElements.define('default-language', DefaultLanguage);