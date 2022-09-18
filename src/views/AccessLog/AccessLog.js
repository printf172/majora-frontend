import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";

import { Table } from "./components";
import SearchFilter from "./SearchFilter";
import apis from "apis";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const AccessLog = () => {
  const classes = useStyles();


  const [recordList, setRecordList] = useState([]);

  const [queryParam, setQueryParam] = useState({
    page: 1,
    pageSize: 10,
    keyword: "",
    myself: false,
    startTime: "",
    endTime: ""
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const getData = () => {
      apis.searchAccessRecord(queryParam).then(res => {
        if (res.status === 0) {
          setRecordList(res.data.records);
          setTotal(res.data.total);
        }
      }).catch(e => console.log(e));
    };
    getData();
  }, [queryParam]);

  const onPageChange = (event, newPage) => {
    setQueryParam({
      ...queryParam,
      page: newPage
    });
  };


  return (
    <div className={classes.root}>
      <SearchFilter className={classes.root}
                    searchForm={queryParam}
                    setSearchForm={setQueryParam}
      />
      <div className={classes.content}>
        <Table
          page={queryParam.page}
          onPageChange={onPageChange}
          data={recordList}
          total={total}/>
      </div>
    </div>
  );
};

export default AccessLog;
