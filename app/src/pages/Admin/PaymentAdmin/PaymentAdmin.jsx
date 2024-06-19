import React, { useState, useEffect, useRef } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { Table, Button, Space, Input, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import TopBar from "../TopBar/TopBar";
import Loading from "../../../comp/Loading";
import NoData from "../../../comp/NoData";
import dayjs from "dayjs";
import styles from "./PaymentAdmin.module.css";
import useAuth from "../../../hooks/useAuth.jsx";

const PaymentAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 11;
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const searchInput = useRef(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosPrivate.get("/orders/transfer");
        setOrders(response.data);
      } catch (error) {
        if (error.response) {
          setError(`Error: ${error.response.data.error}`);
        } else if (error.request) {
          setError("Error: No response from server");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [auth.auth, axiosPrivate]);

  const handleConfirmPayment = async (order_id) => {
    try {
      const response = await axiosPrivate.get(`/order/confirm/${order_id}`);
      message.success(response.data.message);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== order_id)
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      alert(`Error: ${error.response.data.error}`);
    } else if (error.request) {
      alert("Error: No response from server");
    } else {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTableChange = (pagination, filters, sorter) => {
    console.log(pagination, filters, sorter);
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const keys = dataIndex.split(".");
      const field = keys.reduce((acc, key) => (acc ? acc[key] : null), record);
      return (
        field && field.toString().toLowerCase().includes(value.toLowerCase())
      );
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const getUserColumnSearchProps = () => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search user`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, "user")}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, "user")}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      const user = `${record.user.name} ${record.user.surname}`;
      return user.toLowerCase().includes(value.toLowerCase());
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text, record) =>
      searchedColumn === "user" ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={`${record.user.name} ${record.user.surname}`}
        />
      ) : (
        `${record.user.name} ${record.user.surname}`
      ),
  });

  const columns = [
    {
      title: "Order identification nr.",
      dataIndex: "order_id",
      key: "order_id",
      align: "center",
      sorter: (a, b) => a.order_id - b.order_id,
      ...getColumnSearchProps("order_id"),
      render: (order_id) => <span>{order_id}</span>,
    },
    {
      title: "User",
      dataIndex: "user",
      align: "center",
      key: "user",
      ...getUserColumnSearchProps(),
      render: (user) => <span>{`${user.name} ${user.surname}`}</span>,
    },
    {
      title: "Full price",
      dataIndex: "full_price",
      align: "center",
      key: "full_price",
      sorter: (a, b) => a.full_price - b.full_price,
      render: (full_price) => <span>{full_price}</span>,
    },
    {
      title: "Order date",
      dataIndex: "orderDate",
      align: "center",
      key: "orderDate",
      render: (orderDate) => (
        <span>{dayjs(orderDate).format("DD-MM-YYYY")}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleConfirmPayment(record.order_id)}
        >
          Confirm Payment
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar />
        <Loading />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className={styles.ordersList}>
        {orders.length === 0 ? (
          <NoData />
        ) : (
          <Table
            className={styles.fullWidthTable}
            columns={columns}
            dataSource={orders}
            rowKey={(record) => record.order_id}
            pagination={{
              total: orders.length,
              pageSize: ordersPerPage,
              current: currentPage,
              onChange: handlePageChange,
            }}
            onChange={handleTableChange}
          />
        )}
      </div>
    </>
  );
};

export default PaymentAdmin;
