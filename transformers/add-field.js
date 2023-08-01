const addField = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
  });

  newObject.fields.push(params.field);

  // TODO ADD MORE FIELDS WITH REG EXP
  // eg: newField => '${campaign}, ${advertiser} : ${impressions}'
  params.json.data.map((row) => {
    row[params.field] = params.value;
    newObject.data.push(row);
  });

  return newObject;
};

module.exports = addField;
