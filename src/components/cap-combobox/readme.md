# cap-combobox



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                                                       | Type               | Default     |
| ------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `defaultOpen` | `default-open` | Forces the dropdown open — useful for debugging styles                                                                                                                            | `boolean`          | `false`     |
| `disabled`    | `disabled`     | Disables the combobox                                                                                                                                                             | `boolean`          | `false`     |
| `error`       | `error`        | Error message                                                                                                                                                                     | `string`           | `undefined` |
| `freeText`    | `free-text`    | When true, typed text that doesn't match any option is accepted as a valid value. When false (default), blurring without selecting reverts the input to the last valid selection. | `boolean`          | `false`     |
| `hint`        | `hint`         | Hint text                                                                                                                                                                         | `string`           | `undefined` |
| `label`       | `label`        | Label text                                                                                                                                                                        | `string`           | `undefined` |
| `name`        | `name`         | Name attribute for form submission                                                                                                                                                | `string`           | `undefined` |
| `options`     | --             | Array of options to filter and display                                                                                                                                            | `ComboboxOption[]` | `[]`        |
| `placeholder` | `placeholder`  | Placeholder shown when input is empty                                                                                                                                             | `string`           | `undefined` |
| `required`    | `required`     | Marks the combobox as required                                                                                                                                                    | `boolean`          | `false`     |
| `value`       | `value`        | Committed value — option.value when selected, or typed text when freeText=true                                                                                                    | `string`           | `''`        |


## Events

| Event       | Description                              | Type                      |
| ----------- | ---------------------------------------- | ------------------------- |
| `capBlur`   | Emitted when focus leaves the component  | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the committed value changes | `CustomEvent<string>`     |
| `capFocus`  | Emitted when the input is focused        | `CustomEvent<FocusEvent>` |
| `capInput`  | Emitted on every keystroke               | `CustomEvent<string>`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
