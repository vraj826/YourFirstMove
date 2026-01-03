import Knex from 'knex';
import { Model } from 'objection';
import knexConfig from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

export const knex = Knex(config);

// Bind Objection.js models to Knex instance
Model.knex(knex);

export default knex;
