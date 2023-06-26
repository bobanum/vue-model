import axios from 'axios';
import { toSnakeCase } from './utils';

/**
 * Represents a Query class.
 */
export default class Query {
    table = '';
    relations = [];
    model = null;

    /**
     * Creates a Query instance.
     * @param {Model} model - The model class associated with the query.
     * @param {string|null} table - The table name for the query. If not provided, it will be derived from the model.
     */
    constructor(model, table = null) {
        this.model = model;
        this.table = table || model.table || toSnakeCase(model.name);
    }

    /**
     * Retrieves all instances matching the query.
     * @returns {Promise<any[]>} A promise that resolves to an array of model instances.
     */
    async all() {
        try {
            const url = `${this.model.getUrl()}${this.querystring}`;
            const response = await axios.get(url);
            const result = response.data.map(data => {
                return this.model.from(data);
            });
            return result;
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
            const response = await axios.get(url);
            const result = this.model.from(response.data);
            return result;
        } catch (error) {
            console.error('Error retrieving instance:', error);
            throw error;
        }
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
