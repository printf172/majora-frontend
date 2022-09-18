import React from "react";
import { makeStyles } from "@material-ui/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import Switch from "@material-ui/core/Switch";
import { Card, CardContent, CardHeader, Grid, Typography } from "@material-ui/core";
import { SearchInput } from "components";

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

  return (
    <Card {...rest}
          className={clsx(classes.pos, className)}>
      <CardHeader
        title="终端查询面板"
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
              onChange={(v) => {
                setSearchForm({
                  ...searchForm,
                  "keyword": v,
                  page: 1
                });
                setRefresh(+new Date());
              }}
              initValue={searchForm.keyword}
              placeholder="请输入关键词"
            />
          </Grid>

          <Grid item xs={2}>
            <Typography
              gutterBottom
              variant="h6"
            >是否在线</Typography>
            <Switch
              inputProps={{ "aria-label": "primary checkbox" }}
              checked={!!searchForm.online}
              onChange={e => {
                setSearchForm({
                  ...searchForm,
                  online: e.target.checked,
                  page: 1
                });
                setRefresh(+new Date());
                return true;
              }}
            />
          </Grid>
          <Grid item xs={2}>
          <Typography
            gutterBottom
            variant="h6"
          >过滤固定端口</Typography>
          <Switch
            inputProps={{ "aria-label": "primary checkbox" }}
            checked={!!searchForm.hasMappingPort}
            onChange={e => {
              setSearchForm({
                ...searchForm,
                hasMappingPort: e.target.checked,
                page: 1
              });
              setRefresh(+new Date());
              return true;
            }}
          />
        </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


SearchFilter.propTypes = {
  className: PropTypes.string,
  setRefresh: PropTypes.func,
  style: PropTypes.object,
  searchForm: PropTypes.object,
  setSearchForm: PropTypes.func
};
export default SearchFilter;
