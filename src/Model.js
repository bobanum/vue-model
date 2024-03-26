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
    /**
     * Retrieves the URL for the model.
     * @returns {string} The URL for the model.
     */
    static getUrl(...extra) {
        if (!this._url) {
            this._url = (this.baseUrl ? this.baseUrl + "/" : "") + (this.entryPoint || toSnakeCase(this.name));
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
        return query.execute().then(response => this.from(this.getPayload(response)));
    }

    /**
     * Retrieves an instance of the model with the specified ID.
     * @param {number} id - The ID of the model instance.
     * @returns {Promise<any>} A promise that resolves to the model instance.
    */
    static async find(id) {
        const query = new Query(this).find(id);
        // return query.execute().then(response => this.from(this.getPayload(response)));
        return query.execute().then(response => {
            return this.from(this.getPayload(response));
        });
    }

    /**
     * 
    */
    static async of(model) {
        const query = new Query(this).of(model);
        return query.execute().then(response => this.from(this.getPayload(response)));
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

    /**
     * Creates a model instance from the provided data object.
     * @param {object|object[]} data - The data object or array of data objects to create the model instance(s) from.
     * @returns {any|any[]} The created model instance or array of model instances.
     */
    static from(data) {
        if (Array.isArray(data)) {
            return data.map(object => this.from(object));
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
            response = await axios.post(this.getUrl('delete'), { ids });
        } else {
            response = await axios.delete(this.getUrl(ids, 'delete'));
        }
        return response.data;
    }
    // sync function postData(url = "", data = {}) {
    //     // Default options are marked with *
    //     const response = await fetch(url, {
    //       method: "POST", // *GET, POST, PUT, DELETE, etc.
    //       mode: "cors", // no-cors, *cors, same-origin
    //       cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //       credentials: "same-origin", // include, *same-origin, omit
    //       headers: {
    //         "Content-Type": "application/json",
    //         // 'Content-Type': 'application/x-www-form-urlencoded',
    //       },
    //       redirect: "follow", // manual, *follow, error
    //       referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    //       body: JSON.stringify(data), // body data type must match "Content-Type" header
    //     });
    //     return response.json(); // parses JSON response into native JavaScript objects
    //   }
    /**
     * Deletes the current instance of the model.
     * @returns {Promise<Model>} A promise that resolves to the deleted model instance.
     */
    async delete() {
        if (this.id === undefined) {
            return this;
        }
        try {
            const response = await axios.delete(this.getUrl());
            if (response.data.success) {
                this.id = undefined;
            } else {
                console.error(response.data);
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
        if (!this.id) {
            response = await axios.post(this.constructor.getUrl(), this);
        } else {
            response = await axios.put(this.getUrl(), this);
        }
        if (response.data.status === 'success') {
            this.id = response.data.item.id;
        } else {
            console.error(response.data);
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
