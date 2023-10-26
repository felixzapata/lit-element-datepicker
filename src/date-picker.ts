import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import {
  type DatePickerDate,
  getDateFromISO,
  getDateNow,
  getStartWeekDay,
  getDay,
  getMonth,
  getYear,
  getMonthsNames,
  getWeekdaysNames
} from './date-time-helpers.ts';
import prev from './assets/prev.png';
import next from './assets/next.png';

@customElement('date-picker')
export class DatePicker extends LitElement {
  static styles = css`
    host {
      display: block;
      --datepicker-background-color: #fff;
      --datepicker-month-color: #ddd;
      --datepicker-width: 261px;
      --datepicker-zindex: 1000;
      --datepicker-cells-color: #ddd;
      --datepicker-currentday-color: #FFF0C4;
      --datepicker-cellempty-color: #f9f9f9;
      --datepicker-buttons-hover: #fc3;
      --datepicker-buttons-focus: #fc3;
    }
    .datepicker {
      margin: 10px;
      padding: 2px;
      position: absolute;
      z-index: 1000;
      width: 261px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    div#month-wrap {
      height: 30px;
      background-color: #ddd;
      border: 1px solid black;
      border-radius: 4px;
    }
    div#bn_prev {
      margin: 3px;
      float: left;
      width: 24px;
      height: 24px;
    }
    div#bn_next {
      margin: 3px;
      float: right;
      width: 24px;
      height: 24px;
    }
    div#bn_prev:hover,
    div#bn_prev:focus,
    div#bn_next:hover,
    div#bn_next:focus {
      margin: 2px;
      background-color: #fff;
      border: 1px solid #800;
      border-radius: 4px;
    }
    img.bn_img {
      margin: 0;
      padding: 2px;
    }
    div#month {
      float: left;
      padding-top: 6px;
      width: 199px;
      height: 24px;
      text-align: center;
      font-weight: bold;
      font-size: 1.2em;
    }
    table#cal {
      width: 261px;
      font-size: 1.2em;
      text-align: center;
    }
    table#cal th,
    table#cal td {
      width: 35px;
      height: 30px;
      padding: 0;
    }
    table#cal td {
      background-color: #ddd;
      border: 1px solid #999;
    }
    table#cal td.today {
      background-color: #FFF0C4;
      border: 1px solid #999;
    }
    table#cal td.disabled {
      color: #999;
    }
    table#cal td.empty, table#cal td.disabled {
      background-color: #f9f9f9;
      border: 1px solid #eee;
    }
    table#cal td:hover,
    table#cal td.focus {
      border-color: #800;
      background-color: #fc3;
    }
    table#cal td.empty:hover, table#cal td.disabled:hover {
      background-color: #f9f9f9;
      border: 1px solid #eee;
    }
    .offscreen {
      position: absolute;
      left: -200em;
      top: -100em;
    }
    [aria-hidden="true"] {
      display: none;
    }
`;

  private keys = {
    tab: 'Tab',
    enter: 'Enter',
    esc: 'Escape',
    space: 'Space',
    pageup: 'PageUp',
    pagedown: 'PageDown',
    end: 'End',
    home: 'Home',
    left: 'ArrowLeft',
    up: 'ArrowUp',
    right: 'ArrowRight',
    down: 'ArrowDown',
  };

  private dayNames: string[] = [];
  private dayNamesAbbr: string[] = [];
  private monthNames: string[] = [];
  private minDateObj?: DatePickerDate;
  private maxDateObj?: DatePickerDate;
  private dateObj!: DatePickerDate;
  private curYear = 0;
  private year = 0;
  private curMonth = 0;
  private month = 0;
  private isCurrentMonth = false;

  private shouldDisableNext = false;
  private shouldDisablePrev = false;

  private _handlerShowDlg = function (this: DatePicker, e: Event) {
    // ensure focus remains on the dialog
    this.$grid.focus();
    // Consume all mouse events and do nothing
    e.stopPropagation();
    return false;
  };

