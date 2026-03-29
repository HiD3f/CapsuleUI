# cap-switch



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                | Type      | Default     |
| ---------- | ---------- | ------------------------------------------ | --------- | ----------- |
| `checked`  | `checked`  | Whether the switch is on                   | `boolean` | `false`     |
| `disabled` | `disabled` | Disables the switch                        | `boolean` | `false`     |
| `error`    | `error`    | Error message displayed below the switch   | `string`  | `undefined` |
| `hint`     | `hint`     | Hint text displayed below the switch       | `string`  | `undefined` |
| `label`    | `label`    | Label text displayed above the switch      | `string`  | `undefined` |
| `name`     | `name`     | Name attribute for form submission         | `string`  | `undefined` |
| `required` | `required` | Marks the switch as required               | `boolean` | `false`     |
| `value`    | `value`    | Value submitted with the form when checked | `string`  | `'on'`      |


## Events

| Event       | Description                            | Type                                                |
| ----------- | -------------------------------------- | --------------------------------------------------- |
| `capBlur`   | Emitted when the switch loses focus    | `CustomEvent<void>`                                 |
| `capChange` | Emitted when the checked state changes | `CustomEvent<{ checked: boolean; value: string; }>` |
| `capFocus`  | Emitted when the switch receives focus | `CustomEvent<void>`                                 |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
