# cap-multiselect



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                                                                                            | Type                      | Default     |
| ----------------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ----------- |
| `defaultOpen`     | `default-open`      | Forces the dropdown open — useful for debugging styles                                                                                                                 | `boolean`                 | `false`     |
| `disabled`        | `disabled`          | Disables the component                                                                                                                                                 | `boolean`                 | `false`     |
| `error`           | `error`             | Error message                                                                                                                                                          | `string`                  | `undefined` |
| `filterable`      | `filterable`        | When true, a text input is shown inside the trigger for filtering options. When false (default), the trigger is a select-only control.                                 | `boolean`                 | `false`     |
| `hint`            | `hint`              | Hint text                                                                                                                                                              | `string`                  | `undefined` |
| `label`           | `label`             | Label text                                                                                                                                                             | `string`                  | `undefined` |
| `maxVisibleChips` | `max-visible-chips` | Maximum chips shown in the trigger before a "+N" badge appears. Only relevant when overflow="single-line".                                                             | `number`                  | `3`         |
| `name`            | `name`              | Name attribute for form submission                                                                                                                                     | `string`                  | `undefined` |
| `options`         | --                  | Array of options to display                                                                                                                                            | `MultiselectOption[]`     | `[]`        |
| `overflow`        | `overflow`          | Controls chip layout. grow (default): the trigger expands vertically as chips are added. single-line: trigger stays one line; excess chips collapse into a "+N" badge. | `"grow" \| "single-line"` | `'grow'`    |
| `placeholder`     | `placeholder`       | Placeholder shown when no value is selected                                                                                                                            | `string`                  | `undefined` |
| `required`        | `required`          | Marks the component as required                                                                                                                                        | `boolean`                 | `false`     |
| `value`           | --                  | Currently selected values                                                                                                                                              | `string[]`                | `[]`        |


## Events

| Event       | Description                                   | Type                      |
| ----------- | --------------------------------------------- | ------------------------- |
| `capBlur`   | Emitted when focus leaves the component       | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the selected values change       | `CustomEvent<string[]>`   |
| `capFocus`  | Emitted when the trigger is focused           | `CustomEvent<FocusEvent>` |
| `capInput`  | Emitted on every keystroke in filterable mode | `CustomEvent<string>`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