  @property({ type: Boolean }) opened = false;
  @property({ type: Boolean }) bModal = false;
  @property({ type: String }) date = '';
  @property({ type: String }) locale = 'en-EN';
  @property({ type: String, attribute: 'init-date' }) initDate = '';
  @property({ type: String, attribute: 'min-date' }) minDate = '';
  @property({ type: String, attribute: 'max-date' }) maxDate = '';

  @query('#dp1') $id!: HTMLElement;
  @query('#month') $monthObj!: HTMLElement;
  @query('#bn_prev') $prev!: HTMLElement;
  @query('#bn_next') $next!: HTMLElement;
  @query('#cal') $grid!: HTMLElement;

  render() {
    return html`
      <div id="dp1" class="datepicker" aria-hidden="true">
      <div id="month-wrap">
        <div id="bn_prev" @click="${this._handlePrevClick}" @keydown="${this._handlePrevKeyDown}" role="button" aria-labelledby="bn_prev-label" tabindex="0"><img class="bn_img" src="${prev}" alt="" /></div>
        <div id="month" role="heading" aria-live="assertive" aria-atomic="true"></div>
        <div id="bn_next" @click="${this._handleNextClick}" @keydown="${this._handleNextKeyDown}" role="button" aria-labelledby="bn_next-label" tabindex="0"><img class="bn_img" src="${next}" alt="" /></div>
      </div>
      <table id="cal" role="grid" aria-labelledby="month" tabindex="0" @keydown="${this._handleGridKeyDown}" @keypress="${this._handleGridKeyPress}" @focus="${this._handleGridFocus}" @blur="${this._handleGridBlur}">
        <thead>
        </thead>
        <tbody>
        </tbody>
      </table>
      <div id="bn_prev-label" class="offscreen">Go to previous month</div>
      <div id="bn_next-label" class="offscreen">Go to next month</div>
    </div>
    `;
  }

  _localizeCalendar(locale: string) {
    this.dayNames = getWeekdaysNames('long', locale);
    this.dayNamesAbbr = getWeekdaysNames('short', locale);
    this.monthNames = getMonthsNames('long', locale);
  }

  _initDateChanged() {
    this._unBindCellsClickHandlers();
    this._renderCalendar();
  }

  _minDateChanged(minDate: string) {
    if (minDate !== '') {
      this.minDateObj = getDateFromISO(minDate);
      this._checkDatesRange();
      this._updateAvailableDays();
    }
  }

  _renderCalendar() {
    this.dateObj =
      this.initDate !== '' ? getDateFromISO(this.initDate) : getDateNow();
    this.curYear = getYear(this.dateObj);
    this.year = this.curYear;

    this.curMonth = getMonth(this.dateObj) - 1;
    this.month = this.curMonth;
    this.isCurrentMonth = true;

    // display the current month
    this.$monthObj.innerHTML = this.monthNames[this.month] + ' ' + this.year;
    // populate the header of the calendar
    this._popHeader();

    // populate the calendar grid
    this._popGrid();

    // update the table's activedescdendant to point to the current day
    const id = this.$grid.querySelector('.today')?.getAttribute('id');
    if (id) {
      this.$grid.setAttribute('aria-activedescendant', id);
    }

    this._bindCellsClickHandlers();
  }

  /**
   * It checks the maxDate and minDate with the date to see if the prev and next buttons must be visible
   * @method _checkDatesRange
   * */
  _checkDatesRange() {
    this.shouldDisableNext = Boolean(
      this.maxDateObj &&
        this.month === getMonth(this.maxDateObj) &&
        this.year === getYear(this.maxDateObj)
    );
    this.shouldDisablePrev = Boolean(
      this.minDateObj &&
        this.month === getMonth(this.minDateObj) &&
        this.year === getYear(this.minDateObj)
    );
    this.$next.setAttribute('aria-hidden', this.shouldDisableNext.toString());
    this.$prev.setAttribute('aria-hidden', this.shouldDisablePrev.toString());
  }

  //
  // _popHeader() is a member function to populate the datepicker header with days of the week
  //
  // @return N/A
  //

