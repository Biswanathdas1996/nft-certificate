export const formatDate = (rawDate) => {
  var unixTimestamp = rawDate;
  var date = new Date(unixTimestamp);

  const txnDate =
    date.getDate() +
    "/" +
    (date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds();
  return txnDate;
};
