# cap-context-menu



<!-- Auto Generated Below -->


## Properties

| Property   | Attribute  | Description                                                  | Type         | Default          |
| ---------- | ---------- | ------------------------------------------------------------ | ------------ | ---------------- |
| `disabled` | `disabled` | Disables the context menu (browser default is shown instead) | `boolean`    | `false`          |
| `items`    | --         | Menu items                                                   | `MenuItem[]` | `[]`             |
| `label`    | `label`    | Accessible label for the menu panel                          | `string`     | `'Context menu'` |


## Events

| Event       | Description                                                             | Type                                                 |
| ----------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| `capSelect` | Emitted when an action or link item is activated                        | `CustomEvent<MenuItem>`                              |
| `capToggle` | Emitted when a toggle item is activated; checked reflects the new state | `CustomEvent<{ item: MenuItem; checked: boolean; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
