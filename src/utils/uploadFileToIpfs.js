import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";

const client = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDEzMkRhNjE2N2U0OTY2Y2M2ODBlMjNlNzdjMmM5NjI2YWZFQjkyNzMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjAxOTIxNjI3MDEsIm5hbWUiOiJ0ZXN0In0.nrWyG-RPCty28GQLPOfjCacYoOoURarCyo6nh3t0QCY",
});

export const uploadFileToIpfs = async (file) => {
  const fileName = file[0]?.name;
  console.log("---client-->", client);
  const results = await client.put(file, {});

  return {
    link: `https://ipfs.io/ipfs/${results}/${fileName}`,
    cid: results,
    fileName: fileName,
  };
  // return `https://${results}.ipfs.dweb.link/${fileName}`;
};

export const createAnduploadFileToIpfs = async (metaData) => {
  const blob = new Blob([JSON.stringify(metaData)], {
    type: "application/json",
  });
  const files = [new File([blob], "ipfs.json")];
  const resultsSaveMetaData = await client.put(files, {});
  return resultsSaveMetaData;
  // return `https://${resultsSaveMetaData}.ipfs.dweb.link/ipfs.json`;
};

export const getIpfsUrI = (fingerprint) => {
  return `https://ipfs.io/ipfs/${fingerprint}`;
};
