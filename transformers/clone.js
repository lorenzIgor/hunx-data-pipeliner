const clone = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
    if (f === params.value) newObject.fields.push(params.newValue);
  });

  params.json.data.map((row) => {
    const finalObj = {};
    for (const [key, value] of Object.entries(row)) {
      finalObj[key] = value;

      if (key === params.value) finalObj[params.newValue] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = clone;
