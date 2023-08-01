const renameField = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    if (f === params.value) f = params.newValue;
    newObject.fields.push(f);
  });

  params.json.data.map((row) => {
    const finalObj = {};
    for (let [key, value] of Object.entries(row)) {
      if (key === params.value) key = params.newValue;
      finalObj[key] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = renameField;
