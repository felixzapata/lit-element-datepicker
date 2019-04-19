import { css } from 'lit-element';

export const litElementDatepickerStyle = css`
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
  z-index: var(--datepicker-zindex);
  width: var(--datepicker-width);
  background-color: var(--datepicker-background-color);
  border: 1px solid #ccc;
  border-radius: 4px;
}
div#month-wrap {
  height: 30px;
  background-color: var(--datepicker-month-color);
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
  background-color: var(--datepicker-buttons-hover);
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
  background-color: var(--datepicker-cells-color);
  border: 1px solid #999;
}
table#cal td.today {
  background-color: var(--datepicker-currentday-color);
  border: 1px solid #999;
}
table#cal td.disabled {
  color: #999;
}
table#cal td.empty, table#cal td.disabled {
  background-color: var(--datepicker-cellempty-color);
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
