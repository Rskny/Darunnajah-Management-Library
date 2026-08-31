exports.up = async function (knex) {
  const members = await knex('members').select('id');

  const parsed = members.map(m => {
    const prefix = m.id.charAt(0);
    const number = parseInt(m.id.substring(1), 10);
    return { oldId: m.id, prefix, number };
  }).sort((a, b) => a.number - b.number);

  const counters = {};
  const idMap = [];

  for (const m of parsed) {
    if (!counters[m.prefix]) counters[m.prefix] = 0;
    counters[m.prefix]++;

    const newId = `${m.prefix}${String(counters[m.prefix]).padStart(6, '0')}`;
    idMap.push({ oldId: m.oldId, newId });
  }

  await knex.transaction(async (trx) => {
    for (const { oldId, newId } of idMap) {
      if (oldId === newId) continue;

      await trx('members').where({ id: oldId }).update({ id: newId });
      await trx('transactions').where({ memberId: oldId }).update({ memberId: newId });
      await trx('visits').where({ memberId: oldId }).update({ memberId: newId });
    }
  });

  console.log(`✅ Migrasi selesai. ${idMap.filter(m => m.oldId !== m.newId).length} ID member diperbarui ke format 6 digit.`);
};

exports.down = function (knex) {
  return Promise.resolve();
};