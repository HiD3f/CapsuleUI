# cap-textarea



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description                                          | Type                             | Default      |
| ------------- | ------------- | ---------------------------------------------------- | -------------------------------- | ------------ |
| `ariaLabel`   | `aria-label`  | Accessible label for when no visible label is used   | `string`                         | `undefined`  |
| `disabled`    | `disabled`    | Disables the textarea                                | `boolean`                        | `false`      |
| `error`       | `error`       | Error message — takes priority over hint and success | `string`                         | `undefined`  |
| `hint`        | `hint`        | Hint text shown below the textarea                   | `string`                         | `undefined`  |
| `label`       | `label`       | Label text                                           | `string`                         | `undefined`  |
| `maxlength`   | `maxlength`   | Maximum number of characters allowed                 | `number`                         | `undefined`  |
| `name`        | `name`        | Name attribute for form submission                   | `string`                         | `undefined`  |
| `placeholder` | `placeholder` | Placeholder text                                     | `string`                         | `undefined`  |
| `readonly`    | `readonly`    | Makes the textarea read-only                         | `boolean`                        | `false`      |
| `required`    | `required`    | Marks the textarea as required                       | `boolean`                        | `false`      |
| `resize`      | `resize`      | Whether the textarea can be resized                  | `"both" \| "none" \| "vertical"` | `'vertical'` |
| `rows`        | `rows`        | Number of visible rows                               | `number`                         | `4`          |
| `success`     | `success`     | Success message — takes priority over hint           | `string`                         | `undefined`  |
| `value`       | `value`       | The current value of the textarea                    | `string`                         | `''`         |


## Events

| Event       | Description                              | Type                      |
| ----------- | ---------------------------------------- | ------------------------- |
| `capBlur`   | Emitted when the textarea loses focus    | `CustomEvent<FocusEvent>` |
| `capChange` | Emitted when the value changes (on blur) | `CustomEvent<string>`     |
| `capFocus`  | Emitted when the textarea is focused     | `CustomEvent<FocusEvent>` |
| `capInput`  | Emitted on every keystroke               | `CustomEvent<string>`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
