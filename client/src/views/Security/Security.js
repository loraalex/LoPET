import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import clsx from "clsx";
import PDRProgress from "../Dashboard/PDRProgress";
import { globalStyles } from "../../shared/styles";
import { withStyles } from "@material-ui/core/styles";
import TopList from "../Dashboard/TopList";
import MyMap from "../Dashboard/MyMap";
import DashboardMessages from "../Dashboard/DashboardMessages";
import newStyles from "../../shared/newStyles";
import Button from "@material-ui/core/Button";
import MyTable from "../../components/MyTable";

import {
  setRowsPerPage,
  cleanResults as cleanPentests,
} from "../../actions/shared";
// import Tooltip from "@material-ui/core/Tooltip";
// import Button from "@material-ui/core/Button";
// import AddIcon from "@material-ui/icons/Add";
// import applicationApi from "../../api/applicationApi";
// import devConsole from "../../devConsole";

import { truncate } from "../../utils/utils";
import moment from "moment";

import { withRouter } from "react-router-dom";


import {
  getCountOfPentests,
  getPentests
} from "../../actions/security";

const getColumnName = (column) => {
  console.log(column)
  switch (column) {
    case "Timestamp":
      return "test_start_at";
    case "Name":
      return "name";
    case "Attacks in test":
      return "attack.type";
    case "Status":
      return "status";
  }
};  

const headCells = [
  { name: "Timestamp", content: "Timestamp" },
  { name: "Name", content: "Name" },
  { name: "Attacks in test", content: "Attacks in test" },
  { name: "Status", content: "Status" },
];

export const Security = ({ 
  history,
  refresh,
  classes,
  penTests,
  countOfpenTests,
  setRowsPerPage,
  getCountOfPentests,
  getPentests,
  rowsPerPage,
}) => {
  const localClasses = useStyles();

  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(0);
  const [order, setOrder] = React.useState("asc");

  React.useEffect(() => {
    if (refresh) {
      getCountOfPentests();
      getPentests({
        order,
        rowsPerPage,
        page: 1,
        column: getColumnName(headCells[orderBy]),
      });
      setPage(0);
    }
  }, [
    getPentests,
    getCountOfPentests,
    order,
    orderBy,
    page,
    refresh,
    rowsPerPage,
  ]);

  React.useEffect(() => {
    getCountOfPentests();
    getPentests({ order: "asc", rowsPerPage, page: 1, column: "created_at" });

    return () => {
      cleanPentests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cleanPentests, 
    getPentests, 
    getCountOfPentests
  ]);


  const handleOnRowClick = (index) => {
    history.push(`/security/${penTests[index].id}`);
  };

  const handleOnNewTestClick = (index) => {
    history.push(`/security/new-test`);
  };

  const getAttacksInTest = (test) => {
    const arr = test.attacks?.map((a) => a.type);

    return arr[0];
  }

  const getTestStatus = (test) => {
    const scheduledStatus = "SCHEDULED"
    const doneStatus = "DONE";
    const inProgressStatus = "IN PROGRESS"

    let allDone = true;
    let inProgress = false;
    for(const attack of test?.attacks ?? []) {
      if(attack.status !== doneStatus) {
        allDone = false;
      }
      if(attack.status !== scheduledStatus) {
        inProgress = true;
      }
    }

    if(allDone)
      return doneStatus;
    if(inProgress)
      return inProgressStatus;
    
    return scheduledStatus;
  } 

  const rows = penTests.map((e, i) => {
    return [
      {
        name: moment(e?.test_start_at).format("DD-MM-YYYY HH:mm") || "none",
        content: moment(e?.test_start_at).format("DD-MM-YYYY HH:mm") || "none",
      },
      {
        name: e?.name || "none",
        content: e?.name || "none",
      },
      {
        name: e.attacks?.map((a) => a.type).join(', ') || "none",
        content: e.attacks?.map((a) => a.type).join(', ') || "none", //(e.attacks?.map((a) => a.type))[0]
      },
      {
        name: getTestStatus(e) || "none",
        content: getTestStatus(e) || "none",
      },
      
    ];
  });

  return (
    <React.Fragment>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <MyTable
            rows={rows}
            headCells={headCells}
            tableTitle={"History of Tests"}
            onRowClick={handleOnRowClick}
            countOfRows={countOfpenTests}
            showPagination={true}
            rowsPerPageOptions={[5, 10, 25]}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            page={page}
            setPage={setPage}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            order={order}
            setOrder={setOrder}
            fetchRecords={({ order, rowsPerPage, page, column }) => {
              getPentests({
                order,
                rowsPerPage,
                page,
                column: getColumnName(column),
              });
            }}
            
          />
        </Paper>
      </Grid>
    </Grid>

      <Grid container justify="center" xs={12}>
      <Grid item>
      <div style={newStyles.dateInput}>
          <Button className={localClasses.saveButton}
                variant="contained"
                color="primary"
                onClick={handleOnNewTestClick}
              >
                NEW TEST
              </Button>
      </div>    
      </Grid>
      </Grid> 
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  chartPaper: {
    height: "100%",
  },
}));

const mapStateToProps = ({ result }) => ({
  penTests: result.results,
  countOfpenTests:  result.countOfResults,
  rowsPerPage: result.rowsPerPage,
});

const mapDispatchToProps = {
  getPentests,
  getCountOfPentests,
  setRowsPerPage,
  cleanPentests
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(globalStyles)(Security)));
