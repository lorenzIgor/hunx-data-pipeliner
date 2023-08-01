const logger = require("firebase-functions/logger");
const {google} = require("googleapis");
const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
const crypto = require("crypto");

const loadDV360 = async (
    dateString,
    requestBody,
    auth = null,
    firestore = null,
    firestoreDestination = "hands-dbm-standard-daily",
    includeCreativeData = true,
    customDateRange = null,
) => {
  if (auth == null || firestore == null) return;

  const customDate = new Date(dateString);

  const customDay = customDate.getDate();
  const customMonth = customDate.getMonth() + 1;
  const customYear = customDate.getFullYear();

  const authClient = await auth.getClient();

  google.options({auth: authClient});

  const dbm = google.doubleclickbidmanager("v2");
  const dv360 = google.displayvideo("v2");

  if (customDateRange == null) {
    requestBody.metadata.dataRange = {
      range: "CUSTOM_DATES",
      customEndDate: {
        day: customDay,
        month: customMonth,
        year: customYear,
      },
      customStartDate: {
        day: customDay,
        month: customMonth,
        year: customYear,
      },
    };
  } else {
    requestBody.metadata.dataRange = customDateRange;
  }

  const responseCreated = await dbm.queries.create({
    requestBody,
  });

  const respRun = await dbm.queries.run({
    queryId: responseCreated.data.queryId,
    synchronous: true,
  });

  await dbm.queries.delete({
    queryId: responseCreated.data.queryId,
  });

  if (respRun.data.metadata.googleCloudStoragePath == null) return;

  const responseFetch = await axios({
    method: "get",
    url: respRun.data.metadata.googleCloudStoragePath,
    responseType: "blob",
  });

  const respData = responseFetch.data;

  fs.writeFileSync("temp.csv", respData);

  fs.createReadStream("temp.csv")
      .pipe(csv())
      .on("data", async (row) => {
        const date = new Date(row["Date"]);
        if (date == "Invalid Date") return;

        const finalObj = {};

        const totalDimensions = requestBody.params.groupBys.length;
        let counterDimensions = 0;
        let rowId = "";

        for (const [key, value] of Object.entries(row)) {
          if (counterDimensions++ < totalDimensions) rowId += value;
          finalObj[
              key
                  .replace("(", "")
                  .replace(")", "")
                  .replace("-", "")
                  .replace(":", "")
                  .replace(/\s/g, "")
          ] = value;
        }

        finalObj["Date"] = date;

        const hash = crypto.createHash("md5").update(rowId).digest("hex");

        if (includeCreativeData) {
          const respCreative = await dv360.advertisers.creatives.get({
            auth: authClient,
            advertiserId: row["Advertiser ID"],
            creativeId: row["Creative ID"],
          });

          try {
            const assets = respCreative.data.assets.filter(
                (x) => x.role === "ASSET_ROLE_MAIN",
            );

            if (typeof assets !== "undefined" && assets.length > 0) {
              finalObj["CreativeContent"] = assets[0].asset.content;
            }
        } catch (ex) {} // eslint-disable-line
        }

        await firestore.collection(firestoreDestination).doc(hash).set(finalObj);
      })
      .on("end", () => {
        fs.unlinkSync("temp.csv"); // Delete the temporary file
        logger.info("DONE !!");
      });
};

module.exports = loadDV360;
