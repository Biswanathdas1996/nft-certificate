import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { Card, Grid } from "@mui/material";
import { _transction_signed } from "../../src/CONTRACT-ABI/connect";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import { pink } from "@mui/material/colors";
import TransctionModal from "../components/shared/TransctionModal";
import {
  uploadFileToIpfs,
  createAnduploadFileToIpfs,
} from "../utils/uploadFileToIpfs";
import swal from "sweetalert";
import Papa from "papaparse";
import CsvSample from "../assets/Sample.csv";
import { CSVLink } from "react-csv";

const allowedExtensions = ["csv"];

const web3 = new Web3(window.ethereum);

const Mint = () => {
  const [start, setStart] = useState(false);
  const [response, setResponse] = useState(null);
  const [file, setFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [description, setDescription] = useState(null);
  const [data, setData] = useState([]);
  const [outputCsv, setOutputCsv] = useState([]);

  const handleCsvFileChange = (e) => {
    if (e.target.files.length) {
      const inputFile = e.target.files[0];
      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        return;
      }
      handleParse(inputFile);
    }
  };

  const handleParse = (inputFile) => {
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, { header: true });
      const parsedData = csv?.data;

      let filterData = parsedData.filter((data) => data?.Name);
      console.log("---parsedData--->", filterData);
      setData(filterData);
    };
    reader.readAsText(inputFile);
  };

  let history = useNavigate();

  const addDataToBlockchain = async ({ event, category, attributes }) => {
    setStart(true);

    // let results;
    let outputCsvData = [];
    try {
      for (let i = 0; i < data.length; i++) {
        const response = await saveData(data[i], event, category, attributes);
        console.log("---response-->", response);
        const currentTokenId =
          response?.events?.Transfer?.returnValues?.tokenId;
        const outputData = {
          ...data[i],
          token: currentTokenId,
          link: `http://20.40.49.126:8080/#/TCUKOL/21-10-2022/${currentTokenId}`,
        };

        outputCsvData.push(outputData);
        console.log("Called instance:", i + 1);
      }
      setOutputCsv(outputCsvData);
      setStart(false);
      console.log("outputCsvData---------->", outputCsvData);
    } catch (err) {
      swal({
        title: "Server issue!",
        text: "Upload image To Ipfs Failed, please try again",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          console.error("upload File To Ipfs Failed", err);
          setStart(false);
          return;
        }
      });
    }
  };

  const saveData = async (val, event, category, attributes) => {
    let responseData;

    const metaData = {
      name: val?.Name,
      profile_image: val?.image,
      event: event,
      EmpNO: val?.EmpNO,
      Description: val?.Description,
      Provider: val?.Provider,
      author: "PwC India",
      category: category,
      description: description,
      attributes: attributes,
      minted_on: new Date(),
    };
    let resultsSaveMetaData;

    try {
      resultsSaveMetaData = await createAnduploadFileToIpfs(metaData);
    } catch (err) {
      // alert("upload File To Ipfs Failed, please try again");
      console.error("upload File To Ipfs Failed", err);
      setStart(false);
      return;
    }

    try {
      responseData = await _transction_signed(
        "mintNFT",
        resultsSaveMetaData,
        web3.utils.toWei("0".toString(), "ether"),
        "0",
        category
      );
    } catch (err) {
      console.error(err, "Some error");
    }

    return responseData;
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const modalClose = () => {
    setStart(false);
    setResponse(null);
    history("/");
  };

  const headers = [
    { label: "Name", key: "Name" },
    { label: "Emp NO", key: "EmpNO" },
    { label: "Provider", key: "Provider" },
    { label: "Description", key: "Description" },
    { label: "Token ID", key: "token" },
    { label: "Link", key: "link" },
  ];

  return (
    <>
      {start && <TransctionModal response={response} modalClose={modalClose} />}

      <div className="form-layer2">
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
          <Grid item lg={6} md={6} sm={12} xs={12}>
            <div style={{ margin: 20 }}>
              <Card
                style={{
                  background: "rgb(255 255 255)",
                }}
              >
                <Grid container>
                  {outputCsv?.length > 0 ? (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        style={{
                          border: "1px solid",
                          margin: 25,
                          padding: 25,
                        }}
                      >
                        <center>
                          <h4>Tokens are ready, please download it</h4>
                          <CSVLink data={outputCsv} headers={headers}>
                            <Button
                              variant="contained"
                              size="medium"
                              type="button"
                              style={{
                                marginTop: 10,
                                textDecoration: "none",
                              }}
                            >
                              Download CSV
                            </Button>
                          </CSVLink>
                          <Button
                            variant="outlined"
                            size="medium"
                            type="button"
                            style={{
                              marginTop: 10,
                              marginLeft: 10,
                              textDecoration: "none",
                              color: "red",
                            }}
                            onClick={() => setOutputCsv([])}
                          >
                            Close
                          </Button>
                        </center>
                      </div>
                    </Grid>
                  ) : (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <div
                        style={{
                          padding: "20px",
                        }}
                      >
                        <h4>Create NFT</h4>
                        <Formik
                          initialValues={{
                            event: "",
                            text: "",
                            category: "",
                            attributes: [],
                          }}
                          onSubmit={(values, { setSubmitting }) => {
                            console.log("values=======>", values);
                            addDataToBlockchain(values);
                            setSubmitting(false);
                          }}
                        >
                          {({ touched, errors, isSubmitting, values }) => (
                            <Form>
                              <Grid container>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div className="form-group">
                                    <label for="title" className="my-2">
                                      Event Name{" "}
                                      <span className="text-danger">*</span>{" "}
                                      <br />
                                    </label>

                                    <input
                                      className={`form-control text-muted`}
                                      id="csvInput"
                                      name="event"
                                      type="text"
                                      style={{
                                        padding: 15,
                                        margin: 10,
                                        borderRadius: 5,
                                        border: "1px solid #80808091",
                                      }}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div className="form-group">
                                    <label for="title" className="my-2">
                                      Choose Csv file{" "}
                                      <span className="text-danger">*</span>{" "}
                                      <a href={CsvSample} download>
                                        Download Sample CSV
                                      </a>
                                      <br />
                                    </label>

                                    <input
                                      className={`form-control text-muted`}
                                      onChange={handleCsvFileChange}
                                      id="csvInput"
                                      name="file"
                                      type="file"
                                      style={{
                                        padding: 15,
                                        margin: 10,
                                        borderRadius: 5,
                                        border: "1px solid #80808091",
                                      }}
                                    />
                                  </div>
                                </Grid>

                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                  <div className="form-group">
                                    <label for="title" className="my-2">
                                      Choose category{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <Field
                                      name="category"
                                      component="select"
                                      className={`form-control text-muted ${
                                        touched.category && errors.category
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      style={{
                                        padding: 15,
                                        margin: 10,
                                        borderRadius: 5,
                                        border: "1px solid #80808091",
                                      }}
                                    >
                                      <option value="">
                                        -- Please select --
                                      </option>
                                      <option value="Above and Beyond Individual Award">
                                        Above and Beyond Individual Award
                                      </option>
                                      <option value="Dazling Debut">
                                        Dazling Debut
                                      </option>
                                    </Field>
                                  </div>
                                </Grid>
                                {/* <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div className="form-group">
                                    <label for="title" className="my-2">
                                      Choose file{" "}
                                      <span className="text-danger">*</span>
                                      <br />
                                    </label>

                                    <input
                                      className={`form-control text-muted`}
                                      type="file"
                                      id="certificateImg"
                                      onChange={onFileChange}
                                      style={{
                                        padding: 15,
                                        margin: 10,
                                        borderRadius: 5,
                                        border: "1px solid #80808091",
                                      }}
                                    />
                                  </div>
                                  {selectedFile && (
                                    <center>
                                      <img
                                        src={preview}
                                        alt="img"
                                        style={{
                                          marginTop: 20,
                                          height: 300,
                                          width: "auto",
                                        }}
                                      />
                                    </center>
                                  )}
                                </Grid> */}
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <label for="title" className="my-2">
                                      Description{" "}
                                      <span className="text-danger">*</span>
                                    </label>
                                    <TextareaAutosize
                                      aria-label="minimum height"
                                      minRows={3}
                                      name="text"
                                      onChange={(e) =>
                                        setDescription(e.target.value)
                                      }
                                      placeholder="Minimum 3 rows"
                                      style={{
                                        padding: 15,
                                        margin: 10,
                                        borderRadius: 5,
                                        border: "1px solid #80808091",
                                        width: "100%",
                                      }}
                                      className={`form-control text-muted ${
                                        touched.text && errors.text
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                    />
                                  </div>
                                </Grid>

                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{ marginLeft: 10, marginTop: 10 }}
                                  >
                                    <FieldArray
                                      name="attributes"
                                      render={(arrayHelpers) => (
                                        <div>
                                          {values.attributes &&
                                          values.attributes.length > 0 ? (
                                            values.attributes.map(
                                              (attribut, index) => (
                                                <div
                                                  style={{
                                                    border: "1px solid #c7c9cc",
                                                    borderRadius: 5,
                                                    padding: 12,
                                                    marginTop: 15,
                                                  }}
                                                  key={index}
                                                >
                                                  <DeleteOutlineIcon
                                                    onClick={() =>
                                                      arrayHelpers.remove(index)
                                                    }
                                                    sx={{ color: pink[500] }}
                                                    style={{
                                                      marginBottom: 10,
                                                      float: "right",
                                                      cursor: "pointer",
                                                    }}
                                                  />
                                                  <Grid container>
                                                    <Grid
                                                      item
                                                      lg={5}
                                                      md={5}
                                                      sm={12}
                                                      xs={12}
                                                      style={{
                                                        marginRight: 20,
                                                      }}
                                                    >
                                                      <Field
                                                        name={`attributes.${index}.trait_type`}
                                                        autoComplete="flase"
                                                        placeholder="Enter Properties name"
                                                        className={`form-control text-muted `}
                                                        style={{
                                                          marginTop: 10,
                                                          padding: 9,
                                                        }}
                                                      />
                                                    </Grid>
                                                    <Grid
                                                      item
                                                      lg={6}
                                                      md={6}
                                                      sm={12}
                                                      xs={12}
                                                    >
                                                      <Field
                                                        name={`attributes.${index}.value`}
                                                        autoComplete="flase"
                                                        placeholder="Enter value"
                                                        className={`form-control text-muted`}
                                                        style={{
                                                          marginTop: 10,
                                                          padding: 9,
                                                        }}
                                                      />
                                                    </Grid>
                                                  </Grid>
                                                </div>
                                              )
                                            )
                                          ) : (
                                            <Button
                                              variant="outlined"
                                              size="medium"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.push("")
                                              }
                                            >
                                              {/* show this when user has removed all attributes from the list */}
                                              Add attributes
                                            </Button>
                                          )}
                                          {values.attributes.length !== 0 && (
                                            <Button
                                              variant="outlined"
                                              size="medium"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.insert(
                                                  values.attributes.length + 1,
                                                  ""
                                                )
                                              }
                                              style={{
                                                marginTop: 10,
                                              }}
                                            >
                                              + Add
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    />
                                  </div>
                                </Grid>
                                <Grid item lg={12} md={12} sm={12} xs={12}>
                                  <div
                                    className="form-group"
                                    style={{
                                      marginLeft: 10,
                                      marginTop: 10,
                                      float: "right",
                                    }}
                                  >
                                    <span className="input-group-btn">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        sx={{
                                          marginX: "15px",
                                          marginBottom: "15px",
                                        }}
                                        type="submit"
                                        value={"Submit"}
                                        style={{
                                          fontSize: 16,
                                          padding: "10px 24px",
                                          borderRadius: 12,
                                        }}
                                      >
                                        Create
                                      </Button>
                                    </span>
                                  </div>
                                </Grid>
                              </Grid>
                            </Form>
                          )}
                        </Formik>
                      </div>
                    </Grid>
                  )}
                </Grid>
              </Card>
            </div>
          </Grid>
          <Grid item lg={3} md={3} sm={12} xs={12}></Grid>
        </Grid>
      </div>
    </>
  );
};
export default Mint;
