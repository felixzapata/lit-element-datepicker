import { LitElementDatepicker } from '../src/lit-element-datepicker';
import { beforeEach, describe, expect, it, afterEach, vi } from 'vitest';
import { fixture, html } from '@open-wc/testing';

describe('lit-element-datepicker', () => {
  let element: LitElementDatepicker;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2019, 0, 24));
    /* element = document.createElement(
      'lit-element-datepicker'
    ) as LitElementDatepicker;
    document.body.appendChild(element); */
  });

  afterEach(() => {
    vi.useRealTimers();
    // document.body.removeChild(element);
  });

  it('is defined', () => {
    const el = document.createElement('lit-element-datepicker');
    expect(el).to.be.instanceOf(LitElementDatepicker);
  });

  it('should open a calendar with current date on January 24, 2019', async () => {
    // element.opened = true;
    var element = await fixture(html`
      <lit-element-datepicker id="datePicker"></lit-element-datepicker>
    `);
    const datePicker = element.shadowRoot?.querySelector('#dp1');
    const table = datePicker?.querySelector('table');
    expect(table?.querySelectorAll('thead th').length).to.equal(7);
    expect(datePicker?.querySelector('#month')?.firstChild?.nodeValue).to.equal('January 2019');
    expect(table?.querySelectorAll('tbody .empty').length).to.equal(4);
    expect(table?.querySelectorAll('tbody td[id]').length).to.equal(31);
    expect(
      table?.querySelector('#day24')?.classList.contains('today')
    ).to.equal(true);
  });
});
