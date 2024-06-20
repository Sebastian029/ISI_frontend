import { Empty } from "antd";
import PropTypes from "prop-types";

const NoData = ({ description = "No Data Found" }) => (
  <div>
    <Empty description={description} />
  </div>
);

NoData.propTypes = {
  description: PropTypes.string,
};

export default NoData;
