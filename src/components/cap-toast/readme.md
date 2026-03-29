# cap-toast



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description                                               | Type                                                                                              | Default       |
| ----------------- | ------------------ | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------- |
| `defaultDuration` | `default-duration` | Default auto-dismiss duration in ms (0 = no auto-dismiss) | `number`                                                                                          | `4000`        |
| `position`        | `position`         | Where toasts stack on screen                              | `"bottom-center" \| "bottom-left" \| "bottom-right" \| "top-center" \| "top-left" \| "top-right"` | `'top-right'` |


## Events

| Event        | Description                     | Type                           |
| ------------ | ------------------------------- | ------------------------------ |
| `capDismiss` | Emitted when a toast is removed | `CustomEvent<{ id: string; }>` |


## Methods

### `clear() => Promise<void>`

Remove all toasts immediately

#### Returns

Type: `Promise<void>`



### `dismiss(id: string) => Promise<void>`

Remove a toast by id (with exit animation)

#### Parameters

| Name | Type     | Description |
| ---- | -------- | ----------- |
| `id` | `string` |             |

#### Returns

Type: `Promise<void>`



### `show(options: ToastOptions) => Promise<string>`

Add a toast notification.
Returns the id so you can dismiss it programmatically.

#### Parameters

| Name      | Type           | Description |
| --------- | -------------- | ----------- |
| `options` | `ToastOptions` |             |

#### Returns

Type: `Promise<string>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
