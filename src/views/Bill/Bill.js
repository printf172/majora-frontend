import React from "react";
import { Grid } from "@material-ui/core";
import BillPanel from "./BillPanel";
import apis from "apis";

const Bill = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <BillPanel
          title={"用户端消费流水"}
          api={apis.consumerBillList}
          exportApi={"/majora-api/report/exportConsumerBill"}
        />
      </Grid>
      <Grid item xs={6}>
        <BillPanel
          title={"代理端供应流水"}
          api={apis.vendorBillList}
          exportApi={"/majora-api/report/exportVendorBill"}
        />
      </Grid>
    </Grid>
  );
};

export default Bill;
