const {convertionType} = require("../enums");

const convert = (params) => {
  const newObject = {};
  newObject.fields = [];
  newObject.data = [];

  params.json.fields.map((f) => {
    newObject.fields.push(f);
  });

  params.json.data.map((row) => {
    const finalObj = {};
    for (let [key, value] of Object.entries(row)) {
      if (key === params.value) {
        try {
          value = internalConvert(params.type, value);
        } catch (e) {} // eslint-disable-line
      }
      finalObj[key] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

const internalConvert = (type, value) => {
  let newValue = null;
  switch (type) {
    case convertionType.DATE:
      newValue = new Date(value);
      break;
    case convertionType.TIMESTAMP:
      newValue = new Date(value).getTime();
      break;
    case convertionType.FLOAT:
      newValue = parseFloat(value);
      break;
    case convertionType.INT:
      newValue = parseInt(value);
      break;
    case convertionType.STRING:
      newValue = value.toString();
      break;
    default:
      break;
  }
  return newValue;
};

module.exports = convert;
