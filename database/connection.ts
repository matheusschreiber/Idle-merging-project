import knex from 'knex'
import configuration from '../knexfile'

export default knex(configuration.development)