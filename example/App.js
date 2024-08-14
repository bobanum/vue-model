import EvaluationModel from "./EvaluationModel.js";
import SchoolModel from "./SchoolModel.js";
export default class App {
	static main() {
		EvaluationModel.all().then((evaluations) => {
			console.log(evaluations);
		});
		// SchoolModel.all().then((schools) => {
		// 	console.log(schools);
		// });
	}
}