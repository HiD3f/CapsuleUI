# cap-modal



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute           | Description                                                                                  | Type      | Default   |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------- | --------- | --------- |
| `closeOnBackdrop` | `close-on-backdrop` | Close the modal when the backdrop is clicked. Set to false to require explicit close action. | `boolean` | `true`    |
| `heading`         | `heading`           | Modal title shown in the header                                                              | `string`  | `''`      |
| `hideClose`       | `hide-close`        | Hide the default close (×) button in the header                                              | `boolean` | `false`   |
| `open`            | `open`              | Whether the modal is open                                                                    | `boolean` | `false`   |
| `width`           | `width`             | Width of the modal panel. Any valid CSS width value, e.g. '480px', '60vw', '100%'.           | `string`  | `'480px'` |


## Events

| Event      | Description                                                                    | Type                |
| ---------- | ------------------------------------------------------------------------------ | ------------------- |
| `capClose` | Emitted when the modal requests to close (× button, Escape, or backdrop click) | `CustomEvent<void>` |
| `capOpen`  | Emitted after the modal finishes opening                                       | `CustomEvent<void>` |


## Methods

### `hide() => Promise<void>`

Programmatically close the modal

#### Returns

Type: `Promise<void>`



### `show() => Promise<void>`

Programmatically open the modal

#### Returns

Type: `Promise<void>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
