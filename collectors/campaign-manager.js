const {google} = require("googleapis");
const axios = require("axios");

const campaignManager = async (params) => {
  const auth = new google.auth.GoogleAuth({
    projectId: params.projectId,
    credentials: params.credentials,
    scopes: ["https://www.googleapis.com/auth/dfareporting"],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});

  const CMProfileID = params.profileId;

  const {data} = await google.dfareporting("v4").reports.insert({
    profileId: CMProfileID,
    requestBody: params.requestBody,
  });

  const CMReportId = data.id;

  await google.dfareporting("v4").reports.run({
    profileId: CMProfileID,
    reportId: CMReportId,
  });

  // Intervalo de tempo para verificar o status do relatório
  let status;
  let CMFileId;
  const interval = params.interval != null ? params.interval : 5000;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, interval));

    // Obtém o status do relatório
    const {data} = await google.dfareporting("v4").reports.files.list({
      profileId: CMProfileID,
      reportId: CMReportId,
    });

    status = data.items[0].status;

    if (status === "REPORT_AVAILABLE") {
      CMFileId = data.items[0].id;
      break;
    } else if (status === "REPORT_FAILED") {
      return;
    }
  }

  const {data: fileData} = await google.dfareporting("v4").files.get({
    profileId: CMProfileID,
    reportId: CMReportId,
    fileId: CMFileId,
  });

  const accessToken = (await authClient.getAccessToken()).token;

  const responseFetch = await axios({
    method: "get",
    url: fileData.urls.apiUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: "blob",
  });

  // split newlines and remove garbage data with slice
  const arrData = responseFetch.data.split(/\r?\n/);
  const arrHeader = [];
  const result = [];

  let canContinue = false;
  let rowIndex = 0;

  arrData.map((row) => {
    const cols = row.split(",");

    if (cols[0] == "Report Fields") {
      canContinue = true;
      return;
    }

    if (cols[0] == "Grand Total:") canContinue = false;

    if (!canContinue) return;

    const obj = {};
    cols.map((col, colIndex) => {
      if (rowIndex == 0) {
        col = col.toLowerCase().replace(/\s/g, "_").replace(/:/g, "");
        arrHeader.push(col);
        // TODO MATCH dataType
      } else {
        obj[arrHeader[colIndex]] = col.replace(/"/g, "");
      }
    });
    if (rowIndex > 0) result.push(obj);
    rowIndex++;
  });

  return {fields: arrHeader, data: result};
};

module.exports = campaignManager;
