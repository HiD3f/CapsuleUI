# cap-tabs



<!-- Auto Generated Below -->


## Properties

| Property    | Attribute    | Description          | Type        | Default |
| ----------- | ------------ | -------------------- | ----------- | ------- |
| `activeTab` | `active-tab` | ID of the active tab | `string`    | `''`    |
| `tabs`      | --           | Tab definitions      | `TabItem[]` | `[]`    |


## Events

| Event       | Description                                                                      | Type                           |
| ----------- | -------------------------------------------------------------------------------- | ------------------------------ |
| `capChange` | Emitted when the active tab changes. Detail: `{ id }` — the newly active tab id. | `CustomEvent<{ id: string; }>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
