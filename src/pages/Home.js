import React from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import "./Home.css";
import Background from "../assets/bg-with-logo.png";
import Details from "../components/Details";
import Actions from "../components/Actions";
import Owners from "../components/Owners";
import QRCode from "react-qr-code";
import { _fetch } from "../../src/CONTRACT-ABI/connect";
import { useParams } from "react-router-dom";
import TransctionModal from "../components/shared/TransctionModal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { formatDate } from "../utils/dateFormatter";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import CircularProgress from "@mui/material/CircularProgress";
import CardMedia from "@mui/material/CardMedia";
// import proFileImg from "../assets/20220525_161838.jpg";
import imgNotFound from "../assets/default-placeholder.png";
import { generateIpfsLink } from "../utils/generateIpfsLink";

export default function HomePage() {
  const [value, setValue] = React.useState("1");
  const [nftData, setNftData] = React.useState(null);
  const [start, setStart] = React.useState(false);
  const [price, setPrice] = React.useState(null);
  const [response, setResponse] = React.useState(null);
  const [owner, setOwner] = React.useState(null);
  const [ipfs, setIpfs] = React.useState(null);
  // const tokenId = 2;
  const { tokenId } = useParams();
  let pattern = /[+*\n]|^\d+/g;
  const printDocument = () => {
    const input = document.getElementById("divToPrint");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [13, 16.5],
      });
      pdf.addImage(imgData, "JPEG", 0, 0);
      // pdf.output('dataurlnewwindow');
      pdf.save(`Token ${tokenId} - Ownership document.pdf`);
    });
  };

  React.useEffect(() => {
    fetchNftInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchNftInfo() {
    setStart(true);
    try {
      const getAllTokenUri = await _fetch("tokenURI", tokenId);
      const price = await _fetch("getNftPrice", tokenId);
      setPrice(price);
      const getOwner = await _fetch("ownerOf", tokenId);
      setOwner(getOwner);
      setIpfs(getAllTokenUri);
      console.log("---getAllTokenUri--->", getAllTokenUri);
      await fetch(generateIpfsLink(getAllTokenUri, "ipfs.json"))
        // await fetch(getAllTokenUri)
        .then((response) => response.json())
        .then((data) => {
          setNftData(data);
          console.log(data);
        });
    } catch (err) {
      console.error("Unable to fetch data from IPFS", err);
    }
    setStart(false);
  }

  return (
    <div>
      {start ? (
        <div
          style={{
            display: "inline-block",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: 200,
            height: 100,
            margin: "auto",
          }}
        >
          <center>
            {" "}
            <CircularProgress style={{ marginTop: 30 }} />
            <br />
            <p style={{ color: "white", fontSize: 20 }}>
              Fetching data from Blockchain...
            </p>
          </center>
        </div>
      ) : (
        <Grid container>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            // style={{ height: "80vh" }}
          >
            {/* <div className="lhs1"></div> */}
            <div
              className="lhs2"
              id="divToPrint"
              style={
                {
                  // backgroundImage: `url(${nftData?.image})`,
                }
              }
            >
              <h2
                className="Headding"
                style={{ marginTop: "0px", fontSize: 17, marginBottom: 20 }}
              >
                <b>{nftData?.category}</b>
              </h2>

              <div style={{ display: "flex" }}>
                {/* <div
                  className="lhs2"
                  style={{
                    backgroundImage: `url(${
                      proFileImg || nftData?.profile_image
                    })`,
                    borderRadius: 10,
                  }}
                >
                  <br />
                  <br />
                </div> */}
                <img
                  src={nftData?.profile_image}
                  alt="NFT img"
                  height="150"
                  onError={(e) => {
                    e.currentTarget.src = imgNotFound;
                  }}
                  style={{ borderRadius: 5, marginLeft: "4rem" }}
                />
                {/* <CardMedia
                  component="img"
                  height="150"
                  image={proFileImg}
                  alt="green iguana"
                  style={{ borderRadius: 5, marginLeft: "4rem" }}
                /> */}
                <div>
                  <h2 className="Headding" style={{ fontSize: 13 }}>
                    <b>{nftData?.name}</b>
                  </h2>
                  <h6 className="Headding">
                    {nftData?.Description?.replace(/�/g, " ")}
                  </h6>
                </div>
              </div>

              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <h4 className="Headding">
                    From : <b>{nftData?.Provider}</b>
                  </h4>
                  <h6 className="Headding">
                    Date : {formatDate(nftData?.minted_on)}
                  </h6>
                  <small className="Headding" style={{ fontSize: 8 }}>
                    Nft was minted on {formatDate(nftData?.minted_on)} on ETH
                    network
                  </small>
                </Grid>
                <Grid item xs={12} sm={12} md={3} lg={3}>
                  {" "}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  display={{ xs: "none", lg: "block", md: "block" }}
                >
                  <br />
                  <QRCode
                    value={window.location.href}
                    size="70"
                    style={{
                      float: "left",
                      marginTop: 0,
                      marginBottom: 0,
                      // marginLeft: 25,
                    }}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  display={{ xs: "block", lg: "none", md: "none" }}
                >
                  <br />
                  <QRCode
                    value={window.location.href}
                    size="35"
                    style={{
                      float: "left",
                      marginLeft: "2.5rem",
                      marginBottom: 11,
                    }}
                  />
                </Grid>
              </Grid>
            </div>

            <div className="lhs1">
              <Grid visible="md">
                <Button
                  variant="contained"
                  color="warning"
                  style={{ margin: 10 }}
                  onClick={() => printDocument()}
                >
                  <CloudDownloadIcon
                    color="default"
                    sx={{ fontSize: 40, marginRight: 1 }}
                  />
                  Download
                </Button>
              </Grid>
            </div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            className="rightHandSide"
            // style={{ height: "99vh" }}
          >
            {/* <Grid container>
            <Grid item xs={3}>
              <div
                onClick={() => handleChange(1)}
                className={value == 1 ? "selectTapSelected" : "selectTap"}
                style={{ marginLeft: "30px" }}
              >
                Details
              </div>
            </Grid>
            <Grid item xs={3}>
              <div
                onClick={() => handleChange(2)}
                className={value === 2 ? "selectTapSelected" : "selectTap"}
              >
                Actions
              </div>
            </Grid>
            <Grid item xs={3}>
              <div
                onClick={() => handleChange(3)}
                className={value === 3 ? "selectTapSelected" : "selectTap"}
              >
                Owners
              </div>
            </Grid>
          </Grid> */}
            {/* {value == 1 ? <Details /> : value == 2 ? <Actions /> : <Owners />} */}
            <Details
              nftData={nftData}
              tokenId={tokenId}
              owner={owner}
              ipfs={ipfs}
            />
          </Grid>
        </Grid>
      )}
    </div>
  );
}
