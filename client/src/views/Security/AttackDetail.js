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
import { useParams } from "react-router-dom";

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
  getAttackDetailCount,
  getAttackDetail
} from "../../actions/security";

const getColumnName = (column) => {
  console.log(column)
  switch (column) {
    case "Received at":
      return "receive_time";
    case "Data":
      return "app_data";
    case "FCnt":
      return "seq";
    case "Device address":
      return "dev_addr";
  }
};  

const headCells = [
  { name: "Received at", content: "Received at" },
  { name: "Data", content: "Data" },
  { name: "FCnt", content: "FCnt" },
  { name: "Device address", content: "Device address" },
];

export const Security = ({ 
  history,
  refresh,
  classes,
  attacks,
  countOfpenTests,
  setRowsPerPage,
  getAttackDetail,
  getAttackDetailCount,
  rowsPerPage,
}) => {
  const localClasses = useStyles();
  let { id } = useParams();

  const [page, setPage] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(0);
  const [order, setOrder] = React.useState("asc");

  React.useEffect(() => {
    if (refresh) {
      getAttackDetailCount({testId: id,});
      getAttackDetail({
        testId: id,
        order,
        rowsPerPage,
        page: 1,
        column: getColumnName(headCells[orderBy]),
      });
      setPage(0);
    }
  }, [
    getAttackDetail,
    getAttackDetailCount,
    order,
    orderBy,
    page,
    refresh,
    rowsPerPage,
  ]);

  React.useEffect(() => {
    getAttackDetailCount({testId: id,});
    getAttackDetail({
      testId: id,
      order,
      rowsPerPage,
      page: 1,
      column: getColumnName(headCells[orderBy]),
    });

    return () => {
      cleanPentests();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cleanPentests, 
    getAttackDetail,
    getAttackDetailCount
  ]);


  const handleOnRowClick = (index) => {
    // history.push(`/security/test/${attacks[index].id}`);
    console.log(attacks);
  };

  const handleOnNewTestClick = (index) => {
    console.log(attacks);
    console.log(rows)
    console.log(attacks.attacks.map((a) => a));
  };


  const rows = attacks?.map((e, i) => {
    return [
      {
        name: "Show more details",
        content: moment(e?.receive_time).format("DD-MM-YYYY HH:mm:ss") || "none",
      },
      {
        name: "Show more details",
        content: e?.app_data || "none",
      },
      {
        name: "Show more details",
        content: e.seq, 
      },
      {
        name: "Show more details",
        content: e.dev_addr || "none",
      },
      
    ];
  }) ?? [];

  return (
    <React.Fragment>
      <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <MyTable
            rows={rows}
            headCells={headCells}
            tableTitle={"Frames"}
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
              getAttackDetail({
                testId: id,
                order,
                rowsPerPage,
                page,
                column: getColumnName(headCells[orderBy]),
              });
            }}
          />
        </Paper>
        </Grid>

        {(attacks[0]?.type === 'Eavesdropping' && !attacks[0]?.status?.includes("FINISH")) ? 
          <Grid container justify="center" xs={12}>
            <Grid item>
              <div style={newStyles.dateInput}>
                <Button className={localClasses.saveButton}
                  variant="contained"
                  color="primary"
                >
                  STOP & EVALUATE
                </Button>
              </div>
            </Grid>
          </Grid>
            : null
        }
        

        <Grid item xs={12}>
          Status: {attacks[0]?.status}
        </Grid>
        <Grid item xs={12}>
          Test name: {attacks[0]?.name + " - " + attacks[0]?.type}
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
  attacks: result.results,
  countOfpenTests:  result.countOfResults,
  rowsPerPage: result.rowsPerPage,
});

const mapDispatchToProps = {
  getAttackDetail,
  getAttackDetailCount,
  setRowsPerPage,
  cleanPentests
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withStyles(globalStyles)(Security)));
