import EvaluationModel from '../example/EvaluationModel.js';
import Collection from './Collection.js';
import Query from './Query.js';
import { toSnakeCase } from './utils.js';
/**
 * Represents a Model class.
 */
export default class Model {
    static relations = {};
    static withRelations = [];
    static _url;
    static baseUrl = '/api';


    constructor(id) {
        this.id = id;
    }

    /**
     * Retrieves the URL for the model.
     * @returns {string} The URL for the model.
     */
    static getUrl(...extra) {
        if (this.entryPoint) {
            return `${this.baseUrl}/${this.entryPoint}`;
        }
        if (!this._url) {
            this._url = (this.baseUrl ? this.baseUrl + "/" : "") + toSnakeCase(this.name);
        }
        let result = this._url;
        if (extra.length > 0) {
            result += '/' + Array.from(extra).join('/');
        }
        return result;
    }

    /**
     * Retrieves the URL for the current instance of the model.
     * @returns {string} The URL for the current instance of the model.
     */
    getUrl() {
        return this.constructor.getUrl(this.id, ...arguments);
    }

    /**
     * Retrieves all instances of the model.
     * @returns {Promise<any[]>} A promise that resolves to an array of model instances.
     */
    static async all(where = {}) {
        const query = new Query(this, where);
        const response = await query.execute();
        return this.fromPayload(response);
    }

    /**
     * Retrieves an instance of the model with the specified ID.
     * @param {number} id - The ID of the model instance.
     * @returns {Promise<any>} A promise that resolves to the model instance.
     */
    static async find(id) {
        const query = new Query(this).find(id);
        // return query.execute().then(response => this.from(this.fromPayload(response)));
        return query.execute().then(response => {
            return this.from(this.fromPayload(response));
        });
    }

    /**
     * 
    */
    static async of(model) {
        const query = new Query(this).of(model);
        return query.execute().then(response => this.from(this.fromPayload(response)));
    }

    /**
     * Specifies relations to be eager loaded for the model instances.
     * @param {...string} relations - The names of the relations to be eager loaded.
     * @returns {Query} The Query instance for further chaining.
     */
    static with(...relations) {
        const query = new Query(this);
        return query.with(...relations);
    }
    static fromPayload(payload) {
        console.warn('fromPayload must be implemented in the derived class');
        return payload;
    }

    /**
     * Creates a model instance from the provided data object.
     * @param {object|object[]} data - The data object or array of data objects to create the model instance(s) from.
     * @returns {any|any[]} The created model instance or array of model instances.
     */
    static from(data) {
        if (Array.isArray(data)) {
            return this.fromArray(data);
        }

        const result = Object.assign(Object.create(this.prototype), data);
        
        for (const name in this.relations) {
            const relation = this.relations[name];
            if (result[relation.name]) {
                this.loadModel(relation.model).then(model => {
                    const relationData = result[relation.name];
                    result[relation.name] = model.from(relationData);
                }).catch(error => {
                    console.error('Error loading model:', error);
                });
            }
        }
        
        return result;
    }

    /**
     * Creates a new instance of Model from an array.
     * 
     * @param {Array} array - The array to create the Model instance from.
     * @returns {Collection[Model]} - The new Model instance.
     */
    static fromArray(array) {
        return new Collection(array).walk((item) => this.from(item));
    }
    /**
     * Loads a model dynamically.
     * @param {string|Function} model - The name or reference of the model to load.
     * @returns {Promise<Function>} A promise that resolves to the loaded model class.
     */
    static async loadModel(model) {
        if (typeof model === 'string') {
            return (await import(`../Models/${model}.js`)).default;
        }
        return model;
    }

    /**
     * Deletes one or multiple instances of the model.
     * @param {number|number[]} ids - The ID or array of IDs of the model instance(s) to delete.
     * @returns {Promise<any>} A promise that resolves to the response data after deletion.
     */
    static async delete(ids) {
        let response = null;

        if (Array.isArray(ids)) {
            response = await fetch(this.getUrl('delete'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            });
        } else {
            response = await fetch(this.getUrl(ids, 'delete'), {
                method: 'DELETE',
            });
        }

        return await response.json();
    }
    /**
     * Deletes the current instance of the model.
     * @returns {Promise<Model>} A promise that resolves to the deleted model instance.
     */
    async delete() {
        if (this.id === undefined) {
            return this;
        }
        try {
            const response = await fetch(this.getUrl(), {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                this.id = undefined;
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error deleting:', error);
        }
        return this;
    }

    /**
         * Saves the current instance of the model.
         * @returns {Promise<Model>} A promise that resolves to the saved model instance.
         */
    async save() {
        let response = null;
        console.log(this.id);
        const url = this.id ? this.getUrl() : this.constructor.getUrl();
        const method = this.id ? 'PUT' : 'POST';

        try {
            response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this)
            });
            const data = await response.json();
            if (data.status === 'success') {
                this.id = data.item.id;
            } else {
                console.error(data);
            }
        } catch (error) {
            console.error('Error saving:', error);
        }

        console.log(this, this.id);
        return this;
    }
    /**
 * Creates a clone of the current instance of the model.
 * @returns {Model} A clone of the current instance of the model.
 */
    clone() {
        return this.constructor.from({ ...this });
    }
}
