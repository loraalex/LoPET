import React from "react";
import { useParams } from "react-router-dom";
import { connect } from "react-redux";
import { getGatewayDetail } from "../../actions/gateway";
import { resetSelectedResult } from "../../actions/shared";
import NoRecourse from "../NoResource";
import Button from "@material-ui/core/Button";
import Loading from "../Loading";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { globalStyles } from "../../shared/styles";
import { withStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import DetailList from "./DetailList";
import Title from "../../components/Title";
import GetAppIcon from "@material-ui/icons/GetApp";
import PRDList from "./PDRList";
import Upload from "./Upload";
import UplinkMessages from "./UplinkMessages";
import SentDownlinkMessages from "./SentDownlinkMessages";
import ScheduledDownlinkMessages from "./ScheduledDownlinkMessages";
import GatewaySettingsModal from "./GatewaySettingsModal";
import MyMap from "./MyMap";
import gatewayApi from "../../api/gatewayApi";
import devConsole from "../../devConsole";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core/styles";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Tooltip from "@material-ui/core/Tooltip";
import MessagesTable from "./MessagesTable";


const GatewayDetail = ({
  refresh,
  resetSelectedResult,
  getGatewayDetail,
  selected,
  handleSettingsClose,
  openSettings,
  classes,
  handleConfirmClose,
}) => {
  let { id } = useParams();

  const downloadButton = React.useRef(null);
  const [downloadLoading, setDownloadLoading] = React.useState(false);

  const localClasses = useStyles();

  React.useEffect(() => {
    getGatewayDetail({ id });
    return () => {
      resetSelectedResult();
    };
  }, [getGatewayDetail, id, resetSelectedResult]);

  React.useEffect(() => {
    if (refresh) {
      getGatewayDetail({ id });
    }
  }, [getGatewayDetail, id, resetSelectedResult, refresh]);

  if (selected.data === undefined) {
    return <NoRecourse recourse={id} />;
  }

  if (selected.data === null || selected.type !== "gateways") {
    return <Loading />;
  }

  const download = async (event) => {
    event.preventDefault();

    let data;
    try {
      setDownloadLoading(true);
      const res = await gatewayApi.downloadSetap({
        gatewayId: selected.data.id,
      });

      data = res?.data[0]?.setap || undefined;
    } catch (error) {
      setDownloadLoading(false);
      return devConsole.log("error");
    }

    if (data === undefined) {
      setDownloadLoading(false);
      return devConsole.log("error");
    }

    const output = JSON.stringify(data, null, 4);
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);

    setDownloadLoading(false);

    downloadButton.current.href = fileDownloadUrl;
    downloadButton.current.click();
    URL.revokeObjectURL(fileDownloadUrl);
  };

  return (
    <React.Fragment>
      {openSettings ? (
        <GatewaySettingsModal
          open={openSettings}
          handleClose={handleSettingsClose}
          gateway={selected.data}
          handleConfirmClose={handleConfirmClose}
        />
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper className={clsx(classes.paper)}>
            <DetailList gateway={selected.data} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
              <Paper className={clsx(classes.paper)}>
                <Title>Download configuration</Title>

                <a
                  className="hidden"
                  style={{ display: "none" }}
                  download={`apConf-${selected.data.id}.json`}
                  href={"/"}
                  ref={downloadButton}
                >
                  download it
                </a>
                <div className={localClasses.wrapper}>
                  <Button
                    variant="contained"
                    style={{ width: "100%" }}
                    color="default"
                    startIcon={<GetAppIcon />}
                    onClick={download}
                    disabled={downloadLoading}
                  >
                    Download
                  </Button>
                  {downloadLoading && (
                    <CircularProgress
                      size={24}
                      className={localClasses.buttonProgress}
                    />
                  )}
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper className={clsx(classes.paper)}>
                <Title>Upload configuration</Title>
                <Upload gatewayId={selected.data.id} refresh={refresh} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={12}>
              <Paper className={clsx(classes.paper)}>
                <Title
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Channels PDR
                  <Tooltip title="Median of last 100 messages" arrow>
                    <HelpOutlineOutlinedIcon style={{ marginLeft: 5 }} />
                  </Tooltip>
                </Title>
                <PRDList refresh={refresh} gatewayId={selected.data.id} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Map */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <MyMap gateway={selected.data} refresh={refresh} />
          </Paper>
        </Grid>
        {/* Uplink messages */}
        <Grid item xs={12}>
          <Paper className={classes.paper}>
          <MessagesTable id={selected.data.id} />
          </Paper>
        </Grid>
        {/* Sent downlink messages 
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <SentDownlinkMessages refresh={refresh} />
          </Paper>
        </Grid>*/}
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    position: "relative",
    width: "100%",
  },
}));

const mapStateToProps = ({ result }) => ({
  selected: result.selected,
});

const mapDispatchToProps = {
  resetSelectedResult,
  getGatewayDetail,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(globalStyles)(GatewayDetail));
