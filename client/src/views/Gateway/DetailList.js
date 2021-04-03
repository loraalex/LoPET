import React from "react";
import { connect } from "react-redux";
import Title from "../../components/Title";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import withWidth, { isWidthUp } from "@material-ui/core/withWidth";

export const DetailList = ({ gateway, width }) => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Title>Gateway detail</Title>
      <table>
        <thead className={classes.tableHead}>
          <tr>
            <th>key</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.tableRow}>
            <td>id</td>
            <td>{gateway.id}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>gateway name</td>
            <td>{gateway.name}</td>
          </tr>
          <tr className={clsx(classes.tableRow)}>
            <td>firmware</td>
            <td>{gateway.firmware}</td>
          </tr>
        </tbody>
      </table>
      <Divider variant="middle" className={classes.divider} />
      <table>
        <thead className={classes.tableHead}>
          <tr>
            <th>key</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.tableRow}>
            <td>protocol_ver</td>
            <td>{gateway.lora_protocol_ver}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>max_power</td>
            <td>
              {gateway.max_power}
              {" dBm"}
            </td>
          </tr>
          <tr className={clsx(classes.tableRow)}>
            <td>channels_num</td>
            <td>{gateway.channels_num}</td>
          </tr>
          <tr className={clsx(classes.tableRow)}>
            <td>duty_cycle_refresh in</td>
            <td>{gateway.duty_cycle_refresh}</td>
          </tr>
          <tr className={clsx(classes.tableRow)}>
            <td>lora_protocol</td>
            <td>{gateway.lora_protocol}</td>
          </tr>
          <tr className={clsx(classes.tableRow)}>
            <td>lora_protocol_ver</td>
            <td>{gateway.lora_protocol_ver}</td>
          </tr>

          {isWidthUp("sm", width) ? (
            <>
              <tr className={clsx(classes.tableRow)}>
                <td>stat_model</td>
                <td>
                  <TextareaAutosize
                    className={classes.textArea}
                    value={gateway.stat_model.map((e) =>
                      JSON.stringify(e, undefined, 2)
                    )}
                    readOnly
                    rowsMax={5}
                    aria-label="maximum height"
                  />
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr className={clsx(classes.tableRow)}>
                <td colSpan={2}>stat_model</td>
              </tr>

              <tr className={clsx(classes.tableRow)}>
                <td colSpan={2}>
                  <TextareaAutosize
                    className={classes.textArea}
                    value={gateway.stat_model.map((e) =>
                      JSON.stringify(e, undefined, 2)
                    )}
                    readOnly
                    rowsMax={5}
                    aria-label="maximum height"
                  />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <Divider variant="middle" className={classes.divider} />
      <table>
        <thead className={classes.tableHead}>
          <tr>
            <th>key</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.tableRow}>
            <td>registration_freq</td>
            <td>{gateway?.registration_freq?.join(", ") || "unknown"}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>emergency_freq</td>
            <td>{gateway?.emergency_freq?.join(", ") || "unknown"}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>standard_freq</td>
            <td>{gateway?.standard_freq?.join(", ") || "unknown"}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>coderate</td>
            <td>{gateway?.coderate || "unknown"}</td>
          </tr>
          <tr className={classes.tableRow}>
            <td>bandwidth</td>
            <td>{gateway?.bandwidth || "unknown"}</td>
          </tr>
        </tbody>
      </table>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  table: {
    borderCollapse: "collapse",
  },
  tableHead: {
    display: "none",
  },
  tableRow: {
    "& > td:first-child": {
      textAlign: "right",
      paddingRight: 15,
      width: 250,
      verticalAlign: "top",
      fontWeight: theme.typography.fontWeightBold,
      [theme.breakpoints.down("xs")]: {
        width: 120,
        textAlign: "left",
        whiteSpace: "nowrap",
      },
    },
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  textArea: {
    borderRadius: 5,
    resize: "none",
    width: "100%",
    maxWidth: 250,
    paddingRight: 0,
  },
  tableBody: {},
}));

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withWidth()(DetailList));
