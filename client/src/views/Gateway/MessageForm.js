import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const MessageForm = ({
  codingRate,
  setCodingRate,
  transmissionPower,
  setTransmissionPower,
  spreadingFactor,
  setSpreadingFactor,
  band,
  setBand,
  msgType,
}) => {
  const localClasses = useStyles();
  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          marginBottom: 0,
        }}
      >
        <Typography variant="caption" style={{ marginRight: 8 }}>
          Message type
        </Typography>
        <Typography>{msgType}</Typography>
      </div>
      <FormControl
        variant="outlined"
        className={localClasses.formControl}
        margin="normal"
      >
        <InputLabel id="coding-rate-select">Coding Rate</InputLabel>
        <Select
          labelId="coding-rate-select"
          id="coding-rate-select"
          value={codingRate}
          onChange={(event) => setCodingRate(event.target.value, msgType)}
          label="Coding rate"
        >
          {["4/5"].map((sf) => {
            return (
              <MenuItem key={sf} value={sf}>
                {sf}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        margin="normal"
        className={localClasses.formControl}
      >
        <InputLabel id="bandwidth-select">Bandwidth</InputLabel>
        <Select
          labelId="bandwidth-select"
          id="bandwidth-select"
          value={band}
          onChange={(event) => setBand(event.target.value, msgType)}
          label="Bandwidth"
        >
          {[125, 250, 500].map((bw) => {
            return (
              <MenuItem key={bw} value={bw}>
                {bw}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        margin="normal"
        className={localClasses.formControl}
      >
        <InputLabel id="transmission-power-select">
          Transmission Power
        </InputLabel>
        <Select
          labelId="transmission-power-select"
          id="transmission-power-select"
          value={transmissionPower}
          onChange={(event) =>
            setTransmissionPower(event.target.value, msgType)
          }
          label="Transmission Power"
        >
          {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(
            (tp) => {
              return (
                <MenuItem key={tp} value={tp}>
                  {tp}
                </MenuItem>
              );
            }
          )}
        </Select>
      </FormControl>

      <FormControl
        variant="outlined"
        className={localClasses.formControl}
        margin={"normal"}
      >
        <InputLabel id="spreading-factor-select">Spreading Factor</InputLabel>
        <Select
          labelId="spreading-factor-select"
          id="spreading-factor-select"
          value={spreadingFactor}
          onChange={(event) => setSpreadingFactor(event.target.value, msgType)}
          label="Spreading Factor"
        >
          {[7, 8, 9, 10, 11, 12].map((sf) => {
            return (
              <MenuItem key={sf} value={sf}>
                {sf}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {/* Dynamic fields: https://jasonwatmore.com/post/2020/09/28/react-formik-dynamic-form-example */}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  textArea: {
    borderRadius: 5,
    resize: "none",
    width: "100%",
    maxWidth: 250,
    paddingRight: 0,
  },
  formControl: {
    // maxWidth: 220,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default MessageForm;
