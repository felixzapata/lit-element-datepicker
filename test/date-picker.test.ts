import { DatePicker } from '../src/date-picker';
import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';

describe('date-picker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2019, 0, 24));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('is defined', () => {
    const el = document.createElement('date-picker');
    expect(el).to.be.instanceOf(DatePicker);
  });

  it('should set a calendar with current date on January 24, 2019', async () => {
    var element = await fixture(html`
      <date-picker id="datePicker"></date-picker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('January 2019');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(4);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(31);
    expect(table?.querySelector('#day24')?.classList.contains('today')).to.equal(true);
  });
  it('should set a calendar with current date on 24 enero, 2019', async () => {
    var element = await fixture(html`
      <date-picker id="datePicker" locale="es"></date-picker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('enero 2019');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(4);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(31);
    expect(table?.querySelector('#day24')?.classList.contains('today')).to.equal(true);
  });
  it('should set a calendar with an init date of February 08, 2013', async () => {
    var element = await fixture(html`
      <date-picker id="datePicker" init-date="2013-02-08"></date-picker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('February 2013');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(7);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(28);
    expect(table?.querySelector('#day24')?.classList.contains('today')).to.equal(true);
  });
  it('should set a calendar with a min date of February 08, 2013 and max date of April 08, 2013', async () => {
    var element = await fixture(html`
      <date-picker id="datePicker" init-date="2013-03-08" min-date="2013-02-11" max-date="2013-04-08"></date-picker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('March 2013');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(4);
    expect(table?.querySelectorAll('tbody .disabled').length).to.equal(11);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(31);
    expect(table?.querySelector('#day24')?.classList.contains('today')).to.equal(true);
    expect(datePicker?.querySelector('#bn_prev')?.getAttribute('aria-hidden')).to.equal('true');
    expect(datePicker?.querySelector('#bn_next')?.getAttribute('aria-hidden')).to.equal('false');
  });
  it('should set a calendar with a min date of February 08, 2013 and max date of February 29, 2013', async () => {
    var element = await fixture(html`
      <date-picker id="datePicker" init-date="2013-03-08" min-date="2013-02-11" max-date="2013-02-29"></date-picker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('March 2013');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(4);
    expect(table?.querySelectorAll('tbody .disabled').length).to.equal(11);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(31);
    expect(table?.querySelector('#day24')?.classList.contains('today')).to.equal(true);
    expect(datePicker?.querySelector('#bn_prev')?.getAttribute('aria-hidden')).to.equal('true');
    expect(datePicker?.querySelector('#bn_next')?.getAttribute('aria-hidden')).to.equal('false');
  });
});