  _popHeader() {
    const thead = this.$grid.querySelector('thead');
    if (!thead) {
      return;
    }
    let cellsHeader = '\t<tr id="row1">\n';
    // Insert the leading empty cells
    thead.innerHTML = '';
    for (let weekday = 0; weekday < 7; weekday++) {
      // eslint-disable-next-line
      cellsHeader +=
        '\t\t<th id="' +
        this.dayNames[weekday] +
        '"><abbr title="' +
        this.dayNames[weekday] +
        '">' +
        this.dayNamesAbbr[weekday] +
        '</abbr></th>\n';
    }
    cellsHeader += '</tr>';
    thead.insertAdjacentHTML('beforeend', cellsHeader);
  }

  //
  // _popGrid() is a member function to populate the datepicker grid with calendar days
  // representing the current month
  //
  // @return N/A
  //
  _popGrid() {
    const numDays = this._calcNumDays(this.year, this.month);
    const startWeekday = this._calcStartWeekday(this.year, this.month, this.locale);
    let weekday = 0;
    let curDay = 1;
    let rowCount = 1;
    const $tbody = this.$grid?.querySelector('tbody');
    if (!$tbody) {
      return;
    }
    const dayOfMonth = getDay(this.dateObj);

    let gridCells = '\t<tr id="row1">\n';

    // clear the grid
    $tbody.innerHTML = '';

    // Insert the leading empty cells
    for (weekday = 0; weekday < startWeekday; weekday++) {
      gridCells += '\t\t<td class="empty">&nbsp;</td>\n';
    }

    // insert the days of the month.
    for (curDay = 1; curDay <= numDays; curDay++) {
      if (curDay === dayOfMonth && this.isCurrentMonth === true) {
        // eslint-disable-next-line
        gridCells +=
          '\t\t<td id="day' +
          curDay +
          '" class="today" headers="row' +
          rowCount +
          ' ' +
          this.dayNames[weekday] +
          '" role="gridcell" aria-selected="false">' +
          curDay +
          '</td>';
      } else {
        // eslint-disable-next-line
        gridCells +=
          '\t\t<td id="day' +
          curDay +
          '" headers="row' +
          rowCount +
          ' ' +
          this.dayNames[weekday] +
          '" role="gridcell" aria-selected="false">' +
          curDay +
          '</td>';
      }
      if (weekday === 6 && curDay < numDays) {
        // This was the last day of the week, close it out
        // and begin a new one
        gridCells += '\t</tr>\n\t<tr id="row' + rowCount + '">\n';
        rowCount++;
        weekday = 0;
      } else {
        weekday += 1;
      }
    }

    // Insert any trailing empty cells
    for (weekday; weekday < 7; weekday++) {
      gridCells += '\t\t<td class="empty">&nbsp;</td>\n';
    }
    gridCells += '\t</tr>';
    $tbody.insertAdjacentHTML('beforeend', gridCells);
  }

  /**
   * It adds a class disable to not available days (because they are before a min date or after a max date)
   * @method _updateAvailableDays
   * */
  _updateAvailableDays() {
    // we get days only with id attributes (we dont want the empty cells)
    const days = Array.from(this.$grid.querySelectorAll('td[id]'));
    const len = days.length;
    let i;
    let day;
    // this value will be used to select the first available on the current month when the user clicks inside
    // the calendar. By default, it will be the first day of the month.
    let active = 'day1';
    for (i = 0; i < len; i++) {
      days[i].classList.remove('disabled');
    }
    if (this.maxDateObj && this.shouldDisableNext) {
      day = this.maxDateObj.day;
      for (i = day; i < len; i++) {
        days[i].classList.add('disabled');
      }
      active = 'day' + days[0].firstChild?.nodeValue;
    }
    if (this.minDateObj && this.shouldDisablePrev) {
      day = this.minDateObj.day;
      for (i = 0; i < day; i++) {
        days[i].classList.add('disabled');
      }
      active = 'day' + days[i].firstChild?.nodeValue;
    }
    this.$grid.setAttribute('aria-activedescendant', active);
  }

