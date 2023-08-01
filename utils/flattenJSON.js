const flattenJSON = (obj, parentKey = "", result = {}) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = parentKey ? `${parentKey}_${key}` : key;
      if (Array.isArray(obj[key])) {
        for (let i = 0; i < obj[key].length; i++) {
          flattenJSON(obj[key][i], `${newKey}_${i}`, result);
        }
      } else if (typeof obj[key] === "object") {
        flattenJSON(obj[key], newKey, result);
      } else {
        result[newKey] = obj[key];
      }
    }
  }
  return result;
};

module.exports = flattenJSON;
