import SideBar from "./SideBar";
import React, { Component, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import axios from "axios";
import { useCookies } from "react-cookie";
import { TextField } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function Main() {
  const tableIcons = {
    Add: React.forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: React.forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: React.forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: React.forwardRef((props, ref) => (
      <DeleteOutline {...props} ref={ref} />
    )),
    DetailPanel: React.forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    Edit: React.forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: React.forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: React.forwardRef((props, ref) => (
      <FilterList {...props} ref={ref} />
    )),
    FirstPage: React.forwardRef((props, ref) => (
      <FirstPage {...props} ref={ref} />
    )),
    LastPage: React.forwardRef((props, ref) => (
      <LastPage {...props} ref={ref} />
    )),
    NextPage: React.forwardRef((props, ref) => (
      <ChevronRight {...props} ref={ref} />
    )),
    PreviousPage: React.forwardRef((props, ref) => (
      <ChevronLeft {...props} ref={ref} />
    )),
    ResetSearch: React.forwardRef((props, ref) => (
      <Clear {...props} ref={ref} />
    )),
    Search: React.forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: React.forwardRef((props, ref) => (
      <ArrowDownward {...props} ref={ref} />
    )),
    ThirdStateCheck: React.forwardRef((props, ref) => (
      <Remove {...props} ref={ref} />
    )),
    ViewColumn: React.forwardRef((props, ref) => (
      <ViewColumn {...props} ref={ref} />
    )),
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  let [cookies, setCookie] = useCookies(["token"]);

  let [data, setData] = useState();

  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5144/activities", {
        headers: {
          Authorization: "Bearer " + cookies["token"],
        },
        timeout: 10 * 1000,
      })
      .then((response) => {
        setOpenSuccess(true);
        response.data.forEach((data) => {
          data.when = changeDateTimeToThai(data.when);
        });
        setData(response.data);
      })
      .catch((error) => {
        setOpenError(true);
        if (error.code === "ECONNABORTED") {
          console.log("timeout");
        } else {
          console.log(error.response.status);
        }
      });
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenError(false);
    setOpenSuccess(false);
  };

  function changeDateTimeToThai(oldDate) {
    const date = new Date(oldDate);
    const result = date.toLocaleString("th-TH", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return result;
  }

  return (
    <div id="outer-container">
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
        <Snackbar
          open={openError}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            API Error
          </Alert>
        </Snackbar>
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            API Success
          </Alert>
        </Snackbar>
        <div style={{ maxWidth: "100%", marginTop: "100px" }}>
          <MaterialTable
            title="Todo"
            icons={tableIcons}
            columns={[
              { title: "กิจกรรม", field: "name" },
              {
                title: "วันเวลา",
                field: "when",
                editComponent: (props) => (
                  <TextField
                    id="datetime-local"
                    type="datetime-local"
                    defaultValue={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    sx={{ width: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                ),
              },
            ]}
            options={{
              headerStyle: {
                fontFamily: "Kanit",
              },
            }}
            data={data}
            editable={{
              onRowAdd: (newData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .post(
                        "http://localhost:5144/activities",
                        {
                          name: newData.name,
                          when: newData.when,
                        },
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                            timeout: 10 * 1000,
                          },
                        }
                      )
                      .then((response) => {
                        setOpenSuccess(true);
                        newData.id = response.data.id;
                        newData.when = changeDateTimeToThai(newData.when);
                        setData([...data, newData]);
                      })
                      .catch((error) => {
                        setOpenError(true);
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  });
                }, 1000),
              onRowUpdate: (newData, oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .put(
                        "http://localhost:5144/activities/" + oldData.id,
                        {
                          name: newData.name,
                          when: newData.when,
                        },
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                            timeout: 10 * 1000,
                          },
                        }
                      )
                      .then((response) => {
                        setOpenSuccess(true);
                        const dataUpdate = [...data];
                        const index = oldData.tableData.id;
                        dataUpdate[index] = newData;
                        newData.when = changeDateTimeToThai(newData.when);
                        setData([...dataUpdate]);
                      })
                      .catch((error) => {
                        setOpenError(true);
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  });
                }, 1000),
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  setTimeout(() => {
                    axios
                      .delete(
                        "http://localhost:5144/activities/" + oldData.id,
                        {
                          headers: {
                            Authorization: "Bearer " + cookies["token"],
                            timeout: 10 * 1000,
                          },
                        }
                      )
                      .then((response) => {
                        setOpenSuccess(true);
                        const dataDelete = [...data];
                        const index = oldData.tableData.id;
                        dataDelete.splice(index, 1);
                        setData([...dataDelete]);
                      })
                      .catch((error) => {
                        setOpenError(true);
                        if (error.code === "ECONNABORTED") {
                          console.log("timeout");
                        } else {
                          console.log(error.response.status);
                        }
                      });
                    resolve();
                  });
                }, 1000),
            }}
          />
        </div>
      </div>
    </div>
  );
}
