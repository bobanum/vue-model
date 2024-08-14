import Model from "./Model.js";
export default class EvaluationModel extends Model {
	static entryPoint = 'evaluations';
	fromPayload(payload) {
		return payload;
	}
	test() {
		return "test";
	}
	// static fromArray(payload) {
	// 	if (!payload) {
	// 		return null;
	// 	}
	// 	console.warn("TODO: fromArray");
		
	// }
}
