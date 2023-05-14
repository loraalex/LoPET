import securityApi from "../api/securityApi";
import devConsole from "../devConsole";

import {
  SET_UPLINK_MESSAGES,
  SET_COUNT_OF_UPLINK_MESSAGES,
  SET_SENT_DOWNLINK_MESSAGES,
  SET_SCHEDULED_DOWNLINK_MESSAGES,
  SET_COUNT_OF_SENT_DOWNLINK_MESSAGES,
  SET_COUNT_OF_SCHEDULED_DOWNLINK_MESSAGES,
  SET_RESULTS,
  SET_COUNT_RESULTS,
  SELECT_RESULT,
} from "./types";

export const getPentests = ({ order, rowsPerPage, page, column }) => async (
  dispatch
) => {
  console.log('getpentests')
  try {
    const res = await securityApi.getPentests({
      order,
      rowsPerPage,
      page,
      column,
    });

    dispatch({
      type: SET_RESULTS,
      payload: res.data,
    });
  } catch (err) {
    devConsole.log(err);
  }
};

export const getCountOfPentests = () => async (dispatch) => {
  try {
    const res = await securityApi.getCountOfPentests();

    dispatch({
      type: SET_COUNT_RESULTS,
      payload: res.data.count,
    });
  } catch (err) {
    devConsole.log(err);
  }
};

export const createPentest = (data) => async (dispatch) => {
  try {
    const res = await securityApi.createPentest(data);
  } catch (err) {
    devConsole.log(err);
  }
};


export const getPentestDetail = (payload) => async (dispatch) => {
  try {
    const { data } = await securityApi.getPentestDetail(payload);

    console.log(data);
    
    if (data[0]) {
      dispatch({
        type: SELECT_RESULT,
        payload: {
          data: data[0],
          type: "pentest",
        },
      });
    } else {
      dispatch({
        type: SELECT_RESULT,
        payload: {
          data: undefined,
          type: undefined,
        },
      });
    }
  } catch (err) {
    dispatch({
      type: SELECT_RESULT,
      payload: {
        data: undefined,
        type: undefined,
      },
    });
    devConsole.log(err);
  }
};