import React from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/styles";
import { Table } from "views/common";
import { Card, CardActions, CardContent } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: "flex",
    alignItems: "center"
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: "center"
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
  dialogInput: {
    width: "100%"
  }
}));

const DataTable = props => {
  const { className, data, page, total, onPageChange } = props;


  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[
            {
              label: "账户",
              key: "accessUser"
            }, {
              label: "访问目标",
              key: "targetHost"
            }, {
              label: "时间(小时)",
              key: "recordTime"
            }, {
              label: "生成时间",
              key: "createTime"
            },
            {
              label: "访问次数",
              key: "accessCount"
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / 10) || 1}
          page={page}
          onChange={onPageChange}
          shape="rounded"/>
      </CardActions>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
