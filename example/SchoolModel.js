import Model from "./Model.js";
export default class SchoolModel extends Model {
	static entryPoint = 'schools';
	fromPayload(payload) {
		return payload;
	}
	static fromArray(payload) {
		if (!payload) {
			return null;
		}
		console.warn("TODO: fromArray");
		// return payload.schools || super.fromPayload(payload);
	}
	static fromPayload(payload) {
		// console.log(payload);
		
        // return this.fromArray(payload.schools || super.fromPayload(payload));
    }
}
