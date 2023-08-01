const crypto = require("crypto");

const uuid = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
  });

  newObject.fields.push("uuid");

  if (params.salt == null) params.salt = "1qaz2wsx$BR";

  params.json.data.map((row) => {
    const finalObj = {};
    const arrFinalKey = [];

    for (const [key, value] of Object.entries(row)) {
      params.keys.map((uuidKey) => {
        if (key === uuidKey) arrFinalKey.push(value);
      });

      finalObj[key] = value;
    }

    const finalKey =
      arrFinalKey.length > 0 ?
        arrFinalKey.join("") + params.salt :
        Math.floor(Math.random(99999999));

    const hash = crypto.createHash(params.type).update(finalKey).digest("hex");
    finalObj.uuid = hash;

    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = uuid;
