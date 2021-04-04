import React from "react";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import globalStyles from "../shared/styles";
import Paper from "@material-ui/core/Paper";
import PDRProgress from "../components/PDRProgress";
import MyChart from "../components/MyChart";

export const AllMessages = () => {
  const classes = useStyles();
  const global = globalStyles();

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={global.paper} style={{ height: "100%" }}>
            <MyChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={global.paper}>
            <PDRProgress value={100} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={global.paper} />
        </Grid>

        <Grid item xs={12}>
          <Paper className={global.paper} />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({}));

export default AllMessages;
