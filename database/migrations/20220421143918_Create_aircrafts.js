/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('aircrafts',(table)=>{
    table.increments().primary().notNullable()
    table.integer('level')
    table.float('money_per_second')
    table.float('bonus_multiplier')
    table.string('owner')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('aircrafts')
};
