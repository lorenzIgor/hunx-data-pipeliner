const {collect, collectorType} = require("../collectors");

const googleCampaignManagerCreativeAssets = async (params) => {
  if (params.prefix == null) params.prefix = "";

  const promisesArray = params.json.data.map(
      async (row) => await asyncCall(row, params),
  );

  const rows = await Promise.all(promisesArray);

  return {fields: Object.keys(rows[0]), data: rows};
};

const asyncCall = async (row, params) => {
  const creative = await collect(collectorType.CAMPAIGN_MANAGER_CREATIVE, {
    profileId: row.platform_profile_id,
    creativeId: row.platform_creative_id,
    projectId: params.projectId,
    credentials: params.credentials,
  });

  row[params.prefix + "creative_asset_type"] = creative.data[0].type;

  // eslint-disable-next-line max-len
  row[params.prefix + "creative_asset_identifier_type"] =
    typeof creative.data[0].creativeAssets_0_assetIdentifier_type == "undefined" ?
      null :
      creative.data[0].creativeAssets_0_assetIdentifier_type; // eslint-disable-next-line max-len

  row[params.prefix + "creative_asset_role"] =
    typeof creative.data[0].creativeAssets_0_role == "undefined" ?
      null :
      creative.data[0].creativeAssets_0_role;

  row[params.prefix + "creative_asset_url_serving"] = null;

  if (creative.data[0].creativeAssets_0_assetIdentifier_type === "VIDEO") {
    row[params.prefix + "creative_asset_url_serving"] =
      creative.data[0].creativeAssets_0_progressiveServingUrl;
  } else if (
    typeof creative.data[0].creativeAssets_0_assetIdentifier_name != "undefined"
  ) {
    row[params.prefix + "creative_asset_url_serving"] =
      "https://s0.2mdn.net/" +
      creative.data[0].advertiserId +
      "/" +
      creative.data[0].creativeAssets_0_assetIdentifier_name;
  }

  return row;
};

module.exports = googleCampaignManagerCreativeAssets;
