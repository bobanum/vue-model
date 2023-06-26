# @bobanum/vue-model

Vue Model system based on Laravel Models and Queries.

## Installation

```bash
npm install @bobanum/vue-model
```

## Usage

```js
import Vue from 'vue'
import {Model} from '@bobanum/vue-model'
export default class Task extends Model {
  static get url () {
	return '/api/model'
  }
  static get fields () {
	return {
	  id: {
		type: Number,
		default: null
	  },
	  name: {
		type: String,
		default: null
	  }
	}
  }
}
```

## API call examples

| Method      | Verb | URL       | Description   |
| ----------- | ---- | --------- | ------------- |
| `Model.all()` | GET  | `/api/task` | gets all rows |


> To be continued