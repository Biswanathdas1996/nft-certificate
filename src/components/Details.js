import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Address from "../CONTRACT-ABI/Address.json";
import History from "./shared/History";
import { formatDate } from "../utils/dateFormatter";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ShareIcon from "@mui/icons-material/Share";
import { LinkedinShareButton, LinkedinIcon } from "react-share";
import { generateIpfsLink } from "../utils/generateIpfsLink";
import "./Details.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

function Details({ nftData, tokenId, owner, ipfs }) {
  const [detailsExpand, setDetailsExpand] = React.useState(true);
  const [propertiesExpand, setPropertiesExpand] = React.useState(false);
  const [historyExpand, setHistoryExpand] = React.useState(false);

  const handleDetailsExpand = () => {
    setDetailsExpand(!detailsExpand);
    setPropertiesExpand(false);
    setHistoryExpand(false);
  };

  const handlePropertiesExpand = () => {
    setDetailsExpand(false);
    setPropertiesExpand(!propertiesExpand);
    setHistoryExpand(false);
  };

  const handleHistoryExpand = () => {
    setDetailsExpand(false);
    setPropertiesExpand(false);
    setHistoryExpand(!historyExpand);
  };

  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <br />
        <div className="bottomCardsHolderDetails">
          <Card>
            <CardHeader
              avatar={<ListAltIcon color="warning" sx={{ fontSize: 40 }} />}
              onClick={handleDetailsExpand}
              action={
                <ExpandMore
                  expand={detailsExpand}
                  aria-expanded={detailsExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
              title="Details"
            />
            <Collapse in={detailsExpand} timeout="auto" unmountOnExit>
              <CardContent>
                <div
                  style={{
                    fontFamily: `"Georgia"`,
                    fontSize: "20px",
                    display: "flex",
                  }}
                >
                  <PersonIcon
                    className="iconUi"
                    sx={{ fontSize: 30, marginRight: 2 }}
                  />{" "}
                  <b>{nftData?.name}</b>
                  <br />
                </div>
                <div
                  style={{
                    fontFamily: `"Georgia"`,
                    fontSize: "14px",
                    marginTop: 20,
                  }}
                >
                  {nftData?.Description?.replace(/�/g, " ")}
                </div>
                <div
                  style={{
                    fontFamily: `"Georgia"`,
                    fontSize: "15px",
                    display: "flex",
                    marginTop: 20,
                  }}
                >
                  <BadgeIcon
                    className="iconUiemp"
                    sx={{ fontSize: 25, marginRight: 1 }}
                  />{" "}
                  <b style={{ fontWeight: 500 }}>Emp no: {nftData?.EmpNO}</b>
                  <br />
                </div>
                <div
                  style={{
                    fontFamily: `"Georgia"`,
                    fontSize: "15px",
                    display: "flex",
                    float: "right",
                    marginTop: 20,
                  }}
                >
                  {/* <Button
                    // variant="contained"
                    size="small"
                    startIcon={<LinkedInIcon style={{ fontSize: 25 }} />}
                    onClick={(e) =>
                      window
                        .open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
                          "_blank"
                        )
                        .focus()
                    }
                  >
                    Share
                  </Button> */}
                  <LinkedinShareButton url={window.location.href}>
                    <ShareIcon style={{ fontSize: 25, marginRight: 5 }} />{" "}
                    <LinkedinIcon size={32} round={true} />
                  </LinkedinShareButton>

                  <br />
                </div>
                {/* EmpNO */}
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </Grid>

      <Grid item xs={12} sm={12} md={12} lg={12}>
        <div className="bottomCardsHolderDetails">
          <Card>
            <CardHeader
              avatar={
                <SettingsSuggestIcon color="warning" sx={{ fontSize: 40 }} />
              }
              onClick={handlePropertiesExpand}
              action={
                <ExpandMore
                  expand={propertiesExpand}
                  aria-expanded={propertiesExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
              title="Properties"
            />

            <Collapse in={propertiesExpand} timeout="auto" unmountOnExit>
              <CardContent>
                <Grid container>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <table>
                      <tr>
                        <td>Editions </td>
                        <td>: 1</td>
                      </tr>
                      {/* <tr>
                        <td>Royalties </td>
                        <td>: 0%</td>
                      </tr> */}
                      <tr>
                        <td>Minted </td>
                        <td>: {formatDate(nftData?.minted_on)}</td>
                      </tr>
                      <tr>
                        <td>Contract </td>
                        <td
                          style={{ display: "flex", cursor: "pointer" }}
                          onClick={() =>
                            window.open(
                              `https://goerli.etherscan.io/token/${Address}`,
                              "_blank"
                            )
                          }
                        >
                          <Typography
                            variant="h5"
                            item
                            fontWeight="600"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "7rem",
                            }}
                            style={{ fontSize: 12 }}
                          >
                            <b>:&nbsp;{Address} </b>
                          </Typography>
                          <OpenInNewIcon
                            color="warning"
                            sx={{ fontSize: 15 }}
                          />
                        </td>
                      </tr>
                    </table>
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <table>
                      <tr>
                        <td>Owner</td>
                        <td>
                          <Typography
                            variant="h5"
                            item
                            fontWeight="300"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "8rem",
                            }}
                            style={{ fontSize: 12 }}
                          >
                            :&nbsp;{owner}
                          </Typography>
                        </td>
                      </tr>
                      <tr>
                        <td>MIME type </td>
                        <td>: image/png </td>
                      </tr>

                      <tr>
                        <td>Token ID </td>
                        <td>
                          :{" "}
                          <b
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              window.open(
                                `https://goerli.etherscan.io/token/0x8eD667F49CA12369267B395B24BeDa05fb1135cf?a=${tokenId}`,
                                "_blank"
                              )
                            }
                          >
                            {tokenId}{" "}
                            <OpenInNewIcon
                              color="warning"
                              sx={{ fontSize: 15 }}
                            />
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td>Metadata </td>
                        <td>
                          :{" "}
                          <b
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              window.open(
                                generateIpfsLink(ipfs, "ipfs.json"),
                                "_blank"
                              )
                            }
                          >
                            IPFS{" "}
                            <OpenInNewIcon
                              color="warning"
                              sx={{ fontSize: 15 }}
                            />
                          </b>
                        </td>
                      </tr>
                    </table>
                  </Grid>
                </Grid>
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </Grid>

      {/* <Grid item xs={12} sm={12} md={12} lg={12} style={{ marginBottom: 30 }}>
        <div className="bottomCardsHolderDetails">
          <Card>
            <CardHeader
              avatar={
                <ManageHistoryIcon color="warning" sx={{ fontSize: 40 }} />
              }
              onClick={handleHistoryExpand}
              action={
                <ExpandMore
                  expand={historyExpand}
                  aria-expanded={historyExpand}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </ExpandMore>
              }
              title="History"
            />
            <Collapse in={historyExpand} timeout="auto" unmountOnExit>
              <CardContent>
                <History tokenId={tokenId} />
              </CardContent>
            </Collapse>
          </Card>
        </div>
      </Grid> */}
    </Grid>
  );
}

export default Details;
