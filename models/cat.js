const { getDBReference } = require('../lib/mongo');

exports.getAllCats = async function () {
  const db = getDBReference();
  return db.collection('cats').find({}).toArray();
}



exports.insertNewCat = async function (cat) {
  const db = getDBReference();
  const catDocument = { url: cat.url };
  const result = await db.collection('cats').insertOne(catDocument);
  return result.insertedId;
}
