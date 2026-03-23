# cap-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                          | Type                                                      | Default     |
| ------------- | ------------- | ---------------------------------------------------- | --------------------------------------------------------- | ----------- |
| `disabled`    | `disabled`    | Disables the input                                   | `boolean`                                                 | `false`     |
| `error`       | `error`       | Error message — takes priority over hint and success | `string`                                                  | `undefined` |
| `hint`        | `hint`        | Hint text                                            | `string`                                                  | `undefined` |
| `label`       | `label`       | Label text                                           | `string`                                                  | `undefined` |
| `name`        | `name`        | Input name for forms                                 | `string`                                                  | `undefined` |
| `placeholder` | `placeholder` | Placeholder text                                     | `string`                                                  | `undefined` |
| `readonly`    | `readonly`    | Makes the input read-only                            | `boolean`                                                 | `false`     |
| `required`    | `required`    | Marks the input as required                          | `boolean`                                                 | `false`     |
| `success`     | `success`     | Success message — takes priority over hint           | `string`                                                  | `undefined` |
| `type`        | `type`        | Input type                                           | `"email" \| "number" \| "password" \| "search" \| "text"` | `'text'`    |
| `value`       | `value`       | Input value                                          | `string`                                                  | `''`        |


## Events

| Event       | Description                                            | Type                      |
| ----------- | ------------------------------------------------------ | ------------------------- |
| `capBlur`   | Emitted when the input loses focus                     | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the value changes                         | `CustomEvent<string>`     |
| `capClear`  | Emitted when the clear button is clicked (search type) | `CustomEvent<void>`       |
| `capFocus`  | Emitted when the input is focused                      | `CustomEvent<FocusEvent>` |
| `capInput`  | Emitted on input (every keystroke)                     | `CustomEvent<string>`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