  //
  // _calcNumDays() is a member function to calculate the number of days in a given month
  //
  // @return (integer) number of days
  //
  _calcNumDays(year: number, month: number) {
    return 32 - new Date(year, month, 32).getDate();
  }

  //
  // _calcstartWeekday() is a member function to calculate the day of the week the first day of a
  // month lands on
  //
  // @return (integer) number representing the day of the week (0=Sunday....6=Saturday)
  //
  _calcStartWeekday(year: number, month: number, locale: string) {
    // 1-7, Monday is 1, Sunday is 7, per ISO
    return (getStartWeekDay(year, month, locale));
  }

  //
  // _showPrevMonth() is a member function to show the previous month
  //
  // @param (offset int) offset may be used to specify an offset for setting
  //                      focus on a day the specified number of days from
  //                      the end of the month.
  // @return N/A
  //
  _showPrevMonth(offset?: number) {
    if (!this.$monthObj || !this.$grid) {
      return;
    }
    let numDays;
    let day;

    // show the previous month
    if (this.month === 0) {
      this.month = 11;
      this.year -= 1;
    } else {
      this.month -= 1;
    }

    if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.isCurrentMonth = false;
    } else {
      this.isCurrentMonth = true;
    }

    // populate the calendar grid
    this._popGrid();
    this._checkDatesRange();
    this._updateAvailableDays();
    this._bindCellsClickHandlers();

    this.$monthObj.innerHTML = this.monthNames[this.month] + ' ' + this.year;

