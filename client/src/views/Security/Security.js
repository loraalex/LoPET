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
  getPentests
} from "../../actions/security";

const getColumnName = (column) => {
  switch (column) {
    case "Timestamp":
      return "start_at";
    case "Name":
      return "name";
    case "Attacks in test":
      return "description";
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
  rowsPerPage,
}) => {
  const localClasses = useStyles();

  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(0);
  const [order, setOrder] = React.useState("asc");

  React.useEffect(() => {
    if (refresh) {
      //getCountOfApplications();
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
    //getCountOfApplications,
    order,
    orderBy,
    page,
    refresh,
    rowsPerPage,
  ]);

  React.useEffect(() => {
    //getCountOfApplications();
    getPentests({ order: "asc", rowsPerPage, page: 1, column: "id" });

    return () => {
      cleanPentests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cleanPentests, 
    getPentests, 
    //getCountOfApplications
  ]);

  // const handleAddApplication = async () => {
  //   try {
  //     await applicationApi.addApplication();
  //     callRefresh();
  //   } catch (error) {
  //     devConsole.log(error);
  //   }
  // };

  const handleOnRowClick = (index) => {
    history.push(`/security/${penTests[index].id}`);
  };

  const handleOnNewTestClick = (index) => {
    history.push(`/security/new-test`);
  };

  const rows = penTests.map((e, i) => {
    return [
      {
        name: e?.id || "none",
        content: e?.id || "none",
      },
      {
        name: e.hasOwnProperty("created")
          ? moment(e.created).format("DD.MM.YY, HH:mm:ss")
          : "none",
        content: e.hasOwnProperty("created")
          ? moment(e.created).format("DD.MM.YY, HH:mm:ss")
          : "none",
      },
      {
        name: e?.name || "none",
        content: e?.name || "none",
      },
      {
        name: e?.description || "none",
        content: e.hasOwnProperty("description")
          ? truncate(e.description, 40)
          : "none",
      },
      {
        name: e?.num_of_devices || "none",
        content: e?.num_of_devices || "none",
      },
      {
        name: e?.num_of_uplink_messages || "none",
        content: e?.num_of_uplink_messages || "none",
      },
      {
        name: e?.num_of_downlink_messages || "none",
        content: e?.num_of_downlink_messages || "none",
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
            // rightNode={
            //   <Tooltip title="Add application">
            //     <Button
            //       variant="outlined"
            //       className={classes.tableButton}
            //       startIcon={<AddIcon />}
            //       onClick={handleAddApplication}
            //     >
            //       add
            //     </Button>
            //   </Tooltip>
            // }
          />
        </Paper>
      </Grid>
    </Grid>

      <div style={newStyles.dateInput}>
          <button role="button" className="btn" onClick={handleOnNewTestClick} >NEW TEST</button>
      </div>     
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
  getPentests
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(globalStyles)(Security)));
