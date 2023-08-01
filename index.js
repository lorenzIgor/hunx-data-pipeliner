const { collect, collectorType } = require("./collectors");
const {
  transform,
  transformerType,
  convertionType,
  enricherType,
} = require("./transformers");
const { sink, sinkerType } = require("./sinkers");

module.exports = {
  collect,
  collectorType,
  transform,
  transformerType,
  convertionType,
  enricherType,
  sink,
  sinkerType,
};