    // if offset was specified, set focus on the last day - specified offset
    if (typeof offset !== 'undefined' && offset > 0) {
      numDays = this._calcNumDays(this.year, this.month);
      day = 'day' + (numDays - offset);

      this.$grid.setAttribute('aria-activedescendant', day);
      this.$id?.querySelector('#' + day)?.classList.add('focus');
      this.$id?.querySelector('#' + day)?.setAttribute('aria-selected', 'true');
    }
  } // end _showPrevMonth()

  //
  // _showNextMonth() is a member function to show the next month
  //
  // @param (offset int) offset may be used to specify an offset for setting
  //                      focus on a day the specified number of days from
  //                      the beginning of the month.
  // @return N/A
  //
  _showNextMonth(offset?: number) {
    if (!this.$monthObj || !this.$grid) {
      return;
    }
    let day;
    // show the next month
    if (this.month === 11) {
      this.month = 0;
      this.year += 1;
    } else {
      this.month += 1;
    }

    if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.isCurrentMonth = false;
    } else {
      this.isCurrentMonth = true;
    }

    // populate the calendar grid
    this._popGrid();
    this._checkDatesRange();
    this._updateAvailableDays();
    this._bindCellsClickHandlers();

    this.$monthObj.innerHTML = this.monthNames[this.month] + ' ' + this.year;

    // if offset was specified, set focus on the first day + specified offset
    if (typeof offset !== 'undefined' && offset > 0) {
      day = 'day' + offset;

      this.$grid.setAttribute('aria-activedescendant', day);
      this.$grid?.querySelector('#' + day)?.classList.add('focus');
      this.$grid
        ?.querySelector('#' + day)
        ?.setAttribute('aria-selected', 'true');
    }
  }

  //
  // _showPrevYear() is a member function to show the previous year
  //
  // @return N/A
  //
  _showPrevYear() {
    if (!this.$monthObj) {
      return;
    }
    // decrement the year
    this.year -= 1;
    if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.isCurrentMonth = false;
    } else {
      this.isCurrentMonth = true;
    }
    // populate the calendar grid
    this._popGrid();
    this._checkDatesRange();
    this._updateAvailableDays();
    this._bindCellsClickHandlers();
    this.$monthObj.innerHTML = this.monthNames[this.month] + ' ' + this.year;
  } // end _showPrevYear()

  //
  // _showNextYear() is a member function to show the next year
  //
  // @return N/A
  //
  _showNextYear() {
    if (!this.$monthObj) {
      return;
    }
    // increment the year
    this.year += 1;
    if (this.month !== this.curMonth || this.year !== this.curYear) {
      this.isCurrentMonth = false;
    } else {
      this.isCurrentMonth = true;
    }
    // populate the calendar grid
    this._popGrid();
    this._checkDatesRange();
    this._updateAvailableDays();
    this._bindCellsClickHandlers();
    this.$monthObj.innerHTML = this.monthNames[this.month] + ' ' + this.year;
  }

  /**
   * It will set the selected date with format ISO 8601
   * @method _setSelectedDate
   * */
  _setSelectedDate(curDay: HTMLElement | null | undefined) {
    if (!curDay) {
      return;
    }
    this.date = new Date(this.year, this.month, window.parseInt(curDay.innerText, 10)).toISOString() || '';
    this.dispatchEvent(
      new window.CustomEvent('date-changed', {
        composed: true,
        bubbles: true,
        detail: this.date,
      })
    );
  }

  /**
   * It unbinds bind event handlers for days of the calendar
   * @method _unBindCellsClickHandlers
   * */
  _unBindCellsClickHandlers() {
    this._handleGridClick = this._handleGridClick.bind(this);
    Array.from(this.$grid?.querySelectorAll('td') || []).forEach((cell) => {
      cell.removeEventListener('click', this._handleGridClick);
    });
  }

  /**
   * It binds bind event handlers for days of the calendar
   * @method _bindCellsClickHandlers
   * */
  _bindCellsClickHandlers() {
    this._handleGridClick = this._handleGridClick.bind(this);
    Array.from(this.$grid?.querySelectorAll('td') || []).forEach((cell) => {
      cell.addEventListener('click', this._handleGridClick);
    });
  }

  //
  // _handlePrevClick() is a member function to process click events for the prev month button
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handlePrevClick(e: MouseEvent | KeyboardEvent) {
    if (e.ctrlKey) {
      this._showPrevYear();
    } else {
      this._showPrevMonth();
    }
    e.stopPropagation();
    return false;
  }

  //
  // _handleNextClick() is a member function to process click events for the next month button
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handleNextClick(e: MouseEvent | KeyboardEvent) {
    if (e.ctrlKey) {
      this._showNextYear();
    } else {
      this._showNextMonth();
    }
    e.stopPropagation();
    return false;
  }

  //
  // _handlePrevKeyDown() is a member function to process keydown events for the prev month button
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handlePrevKeyDown(e: KeyboardEvent) {
    if (e.altKey) {
      return true;
    }
    switch (e.code) {
      case this.keys.tab: {
        if (this.bModal === false || !e.shiftKey || e.ctrlKey) {
          return true;
        }

        this.$grid?.focus();
        e.stopPropagation();
        return false;
      }
      case this.keys.enter:
      case this.keys.space: {
        if (e.shiftKey) {
          return true;
        }

        if (e.ctrlKey) {
          this._showPrevYear();
        } else {
          this._showPrevMonth();
        }

        e.stopPropagation();
        return false;
      }
      default:
        break;
    }

    return true;
  }

  //
  // _handleNextKeyDown() is a member function to process keydown events for the next month button
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handleNextKeyDown(e: KeyboardEvent) {
    if (e.altKey) {
      return true;
    }
    switch (e.code) {
      case this.keys.enter:
      case this.keys.space: {
        if (e.ctrlKey) {
          this._showNextYear();
        } else {
          this._showNextMonth();
        }

        e.stopPropagation();
        return false;
      }
      default:
        break;
    }
    return true;
  }

  //
  // _handleGridKeyDown() is a member function to process keydown events for the datepicker grid
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handleGridKeyDown(e: KeyboardEvent) {
    const $curDay: HTMLElement | null | undefined = this.$id?.querySelector(
      '#' + this.$grid?.getAttribute('aria-activedescendant')
    );
    const $days = this.$grid?.querySelectorAll('td:not(.empty)') || [];
    const $daysArray: HTMLElement[] = [].slice.call($days) || [];

    if (e.altKey) {
      return true;
    }

    switch (e.code) {
      case this.keys.tab: {
        if (this.bModal === true) {
          if (e.shiftKey) {
            this.$next?.focus();
          } else {
            this.$prev?.focus();
          }
          e.stopPropagation();
          return false;
        }
        break;
      }
      case this.keys.enter:
      case this.keys.space: {
        if (e.ctrlKey) {
          return true;
        }
        // update date selected
        this._setSelectedDate($curDay);
        break;
      }
      case this.keys.esc: {
        // dismiss the dialog box
        this.opened = false;
        e.stopPropagation();
        return false;
      }
      case this.keys.left: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }
        const dayIndex = $curDay ? $daysArray.indexOf($curDay) - 1 : -1;
        let $prevDay = null;

        if (dayIndex >= 0) {
          $prevDay = $days[dayIndex];

          $curDay?.classList.remove('focus');
          $curDay?.setAttribute('aria-selected', 'false');
          $prevDay.classList.add('focus');
          $prevDay.setAttribute('aria-selected', 'true');
          const id = $prevDay.getAttribute('id');
          if (id) {
            this.$grid?.setAttribute('aria-activedescendant', id);
          }
        } else {
          this._showPrevMonth(0);
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.right: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }

        const dayIndex = $curDay ? $daysArray.indexOf($curDay) + 1 : -1;
        let $nextDay = null;

        if (dayIndex < $days.length) {
          $nextDay = $days[dayIndex];
          $curDay?.classList.remove('focus');
          $curDay?.setAttribute('aria-selected', 'false');
          $nextDay.classList.add('focus');
          $nextDay.setAttribute('aria-selected', 'true');
          const id = $nextDay.getAttribute('id');
          if (id) {
            this.$grid?.setAttribute('aria-activedescendant', id);
          }
        } else {
          // move to the next month
          this._showNextMonth(1);
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.up: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }

        const dayIndex = $curDay ? $daysArray.indexOf($curDay) - 7 : -1;
        let $prevDay = null;

        if (dayIndex >= 0) {
          $prevDay = $days[dayIndex];

          $curDay?.classList.remove('focus');
          $curDay?.setAttribute('aria-selected', 'false');
          $prevDay.classList.add('focus');
          $prevDay.setAttribute('aria-selected', 'true');

          const id = $prevDay.getAttribute('id');
          if (id) {
            this.$grid?.setAttribute('aria-activedescendant', id);
          }
        } else {
          // move to appropriate day in previous month
          const dayIndex = $curDay ? 6 - $daysArray.indexOf($curDay) : -1;

          this._showPrevMonth(dayIndex);
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.down: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }

        const dayIndex = $curDay ? $daysArray.indexOf($curDay) + 7 : -1;
        let $prevDay = null;

        if (dayIndex < $days.length) {
          $prevDay = $days[dayIndex];

          $curDay?.classList.remove('focus');
          $curDay?.setAttribute('aria-selected', 'false');
          $prevDay.classList.add('focus');
          $prevDay.setAttribute('aria-selected', 'true');

          const id = $prevDay.getAttribute('id');
          if (id) {
            this.$grid?.setAttribute('aria-activedescendant', id);
          }
        } else {
          // move to appropriate day in next month
          const dayIndex = $curDay
            ? 8 - ($days.length - $daysArray.indexOf($curDay))
            : -1;

          this._showNextMonth(dayIndex);
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.pageup: {
        const active = this.$grid?.getAttribute('aria-activedescendant');

        if (e.shiftKey) {
          return true;
        }

        if (e.ctrlKey) {
          this._showPrevYear();
        } else {
          this._showPrevMonth();
        }

        if (
          typeof this.$id?.querySelector('#' + active)?.getAttribute('id') ===
          'undefined'
        ) {
          const lastDay = 'day' + this._calcNumDays(this.year, this.month);
          this.$id?.querySelector('#' + lastDay)?.classList.add('focus');
          this.$id
            ?.querySelector('#' + lastDay)
            ?.setAttribute('aria-selected', 'true');
        } else {
          this.$id?.querySelector('#' + active)?.classList.add('focus');
          this.$id
            ?.querySelector('#' + active)
            ?.setAttribute('aria-selected', 'true');
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.pagedown: {
        const active = this.$grid?.getAttribute('aria-activedescendant');
        if (e.shiftKey) {
          return true;
        }
        if (e.ctrlKey) {
          this._showNextYear();
        } else {
          this._showNextMonth();
        }
        if (
          this.$id?.querySelector('#' + active)?.getAttribute('id') == undefined
        ) {
          const lastDay = 'day' + this._calcNumDays(this.year, this.month);
          this.$id?.querySelector('#' + lastDay)?.classList.add('focus');
          this.$id
            ?.querySelector('#' + lastDay)
            ?.setAttribute('aria-selected', 'true');
        } else {
          this.$id?.querySelector('#' + active)?.classList.add('focus');
          this.$id
            ?.querySelector('#' + active)
            ?.setAttribute('aria-selected', 'true');
        }

        e.stopPropagation();
        return false;
      }
      case this.keys.home: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }
        $curDay?.classList.remove('focus');
        $curDay?.setAttribute('aria-selected', 'false');

        this.$id?.querySelector('#day1')?.classList.add('focus');
        this.$id?.querySelector('#day1')?.setAttribute('aria-selected', 'true');

        this.$grid?.setAttribute('aria-activedescendant', 'day1');

        e.stopPropagation();
        return false;
      }
      case this.keys.end: {
        if (e.ctrlKey || e.shiftKey) {
          return true;
        }

        const lastDay = 'day' + this._calcNumDays(this.year, this.month);

        $curDay?.classList.remove('focus');
        $curDay?.setAttribute('aria-selected', 'false');

        this.$id?.querySelector('#' + lastDay)?.classList.add('focus');
        this.$id
          ?.querySelector('#' + lastDay)
          ?.setAttribute('aria-selected', 'true');

        this.$grid?.setAttribute('aria-activedescendant', lastDay);

        e.stopPropagation();
        return false;
      }
      default:
        break;
    }
    return true;
  }

  //
  // _handleGridKeyPress() is a member function to consume keypress events for browsers that
  // use keypress to scroll the screen and manipulate tabs
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handleGridKeyPress(e: KeyboardEvent) {
    if (e.altKey) {
      return true;
    }

    switch (e.code) {
      case this.keys.tab:
      case this.keys.enter:
      case this.keys.space:
      case this.keys.esc:
      case this.keys.left:
      case this.keys.right:
      case this.keys.up:
      case this.keys.down:
      case this.keys.pageup:
      case this.keys.pagedown:
      case this.keys.home:
      case this.keys.end: {
        e.stopPropagation();
        return false;
      }
      default:
        break;
    }

    return true;
  }

  //
  // _handleGridClick() is a member function to process mouse click events for the datepicker grid
  //
  // @input (id obj) e is the id of the object triggering the event
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) false if consuming event, true if propagating
  //
  _handleGridClick(e: MouseEvent) {
    const $cell = e.target as HTMLElement;
    if (!$cell) {
      return;
    }
    if (
      $cell.classList.contains('empty') ||
      $cell.classList.contains('disabled')
    ) {
      return true;
    }

    this.$grid?.querySelector('.focus')?.classList.remove('focus');
    this.$grid?.setAttribute('aria-selected', 'false');
    $cell.classList.add('focus');
    $cell.setAttribute('aria-selected', 'true');
    const id = $cell.getAttribute('id');
    if (id) {
      this.$grid?.setAttribute('aria-activedescendant', id);
    }
    const $curDay: HTMLElement | null | undefined = this.$id?.querySelector(
      '#' + this.$grid?.getAttribute('aria-activedescendant')
    );

    // update date selected
    this._setSelectedDate($curDay);

    // dismiss the dialog box
    this.opened = false;

    e.stopPropagation();
    return false;
  }

  //
  // _handleGridFocus() is a member function to process focus events for the datepicker grid
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) true
  //
  _handleGridFocus() {
    const active = this.$grid?.getAttribute('aria-activedescendant');
    if (
      typeof this.$grid?.querySelector('#' + active)?.getAttribute('id') ===
      'undefined'
    ) {
      const lastDay = 'day' + this._calcNumDays(this.year, this.month);
      this.$grid?.querySelector('#' + lastDay)?.classList.add('focus');
      this.$grid
        ?.querySelector('#' + lastDay)
        ?.setAttribute('aria-selected', 'true');
    } else {
      this.$grid?.querySelector('#' + active)?.classList.add('focus');
      this.$grid
        ?.querySelector('#' + active)
        ?.setAttribute('aria-selected', 'true');
    }
    return true;
  }

  //
  // _handleGridBlur() is a member function to process blur events for the datepicker grid
  //
  // @input (e obj) e is the event object associated with the event
  //
  // @return (boolean) true
  //
  _handleGridBlur() {
    this.$id
      ?.querySelector('#' + this.$grid?.getAttribute('aria-activedescendant'))
      ?.classList.remove('focus');
    // eslint-disable-next-line
    this.$id
      ?.querySelector('#' + this.$grid?.getAttribute('aria-activedescendant'))
      ?.setAttribute('aria-selected', 'false');
    return true;
  }

  _onOpenedChanged() {
    if(this.opened) {
      this.showDlg();
    } else {
      this._hideDlg();
    }
  }

  //
  // showDlg() is a member function to show the datepicker and give it focus. This function is only called if
  // the datepicker is used in modal dialog mode.
  //
  // @return N/A
  //
  showDlg() {
    // Bind an event listener to the document to capture all mouse events to make dialog modal
    document.addEventListener('click', () => this._handlerShowDlg);
    document.addEventListener('mousedown', () => this._handlerShowDlg);
    document.addEventListener('mouseup', () => this._handlerShowDlg);
    document.addEventListener('mousemove', () => this._handlerShowDlg);
    document.addEventListener('mouseover', () => this._handlerShowDlg);

    this._checkDatesRange();
    this._updateAvailableDays();

    // show the dialog
    this.$id.setAttribute('aria-hidden', 'false');

    this.$grid.focus();
  } // end showDlg()

  //
  // _hideDlg() is a member function to hide the datepicker and remove focus. This function is only called if
  // the datepicker is used in modal dialog mode.
  //
  // @return N/A
  //
  _hideDlg() {
    // unbind the modal event sinks
    document.removeEventListener('click', () => this._handlerShowDlg);
    document.removeEventListener('mousedown', () => this._handlerShowDlg);
    document.removeEventListener('mouseup', () => this._handlerShowDlg);
    document.removeEventListener('mousemove', () => this._handlerShowDlg);
    document.removeEventListener('mouseover', () => this._handlerShowDlg);
    // hide the dialog
    this.$id.setAttribute('aria-hidden', 'true');

    // set focus on the focus target
    // TODO
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('locale')) {
      this._localizeCalendar(this.locale);
    }
    if (
      changedProperties.has('initDate') &&
      typeof changedProperties.get('initDate') !== 'undefined'
    ) {
      this._initDateChanged();
    }
  }
  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('minDate')) {
      this._minDateChanged(this.minDate);
    }
    if (changedProperties.has('opened')) {
      this._onOpenedChanged();
    }

  }

  firstUpdated() {
    if (this.maxDate !== '') {
      this.maxDateObj = getDateFromISO(this.maxDate);
    }

    if (this.minDate !== '') {
      this.minDateObj = getDateFromISO(this.minDate);
    }
    this._renderCalendar();

    // hide dialog if in modal mode
    if (this.bModal === true) {
      this.$id.setAttribute('aria-hidden', 'true');
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unBindCellsClickHandlers();
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'date-picker': DatePicker;
  }
}
