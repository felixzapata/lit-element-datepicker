# \<lit-element-datepicker\>
LitElement component based on the accessible [Date Picker from Open Ajax Alliance](http://www.oaa-accessibility.org/examplep/datepicker1/).

## Installation

```sh
$ npm install lit-element-datepicker --save
```

## Properties

### date
Type: `String`

The selected date, based on ISO 8601

### locale
Type: `String`

Default: `en`

To localize the calendar using Moment.js

### initDate
Type: `String`

Optional init date for the calendar, based on ISO 8601

### minDate
Type: `String`

Optional min date for the calendar, based on ISO 8601

### maxDate
Type: `String`

Optional max date for the calendar, based on ISO 8601

## Keyboard support


+ Left: Move focus to the previous day. Will move to the last day of the previous month, if the current day is the first day of a month.
+ Right: Move focus to the next day. Will move to the first day of the following month, if the current day is the last day of a month.
+ Up: Move focus to the same day of the previous week. Will wrap to the appropriate day in the previous month.
+ Down: Move focus to the same day of the following week. Will wrap to the appropriate day in the following month.
+ PgUp: Move focus to the same date of the previous month. If that date does not exist, focus is placed on the last day of the month.
+ PgUp: Move focus to the same date of the following month. If that date does not exist, focus is placed on the last day of the month.
+ Ctrl+PgUp: Move focus to the same date of the previous year. If that date does not exist (e.g leap year), focus is placed on the last day of the month.
+ Ctrl+PgDn: Move focus to the same date of the following year. If that date does not exist (e.g leap year), focus is placed on the last day of the month.
+ Home: Move to the first day of the month.
+ End: Move to the last day of the month
+ Tab: Navigate between calander grid and previous/next selection buttons
+ Enter/Space: Select date

## TODO

+ Add tests.
+ Add more custom CSS properties.
+ Set focus on the focus target.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## License

[MIT License](https://opensource.org/licenses/MIT)
