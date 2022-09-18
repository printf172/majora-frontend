import React, { useContext } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Pagination from '@material-ui/lab/Pagination';
import DirectionsRailwayIcon from '@material-ui/icons/DirectionsRailway';
import { makeStyles } from '@material-ui/styles';
import { Table } from 'views/common';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import {
  Card,
  CardActions,
  CardContent,
  Button,
} from '@material-ui/core';
import { AppContext } from 'adapter';
import moment from 'moment';

import apis from 'apis';

const useStyles = makeStyles(theme => ({
  root: {},
  content: {
    padding: 0
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  avatar: {
    marginRight: theme.spacing(2)
  },
  actions: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    justifyContent: 'center'
  },
  tableButton: {
    marginRight: theme.spacing(1)
  },
  dialogInput: {
    width: '100%'
  }
}));

const DataTable = props => {
  const { setUser } = useContext(AppContext);
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const { className, data, total, rowsPerPage, pageState, setRefresh, ...rest } = props;
  const [page, setPage] = pageState;

  const classes = useStyles();

  const handlePageChange = (event, page) => {
    setPage(page);
  };

  const doLogin = (item) => {
    apis.login({
      userName: item.userName,
      password: item.passwd,
    }).then(res => {
      if (res.status !== 0) {
        enqueueSnackbar(res.message, {
          variant: 'error',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        });
      } else {
        apis.setStore({ ...res.data, mock: true }, "Majora-USER-MOCK");
        setUser({
          ...res.data,
          mock: true,
          time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        });
        history.push('/');
      }
    });
  }

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent className={classes.content}>
        <Table
          data={data}
          columns={[
            {
              label: '账号',
              key: 'userName'
            }, {
              label: '密码',
              key: 'passwd'
            }, {
              label: '操作',
              render: (item) => (
                <>
                  <Button
                    startIcon={<DirectionsRailwayIcon style={{ fontSize: 16 }} />}
                    size="small"
                    color="primary"
                    className={classes.tableButton}
                    onClick={() => doLogin(item)}
                    variant="contained">登录</Button>
                </>
              )
            }
          ]}
        />
      </CardContent>
      <CardActions className={classes.actions}>
        <Pagination
          count={Math.ceil(total / rowsPerPage) || 1}
          page={page}
          onChange={handlePageChange}
          shape="rounded" />
      </CardActions>
    </Card>
  );
};

DataTable.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired
};

export default DataTable;
