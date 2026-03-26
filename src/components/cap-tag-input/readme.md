# cap-tag-input



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute      | Description                                                                                                                                    | Type               | Default     |
| ------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ----------- |
| `defaultOpen` | `default-open` | Forces the dropdown open — useful for debugging styles                                                                                         | `boolean`          | `false`     |
| `disabled`    | `disabled`     | Disables the component                                                                                                                         | `boolean`          | `false`     |
| `error`       | `error`        | Error message                                                                                                                                  | `string`           | `undefined` |
| `hint`        | `hint`         | Hint text                                                                                                                                      | `string`           | `undefined` |
| `label`       | `label`        | Label text                                                                                                                                     | `string`           | `undefined` |
| `name`        | `name`         | Name attribute for form submission                                                                                                             | `string`           | `undefined` |
| `options`     | --             | Optional list of suggestions shown as an autocomplete dropdown while typing. If omitted, the component operates as a pure free-text tag input. | `TagInputOption[]` | `[]`        |
| `placeholder` | `placeholder`  | Placeholder shown when input is empty and no tags are present                                                                                  | `string`           | `undefined` |
| `required`    | `required`     | Marks the component as required                                                                                                                | `boolean`          | `false`     |
| `value`       | --             | Current tags. When a suggestion is selected, stores the option's value. When typed freely, stores the raw text.                                | `string[]`         | `[]`        |


## Events

| Event       | Description                             | Type                      |
| ----------- | --------------------------------------- | ------------------------- |
| `capBlur`   | Emitted when focus leaves the component | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the tag list changes       | `CustomEvent<string[]>`   |
| `capFocus`  | Emitted when the input is focused       | `CustomEvent<FocusEvent>` |
| `capInput`  | Emitted on every keystroke              | `CustomEvent<string>`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
