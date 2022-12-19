import React, { useState, useEffect } from "react";
import { TabPanel } from "@mui/lab";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Stack,
  Typography,
} from "@mui/material";
import Address from "../../CONTRACT-ABI/Address.json";
import CustomButton from "./CustomButton";
// import CustomTransactionStat from "./CustomTransactionStat";

export async function frtchAccounttransction() {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  return fetch(
    `https://api-goerli.etherscan.io/api/?module=account&action=tokennfttx&contractaddress=${Address}&page=1&offset=10000&sort=asc&apikey=WCVDU52748WW4F7EKDEDB89HKH41BIA4N2`,
    requestOptions
  );
}

const columns = [
  { id: "from", label: "FROM", minWidth: 170 },
  { id: "to", label: "TO", minWidth: 100 },

  {
    id: "type",
    label: "TYPE",
    minWidth: 170,
    align: "center",
  },
];

const MyTransaction = ({ tokenId }) => {
  const [transctions, settransctions] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await frtchAccounttransction()
      .then((response) => response.json())
      .then((result) => {
        console.log("--------->", result);
        settransctions(result.result);
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <Card>
      <Table
        stickyHeader
        aria-label="sticky table"
        sx={{ border: "1px solid #EDEDED" }}
      >
        <TableHead sx={{}}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ fontWeight: "bold", backgroundColor: "#F1F7FD" }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {transctions?.map((data, i) => {
            var unixTimestamp = data?.timeStamp;
            var date = new Date(unixTimestamp * 1000);

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

            if (data?.tokenID.toString() === tokenId.toString()) {
              return (
                <TableRow
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": {
                      marginBottom: 10,
                    },
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    <Stack
                      direction="column"
                      sx={{
                        alignItems: "flex-start",
                        justifyContent: "start",
                        display: "flex",
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "5rem",
                          color: "#0578EC",
                        }}
                      >
                        {data?.from}
                      </Typography>

                      <Typography sx={{ fontSize: "11px" }}>
                        {txnDate}
                      </Typography>
                    </Stack>
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          fontSize: "14px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          width: "5rem",
                          color: "#0578EC",
                        }}
                      >
                        {data?.to}
                      </Typography>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center">
                    <b>
                      {data?.from ===
                      "0x0000000000000000000000000000000000000000"
                        ? `Mint`
                        : `Transfer`}
                    </b>
                  </TableCell>
                </TableRow>
              );
            } else {
              return null;
            }
          })}
        </TableBody>
      </Table>
    </Card>
  );
};

export default MyTransaction;
