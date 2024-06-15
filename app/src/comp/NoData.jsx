import React from "react";
import { Empty } from "antd";

const NoData = ({ description = "No Data Available" }) => (
  <div className={styles.noDataContainer}>
    <Empty description={description} />
  </div>
);

export default NoData;
