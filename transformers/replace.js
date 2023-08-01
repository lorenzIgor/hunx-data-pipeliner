// field: "agency",
// value: "CNN",
// newValue: "CLL",
// matchCase: false,
// matchWholeWord: false,
// matchGlobal: true,

const replace = (params) => {
  if (params.matchCase == null) params.matchCase = false;
  if (params.matchWholeWord == null) params.matchWholeWord = false;
  if (params.matchGlobal == null) params.matchGlobal = true;

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
      if (key === params.field) {
        const flagInsensitive = !params.matchCase ? "i" : "";
        const flagWholeWord = params.matchWholeWord ? "\\b" : "";
        const flagGlobal = params.matchGlobal ? "g" : "";

        const regExp = new RegExp(
            params.value + flagWholeWord,
            flagGlobal + flagInsensitive,
        );

        value = value.replace(regExp, params.newValue);
      }

      finalObj[key] = value;
    }
    newObject.data.push(finalObj);
  });

  return newObject;
};

module.exports = replace;
