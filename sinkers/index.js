const {sinkerType} = require("../enums");
const firestore = require("./firestore");

const sink = (type, params) => {
  switch (type) {
    case sinkerType.FIRESTORE:
      return firestore(params);
    default:
      break;
  }
};

module.exports = {sink, sinkerType};
