# @bobanum/vue-model

<center>

**_Vue.js_ Model system based on _Laravel_ Models and Queries.**

![](vue-model-logo.svg)
</center>

## Installation

```bash
npm install @bobanum/vue-model
```

## configuration

In your project, create a file named `vue-model.js` in the root directory and add the following code:

```js
import { Model as ModelBase } from '@bobanum/vue-model';
export default class Model extends ModelBase {
    static get baseUrl() {
        return "http://localhost:8000/api";
    } 
}
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