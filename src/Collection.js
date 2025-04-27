/**
 * Represents a collection of items. Loosely based on the {@link https://laravel.com/docs/11.x/collections|Laravel Collection} class.
 * @extends Map
 */
const keyName = 'id';	// Must stay outside the class definition because it is needed before super()
export default class Collection extends Map {
	constructor(iterable = []) {
		iterable = iterable.map((item) => [item[keyName], item]);
		super(iterable);		
	}
	walk(callback) {
		for (let [key, value] of this) {
			this.set(key, callback(value, key));
		}
		return this;
	}
	map(callback) {
		const result = new Collection();
		for (let [key, value] of this) {
			result.set(key, callback(value, key));
		}
		return result;
	}
	getAt(index) {
		return [...this.values()][index];
	}
	set(value) {
		if (arguments.length > 1) {
			return super.set(...arguments);
		}
		return super.set(value[keyName], value);		
	}
}