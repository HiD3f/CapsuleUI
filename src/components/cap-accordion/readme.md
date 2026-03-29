# cap-accordion



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description                                                                                                                          | Type                 | Default |
| ----------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ------- |
| `items`     | --           | Items to render                                                                                                                      | `AccordionItem[]`    | `[]`    |
| `multiple`  | `multiple`   | Allow multiple panels to be open simultaneously                                                                                      | `boolean`            | `false` |
| `openItems` | `open-items` | ID(s) of the open panel(s). Pass a string for single mode, or an array for multiple mode. When unset the accordion starts collapsed. | `string \| string[]` | `[]`    |


## Events

| Event       | Description                                                        | Type                                                               |
| ----------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `capChange` | Emitted when a panel is toggled. Detail: `{ id, open, openItems }` | `CustomEvent<{ id: string; open: boolean; openItems: string[]; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
