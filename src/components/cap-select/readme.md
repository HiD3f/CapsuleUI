# cap-select



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                 | Type             | Default     |
| ------------- | ------------- | ------------------------------------------- | ---------------- | ----------- |
| `disabled`    | `disabled`    | Disables the select                         | `boolean`        | `false`     |
| `error`       | `error`       | Error message                               | `string`         | `undefined` |
| `hint`        | `hint`        | Hint text                                   | `string`         | `undefined` |
| `label`       | `label`       | Label text                                  | `string`         | `undefined` |
| `name`        | `name`        | Name attribute for form submission          | `string`         | `undefined` |
| `options`     | --            | Array of options to render                  | `SelectOption[]` | `[]`        |
| `placeholder` | `placeholder` | Placeholder shown when no value is selected | `string`         | `undefined` |
| `required`    | `required`    | Marks the select as required                | `boolean`        | `false`     |
| `value`       | `value`       | Currently selected value                    | `string`         | `''`        |


## Events

| Event       | Description                             | Type                      |
| ----------- | --------------------------------------- | ------------------------- |
| `capBlur`   | Emitted when focus leaves the component | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the selected value changes | `CustomEvent<string>`     |
| `capFocus`  | Emitted when the trigger is focused     | `CustomEvent<FocusEvent>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
