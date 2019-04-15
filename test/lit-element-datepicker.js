import '../lit-element-datepicker.js';

describe('lit-element-datepicker', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('lit-element-datepicker');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('should open a calendar with current date on January 24, 2019', () => {
    var clock = sinon.useFakeTimers(new Date(2019, 0, 24).getTime());
    var root;
    var datePicker;
    var table;
    element.showDlg();
    root = element.shadowRoot;
    datePicker = root.querySelector('#dp1');
    table = datePicker.querySelector('table');
    expect(table.querySelectorAll('thead th').length).to.be.equal(7);
    expect(datePicker.querySelector('#month').firstChild.nodeValue).to.equal('January 2019');
    expect(table.querySelectorAll('tbody .empty').length).to.be.equal(4);
    expect(table.querySelectorAll('tbody td[id]').length).to.be.equal(31);
    expect(table.querySelector('#day24').classList.contains('today')).to.be.equal(true);
    clock.restore();
  });
});