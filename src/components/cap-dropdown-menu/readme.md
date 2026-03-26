# cap-dropdown-menu



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                    | Type               | Default     |
| ---------- | ---------- | -------------------------------------------------------------- | ------------------ | ----------- |
| `align`    | `align`    | Horizontal alignment of the menu panel relative to the trigger | `"end" \| "start"` | `'start'`   |
| `disabled` | `disabled` | Disables the trigger                                           | `boolean`          | `false`     |
| `icon`     | `icon`     | Optional icon shown in the trigger                             | `string`           | `undefined` |
| `items`    | --         | Menu items                                                     | `MenuItem[]`       | `[]`        |
| `label`    | `label`    | Trigger button label                                           | `string`           | `''`        |


## Events

| Event       | Description                                                             | Type                                                 |
| ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| `capSelect` | Emitted when an action or link item is activated                        | `CustomEvent<MenuItem>`                              |
| `capToggle` | Emitted when a toggle item is activated; checked reflects the new state | `CustomEvent<{ item: MenuItem; checked: boolean; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
