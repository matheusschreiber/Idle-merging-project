// Update with your config settings.
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'better-sqlite3',
    connection: {
      filename: './database/db.sqlite3'
    },
    migrations:{
      directory: './database/migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host : process.env.NEXT_PUBLIC_PG_HOST,
      port : process.env.NEXT_PUBLIC_PG_PORT,
      user : process.env.NEXT_PUBLIC_PG_USER,
      password : process.env.NEXT_PUBLIC_PG_PASSWORD,
      database : process.env.NEXT_PUBLIC_PG_DATABASE
    },
    migrations: {
      directory: './database/migrations'
    }
  }

};
