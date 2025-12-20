let records = getRecords();

// bu levelde daha önce kabul edilmiş record var mı?
let hasFirst = records.some(r =>
  r.levelId === record.levelId &&
  r.approved &&
  r.isFirst
);

record.approved = true;

// yoksa bu ilk record → FIRST
if (!hasFirst) {
  record.isFirst = true;
} else {
  record.isFirst = false;
}

saveRecords(records);
