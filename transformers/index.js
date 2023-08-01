const {transformerType, convertionType} = require("../enums");
const renameField = require("./rename-field");
const grok = require("./grok");
const clone = require("./clone");
const hash = require("./hash");
const replace = require("./replace");
const uuid = require("./uuid");
const convert = require("./convert");
const addField = require("./add-field");
const {enrich, enricherType} = require("../enrichers");

const transform = (type, params) => {
  switch (type) {
    case transformerType.RENAME_FIELD:
      return renameField(params);

    case transformerType.GROK:
      return grok(params);

    case transformerType.CLONE:
      return clone(params);

    case transformerType.HASH:
      return hash(params);

    case transformerType.REPLACE:
      return replace(params);

    case transformerType.UUID:
      return uuid(params);

    case transformerType.CONVERT:
      return convert(params);

    case transformerType.ADD_FIELD:
      return convert({
        json: addField(params),
        value: params.field,
        type: params.type,
      });

    case transformerType.ENRICH:
      return enrich(params);

    default:
      break;
  }
};

module.exports = {transform, transformerType, convertionType, enricherType};
