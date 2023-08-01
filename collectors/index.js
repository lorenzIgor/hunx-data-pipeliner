const {collectorType} = require("../enums");
const campaignManager = require("./campaign-manager");
const campaignManagerCreative = require("./campaign-manager-creative");

const collect = (type, params) => {
  switch (type) {
    case collectorType.CAMPAIGN_MANAGER:
      return campaignManager(params);

    case collectorType.CAMPAIGN_MANAGER_CREATIVE:
      return campaignManagerCreative(params);

    default:
      break;
  }
};

module.exports = {collect, collectorType};
