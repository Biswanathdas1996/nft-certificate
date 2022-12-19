export function generateIpfsLink(cid, fileName) {
  return `https://ipfs.io/ipfs/${cid}/${fileName}`;
  //   return `https://${cid}.ipfs.dweb.link/${fileName}`;
}
