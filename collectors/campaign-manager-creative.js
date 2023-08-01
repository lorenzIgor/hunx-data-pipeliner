const {google} = require("googleapis");
const flattenJSON = require("../utils/flattenJSON");

const campaignManagerCreative = async (params) => {
  const auth = new google.auth.GoogleAuth({
    projectId: params.projectId,
    credentials: params.credentials,
    scopes: ["https://www.googleapis.com/auth/dfatrafficking"],
  });

  const authClient = await auth.getClient();
  google.options({auth: authClient});

  const {data} = await google.dfareporting("v4").creatives.get({
    id: params.creativeId,
    profileId: params.profileId,
  });

  const flattenData = flattenJSON(data);
  return {fields: Object.keys(flattenData), data: [flattenData]};
};

module.exports = campaignManagerCreative;
