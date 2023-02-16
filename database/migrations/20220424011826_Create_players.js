/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function(knex) {
  return knex.schema.createTable('players',(table)=>{
    table.increments().primary().notNullable()
    table.string('name')
    table.string('password')
    table.integer('rank')
    table.float('wallet')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('players')
};
