const grok = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
  });

  params.match.map((field) => {
    newObject.fields.push(field.newValue);
  });

  params.json.data.map((row) => {
    const finalObj = {};
    for (const [key, value] of Object.entries(row)) {
      if (key === params.value) {
        const arrValues = value.split(params.delimiter);

        params.match.map((field, index) => {
          finalObj[field.newValue] =
            index < arrValues.length - 1 ? arrValues[index] : null;
          // TODO CONVERTION
        });
      }

      finalObj[key] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = grok;
