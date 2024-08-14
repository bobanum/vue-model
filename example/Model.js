import ModelBase from '../src/Model.js';
export default class Model extends ModelBase {
	static entryPoint = 'parent';
    static get baseUrl() {
        return "http://localhost:8080";
    } 
    static fromPayload(payload) {        
        return this.fromArray(payload.results || payload[this.entryPoint] || payload);
    }
}