const csvToJson = (
    data,
    slice = [0, data.length],
    splitNewLines = true,
    delimiter = ",",
) => {
  let arrData = [];

  // split newlines and remove garbage data with slice
  if (splitNewLines) arrData = data.split(/\r?\n/);

  if (slice.length > 1) arrData = arrData.slice(slice[0], slice[1]);
  else if (slice.length > 0) arrData = arrData.slice(slice[0]);

  const arrHeader = [];
  const result = [];

  arrData.map((row, rowIndex) => {
    const cols = row.split(",");
    const obj = {};
    cols.map((col, colIndex) => {
      if (rowIndex == 0) {
        arrHeader.push(col);
      } else {
        obj[arrHeader[colIndex]] = col;
      }
    });
    if (rowIndex > 0) result.push(obj);
  });

  return result;
};

module.exports = csvToJson;
