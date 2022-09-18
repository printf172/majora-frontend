import React, { useContext, useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Grid,
  Divider,
  Button,
  TextField, Typography
} from "@material-ui/core";
import { AppContext } from "adapter";
import { Table } from "views/common";
import Pagination from "@material-ui/lab/Pagination";
import moment from "moment";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles(theme => ({
  root: {
    height: "100%",
    padding: theme.spacing(3)
  },
  content: {
    alignItems: "center",
    display: "flex"
  },
  title: {
    fontWeight: 700
  }
}));

function parseFlow(data) {
  let unitIndex = 0;
  let unitArr = ["byte", "kb", "mb", "gb", "tb"];
  while (data > 1024 && unitIndex < unitArr.length) {
    unitIndex++;
    data = data / 1024;
  }
  return data.toFixed(2) + unitArr[unitIndex];
}

const BillPanel = (props) => {
  const { title, api, exportApi } = props;
  const { user } = useContext(AppContext);
  const classes = useStyles();


  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searchParam, setSearchParam] = useState({
    page: 1,
    pageSize: 10,
    myself: false,
    startTime: moment().subtract(30, "days").format("YYYY-MM-DD HH:mm"),
    endTime: moment().format("YYYY-MM-DD HH:mm")
  });
  useEffect(() => {
    setLoading(true);
    api(searchParam).then(res => {
      setLoading(false);
      if (res.status === 0) {
        setListData(res.data.records);
        setTotal(res.data.total);
      }
    });
  }, [searchParam, api]);

  const onStartTimeChange = (e) => {
    setSearchParam({
      ...searchParam,
      startTime: !!e.target.value ? moment(e.target.value).format("YYYY-MM-DD HH:mm") : "",
      page: 1
    });
  };

  const onEndTimeChange = (e) => {
    setSearchParam({
      ...searchParam,
      endTime: !!e.target.value ? moment(e.target.value).format("YYYY-MM-DD HH:mm") : "",
      page: 1
    });
  };
  const onMyselfCheckChange = (e) => {
    setSearchParam({
      ...searchParam,
      myself: e.target.checked,
      page: 1
    });
    return true;

  };
  return (
    <Card className={classes.root}>
      <CardHeader title={title} action={(
        <Grid container
              spacing={4}
              wrap="wrap">
          <Grid item xs={4}>
            <Typography
              gutterBottom
              variant="h6"
            >开始时间</Typography>
            <TextField
              style={{ marginTop: 10, marginRight: 10 }}
              type="datetime-local"
              value={searchParam.startTime}
              onChange={onStartTimeChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>

          <Grid item xs={4}>
            <Typography
              gutterBottom
              variant="h6"
            >终止时间</Typography>
            <TextField
              style={{ marginTop: 10, marginRight: 10 }}
              type="datetime-local"
              value={searchParam.endTime}
              onChange={onEndTimeChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          {user.isAdmin ?
            (<Grid item xs={2}>
              <Typography
                gutterBottom
                variant="h6"
              >过滤本账户</Typography>
              <Switch
                inputProps={{ "aria-label": "primary checkbox" }}
                checked={!!searchParam.myself}
                onChange={onMyselfCheckChange}
              />
            </Grid>) :
            <></>
          }
          <Grid item xs={4}>
            <Button
              style={{ marginTop: 10, marginRight: 5 }}
              color="primary"
              size="small"
              variant="contained"
              onClick={() => {
                window.open(`${exportApi}?token=${user.loginToken}&startTime=${searchParam.startTime}&endTime=${searchParam.endTime}`);
              }}>导出 EXCEL</Button>
          </Grid>
        </Grid>

      )}/>
      <Divider/>
      <CardContent>
        <Table
          data={listData}
          loading={loading}
          columns={[
            {
              label: "用户",
              key: "bindUser"
            }, {
              label: "流量",
              render: (item) => parseFlow(item.rateUsage)
            }, {
              label: "时间",
              render: (item) => moment(item.createTime).format("YYYY-MM-DD HH:mm:ss")
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / 10) || 1}
          page={searchParam.page}
          onChange={(event, p) => setSearchParam({
            ...searchParam,
            page: p
          })}
          shape="rounded"/>
      </CardActions>
    </Card>
  );
};

BillPanel.propTypes = {
  title: PropTypes.string.isRequired,
  api: PropTypes.func.isRequired,
  exportApi: PropTypes.string.isRequired
};


export default BillPanel;
