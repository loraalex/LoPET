import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import MyBreadcrumbs from "../../components/MyBreadCrumps";
import Typography from "@material-ui/core/Typography";
import { Link as RouterLink } from "react-router-dom";
import { globalStyles } from "../../shared/styles";
import { withStyles } from "@material-ui/core";
import SettingsIcon from "@material-ui/icons/Settings";

import NotFound from "../NotFound";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import devConsole from "../../devConsole";


import Security from "./Security";
import NewPentest from "./NewPentest";
import PentestDetail from "./PentestDetail";

function SecurityWrapper({ refresh, selected, classes, callRefresh }) {
  let { path } = useRouteMatch();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    devConsole.log("CLosed without save");
    setOpen(false);
  };

  const handleConfirmClose = () => {
    callRefresh();
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Switch>
        <Route exact path={path}>
          <MyBreadcrumbs>
            <Typography color="textPrimary">Security</Typography>
          </MyBreadcrumbs>
          <Security refresh={refresh} callRefresh={callRefresh} />
        </Route>

        <Route exact path={`${path}/new-test`}>
          <React.Fragment>
            <MyBreadcrumbs>
              <RouterLink
                className={classes.breadCrumpsLink}
                color="textPrimary"
                to={"/security"}
              >
                Security
              </RouterLink>
              <Typography color="textPrimary">New test</Typography>
            </MyBreadcrumbs>
            <NewPentest/>
            {/* <ApplicationDetail
              openSettings={open}
              handleSettingsClose={handleClose}
              handleConfirmClose={handleConfirmClose}
              refresh={refresh}
            /> */}
          </React.Fragment>
        </Route>






        <Route exact path={`${path}/:id`}>
          <React.Fragment>
            <MyBreadcrumbs>
              <RouterLink
                className={classes.breadCrumpsLink}
                color="textPrimary"
                to={"/applications"}
              >
                Applications
              </RouterLink>
              {selected.data === undefined ? null : (
                <Button
                  size="small"
                  className={classes.breadCrumpsButton}
                  endIcon={selected.data === null ? null : <SettingsIcon />}
                  onClick={handleClickOpen}
                  disabled={selected.data === null}
                >
                  {selected.data?.name && selected?.type === "application"
                    ? selected.data?.name
                    : "loading"}
                </Button>
              )}
            </MyBreadcrumbs>
            <PentestDetail />
            {/* <ApplicationDetail
              openSettings={open}
              handleSettingsClose={handleClose}
              handleConfirmClose={handleConfirmClose}
              refresh={refresh}
            /> */}
          </React.Fragment>
        </Route>

        


        


        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

const mapStateToProps = ({ result }) => ({
  selected: result.selected,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(globalStyles)(SecurityWrapper));
