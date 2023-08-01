const crypto = require("crypto");

const hash = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
  });

  if (params.salt == null) params.salt = "1qaz2wsx$BR";

  params.json.data.map((row) => {
    const finalObj = {};
    for (let [key, value] of Object.entries(row)) {
      if (key === params.value && value != null) {
        const newValue = value + params.salt;
        const hash = crypto
            .createHash(params.type)
            .update(newValue)
            .digest("hex");
        value = hash;
      }

      finalObj[key] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = hash;
