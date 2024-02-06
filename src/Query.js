import axios from 'axios';
import { toSnakeCase } from './utils.js';
import Model from './Model.js';

/**
 * Represents a Query class.
 */
export default class Query {
    table = '';
    id = null;
    relations = [];
    model = null;
    instance = null;
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
            console.debug('Query.execute():', this.getUrl());
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
     * Retrieves an instance by its ID.
     * @param {number} id - The ID of the instance to find.
     * @returns {Promise<any>} A promise that resolves to the model instance.
     */
    find(id) {
        this.id = id;
        return this;
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
