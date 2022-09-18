import React, { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import { Card, CardContent, CardHeader, Grid, TextField, Typography } from "@material-ui/core";
import { SearchInput } from "components";
import moment from "moment";
import { AppContext } from "adapter";


const useStyles = makeStyles(theme => ({
  root: {},
  inputItem: {
    width: "100%"
  }, pos: {
    marginBottom: 12
  }, miniMargin: {
    marginTop: 4
  },

  inline: {
    display: "inline-block"
  }
}));


const SearchFilter = props => {
  const classes = useStyles();
  const { className, setRefresh, searchForm, setSearchForm, ...rest } = props;
  const {user} = useContext(AppContext);
  const onKeywordChange = (v) => {
    setSearchForm({
      ...searchForm,
      keyword: v,
      page: 1
    });
  };

  const onSearchStartTimeChange = (e) => {
    setSearchForm({
      ...searchForm,
      startTime: e.target.value ? moment(e.target.value).format("YYYY-MM-DD HH:mm:ss") : "",
      page: 1
    });
    return true;
  };

  const onSearchEndTimeChange = (e) => {
    setSearchForm({
      ...searchForm,
      endTime: e.target.value ? moment(e.target.value).format("YYYY-MM-DD HH:mm:ss") : "",
      page: 1
    });
    return true;
  };

  const onMyselfCheckChange = (e) => {
    setSearchForm({
      ...searchForm,
      myself: e.target.checked,
      page: 1
    });
    return true;

  };

  return (
    <Card {...rest}
          className={clsx(classes.pos, className)}>
      <CardHeader
        title="日志查询面板"
      />
      <CardContent>
        <Grid
          container
          spacing={3}
          wrap="wrap"
        >
          <Grid item xs={4}>
            <Typography
              gutterBottom
              variant="h6"
            >关键词</Typography>
            <SearchInput
              className={classes.inputItem}
              onChange={onKeywordChange}
              initValue={searchForm.keyword}
              placeholder="请输入关键词"
            />
          </Grid>

          <Grid item xs={2}>
            <Typography
              gutterBottom
              variant="h6"
            >开始时间</Typography>
            <TextField
              style={{ marginTop: 10, marginRight: 10 }}
              type="datetime-local"
              value={searchForm.startTime}
              onChange={onSearchStartTimeChange}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography
              gutterBottom
              variant="h6"
            >截止时间</Typography>
            <TextField
              style={{ marginTop: 10, marginRight: 10 }}
              type="datetime-local"
              value={searchForm.endTime}
              onChange={onSearchEndTimeChange}
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
                checked={!!searchForm.myself}
                onChange={onMyselfCheckChange}
              />
            </Grid>) :
            <></>
          }

        </Grid>
      </CardContent>
    </Card>
  );
};


SearchFilter.propTypes = {
  className: PropTypes.string,
  searchForm: PropTypes.object,
  setSearchForm: PropTypes.func
};
export default SearchFilter;
