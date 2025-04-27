import ModelBase from '../src/Model.js';
export default class Model extends ModelBase {
    static get baseUrl() {
        return "http://localhost:8080";
    }
    static fromPayload(payload) {
        return super.fromPayload(payload.results);
    }
}