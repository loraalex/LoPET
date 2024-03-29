import React from "react";
import Grid from "@material-ui/core/Grid";
import { globalStyles } from "../../shared/styles";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import PDRProgress from "./PDRProgress";
import MessagesTable from "./MessagesTable";
import MessagesChart from "../../components/MessagesChart";

export const AllMessages = ({ refresh, classes }) => {
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper} style={{ height: 340 }}>
            <MessagesChart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper}>
            <PDRProgress refresh={refresh} />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <MessagesTable />
          </Paper>
        </Grid>

        {/*<Grid item xs={12}>
          <Paper className={classes.paper}>
            <UplinkMessages refresh={refresh} />
          </Paper>
  </Grid>*/}
      </Grid>
    </React.Fragment>
  );
};

export default withStyles(globalStyles)(AllMessages);
