import Model from './Model.js';
import { toSnakeCase } from './utils.js';

/**
 * Represents a Query class loosely based on Laravel's Eloquent {@link https://laravel.com/docs/11.x/queries|Query Builder}.
 */
export default class Query {
    table = '';
    id = null;
    relations = [];
    model = null;   // The model class associated with the query.
    instance = null;    // The model instance associated with the query.
    where = {};
    orderBy = [];
    limit = 0;
    _of = null;

    /**
     * Creates a Query instance.
     * @param {Model} model - The model class associated with the query.
     * @param {string|null} table - The table name for the query. If not provided, it will be derived from the model.
     */
    constructor(model, table = null) {
        if (model instanceof Model) {
            this.model = model.constructor;
            this.instance = model;
        } else {
            this.model = model;
        }
        this.table = table || model.tableName || toSnakeCase(model.name);
    }
    where() {
        console.warn('where() is not implemented yet.');
        
        return this.execute();
    }
    get() {
        console.warn('get() is not implemented yet.');
        return this.execute();
    }
    /**
     * Retrieves all instances matching the query.
     * @returns {Promise<any[]>} A promise that resolves to an array of model instances.
     */
    async execute() {
        try {
            const options = {
                method: "GET",
                mode: "cors",
                // cache: "no-cache",
                // credentials: "same-origin",
                // headers: {
                // "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // }
            };
            return fetch(this.getUrl(), options).then(response => response.json());
        } catch (error) {
            console.error('Error retrieving instances:', error);
            throw error;
        }
    }

    getUrl(...extra) {
        if (this._of) {
            return `${this._of.getUrl(this.table, ...extra)}${this.querystring}`;
        } else {
            if (this.id) {
                extra.unshift(this.id);
            }
            let url = (this.instance || this.model).getUrl(...extra);
            return `${url}${this.querystring}`;
        }
    }
    /**
     * Retrieves all instances from the server.
     *
     * @returns {Promise<any>} A promise that resolves to the JSON response.
     * @throws {Error} If there was an error retrieving the instances.
     */
    async all() {
        try {
            const url = `${this.model.getUrl()}${this.querystring}`;
            const response = await fetch(url);
            return await response.json();
        } catch (error) {
            console.error('Error retrieving instances:', error);
            throw error;
        }
    }

    /**
     * Retrieves an instance by its ID.
     * @param {number} id - The ID of the instance to find.
     * @returns {Promise<any>} A promise that resolves to the model instance.
     */
    async find(id) {
        try {
            const url = `${this.model.getUrl(id)}${this.querystring}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const result = this.model.from(data);
            return result;
        } catch (error) {
            console.error('Error retrieving instance:', error);
            throw error;
        }
    }

    of(model) {
        this._of = new Query(model);
        return this;
    }
    /**
 * Specifies relations to be eager loaded for the query.
 * @param {...string} relations - The names of the relations to be eager loaded.
 * @returns {Query} The Query instance for further chaining.
 */
    with(...relations) {
        this.relations.push(...relations);
        return this;
    }

    /**
     * Generates the querystring based on the specified relations.
     * @returns {string} The generated querystring.
     */
    get querystring() {
        const relations = this.relations.join(',');
        if (relations) {
            return `?with=${relations}`;
        }
        return '';
    }
}
