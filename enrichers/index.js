const {enricherType} = require("../enums");
// eslint-disable-next-line max-len
const googleCampaignManagerCreativeAssets = require("./google-campaign-manager-creative-assets");

const enrich = (params) => {
  switch (params.plugin) {
    case enricherType.GOOGLE_CAMPAIGN_MANAGER_CREATIVE_ASSETS:
      return googleCampaignManagerCreativeAssets(params);

    default:
      break;
  }
};

module.exports = {enrich, enricherType};
