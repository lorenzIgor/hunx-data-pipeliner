const Firestore = require("@google-cloud/firestore");

const firestore = async (params) => {
  const firestoreDB = new Firestore({
    projectId: params.projectId,
    credentials: params.credentials,
  });

  const promisesArray = params.json.data.map(
      async (row) => await asyncCall(row, firestoreDB, params),
  );

  await Promise.all(promisesArray);

  return params.json;
};

const asyncCall = (row, firestoreDB, params) => {
  let firestoreResponse = null;

  if (params.documentId != null) {
    firestoreResponse = firestoreDB
        .collection(params.destination)
        .doc(row[params.documentId])
        .set(row);
  } else {
    firestoreResponse = firestoreDB
        .collection(params.destination)
        .doc()
        .set(row);
  }

  return firestoreResponse;
};

module.exports = firestore;
