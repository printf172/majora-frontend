import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import apis from "apis";
import EndpointFilter from "./EndpointFilter";
import Table from "./components/Table";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  },
  tagButton: {
    border: "1px dashed #f0f0f0",
    marginRight: theme.spacing(1)
  },
  tagButtonActive: {
    border: "1px dashed #2196f3",
    backgroundColor: "#2196f3",
    marginRight: theme.spacing(1)
  }
}));

const Endpoint = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [endpoints, setEndpoints] = useState([]);
  const [total, setTotal] = useState(0);

  let initListParam = JSON.parse(localStorage.getItem("EndpointListParam") || "{}");

  const [searchForm, setSearchForm] = useState(() => {
    return {
      "page": 1,
      "pageSize": 10,
      "keyword": "",
      "online": false,
      "hasMappingPort": false,
      ...initListParam
    };
  });

  useEffect(() => {
    localStorage.setItem("EndpointListParam", JSON.stringify(searchForm));
  }, [searchForm]);


  const [refresh, setRefresh] = useState(+new Date());
  const [loading, setLoading] = useState(false);


  const handlePageChange = (event, page) => {
    setSearchForm({
      ...searchForm,
      page: page
    });
    setRefresh(+new Date());
  };

  useEffect(() => {
    setLoading(true);
    apis.endpointList(searchForm).then(res => {
      if (res.status === 0) {
        setEndpoints(res.data.records);
        setTotal(res.data.total);
      } else {
        enqueueSnackbar(res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
      setLoading(false);
    }).catch((e) => {
      enqueueSnackbar(e.message, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center"
        }
      });
    }).finally(() => {
      setLoading(false);
    });

  }, [refresh, searchForm, enqueueSnackbar]);


  return (
    <div className={classes.root}>
      <EndpointFilter
        searchForm={searchForm}
        setSearchForm={setSearchForm}
        setRefresh={setRefresh}
      />
      <div className={classes.content}>
        <Table
          setRefresh={setRefresh}
          data={endpoints}
          total={total}
          pageSize={searchForm.pageSize}
          pageChangeFunc={handlePageChange}
          page={searchForm.page}
          loading={loading}/>
      </div>
    </div>
  );
};

export default Endpoint;
