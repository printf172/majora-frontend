import React, { useState } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import Pagination from "@material-ui/lab/Pagination";
import { Table } from "views/common";
import { Button, Card, CardActions, Input, Typography, CardContent } from "@material-ui/core";
import moment from "moment";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import ControlPointDuplicateIcon from "@material-ui/icons/ControlPointDuplicate";
import apis from "apis";
import { useSnackbar } from "notistack";
import { OpeDialog } from "components";

function parseFlow(data) {
  let unitIndex = 0;
  let unitArr = ["byte", "kb", "mb", "gb", "tb"];
  while (data > 1024 && unitIndex < unitArr.length) {
    unitIndex++;
    data = data / 1024;
  }
  return data.toFixed(2) + unitArr[unitIndex];
}

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
  mt: {
    marginTop: theme.spacing(2)
  },
  inputItem: {
    width: "100%"
  }
}));

const DataTable = props => {
  const { className, total, data, page, pageSize, pageChangeFunc, loading, setRefresh, ...rest } = props;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [openBindingDialog, setOpenBindingDialog] = useState(false);
  const [bindingTaskClientId, setBindingTaskClientId] = useState("");
  const [bindingTaskPort, setBindingTaskPort] = useState(-1);

  const deleteEndpoint = (item) => {
    apis.deleteEndpoint({
      clientId: item.clientId
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        setRefresh(+new Date());
      }
    });
  };

  const deleteBinding = (item) => {
    apis.unBindingMappingPort({
      clientId: item.clientId
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        setRefresh(+new Date());
      }
    });
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          loading={props.loading}
          columns={[
            {
              label: "客户端 ID",
              key: "clientId"
            }, {
              label: "所属用户",
              key: "bindUser"
            }, {
              label: "固定端口",
              key: "mappingPort"
            }, {
              label: "出口IP",
              key: "outIp"
            }, {
              label: "在线状态",
              render: (item) => item.online ? "在线" : "离线"
            }
            , {
              label: "总流量",
              render: (item) => parseFlow(item.totalFlow)
            }, {
              label: "最后活跃时间",
              render: (item) => moment(item.lastActive).format("YYYY-MM-DD HH:mm:ss")
            }, {
              label: "操作",
              render: (item) => (
                <>
                  <Button
                    startIcon={<DeleteForeverIcon style={{ fontSize: 16 }}/>}
                    size="small"
                    color="secondary"
                    className={classes.tableButton}
                    onClick={() => {
                      deleteEndpoint(item);
                    }}
                    variant="contained">删除</Button>
                  {item.mappingPort ?
                    (<Button
                      startIcon={<ControlPointDuplicateIcon style={{ fontSize: 16 }}/>}
                      size="small"
                      color="primary"
                      className={classes.tableButton}
                      onClick={() => {
                        deleteBinding(item);
                      }}
                      variant="contained">解绑固定端口</Button>) :
                    (<Button
                      startIcon={<ControlPointIcon style={{ fontSize: 16 }}/>}
                      size="small"
                      color="primary"
                      className={classes.tableButton}
                      onClick={() => {
                        setBindingTaskClientId(item.clientId);
                        setOpenBindingDialog(true);
                      }}
                      variant="contained">绑定端口</Button>)
                  }
                </>
              )
            }
          ]}
        />
        <OpeDialog
          title="绑定端口"
          opeContent={(
            <>
              <div>
                <Typography
                  gutterBottom
                  variant="h6"
                >
                  端口
                </Typography>
                <Input
                  className={classes.dialogInput}
                  type="number"
                  max
                  value={bindingTaskPort}
                  onChange={(e) => {
                    setBindingTaskPort(e.target.value);
                  }}/>
              </div>
            </>

          )}
          openDialog={openBindingDialog}
          setOpenDialog={setOpenBindingDialog}
          doDialog={() => {
            if (bindingTaskPort <= 1000 || bindingTaskPort >= 65535) {
              enqueueSnackbar("绑定端口需要在: [1000,65535]", {
                variant: "error",
                anchorOrigin: {
                  vertical: "top",
                  horizontal: "center"
                }
              });
              return null;
            }
            return apis.bindMappingPort({
              clientId: bindingTaskClientId,
              port: bindingTaskPort
            }).then(res => {
              if (res.status === 0) {
                setRefresh(+new Date());
                setOpenBindingDialog(false);
                return "操作成功";
              }
              throw new Error(res.message);
            });
          }}
          okText="保存"
          okType="primary"/>
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / pageSize) || 1}
          page={page}
          onChange={pageChangeFunc}
          shape="rounded"/>
      </CardActions>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pageChangeFunc: PropTypes.func.isRequired,
  setRefresh: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default DataTable;
