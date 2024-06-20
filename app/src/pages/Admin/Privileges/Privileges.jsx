import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Space,
  Input,
  message,
  Modal,
  Checkbox,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { axiosPrivate } from "../../../hooks/useAxiosPrivate.jsx";
import TopBar from "../TopBar/TopBar";
import Loading from "../../../comp/Loading";
import styles from "./Privileges.module.css";
import useAuth from "../../../hooks/useAuth.jsx";
import NoData from "../../../comp/NoData";

const Privileges = () => {
  const [users, setUsers] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const auth = useAuth();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);
  const [initialPrivileges, setInitialPrivileges] = useState([]);

  useEffect(() => {
    const fetchUsersAndPrivileges = async () => {
      try {
        const [usersResponse, privilegesResponse] = await Promise.all([
          axiosPrivate.get("/users/privilages"),
          axiosPrivate.get("/privilages"),
        ]);

        setUsers(usersResponse.data);
        setPrivileges(privilegesResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndPrivileges();
  }, [auth.auth, axiosPrivate]);

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
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownOpenChange: (open) => {
      if (open) {
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

  const openModal = (user) => {
    const userPrivileges = user.privileges.map((priv) => priv.name);
    setSelectedUser(user);
    setSelectedPrivileges(userPrivileges);
    setInitialPrivileges(userPrivileges);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
    setSelectedPrivileges([]);
    setInitialPrivileges([]);
  };

  const handlePrivilegeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPrivileges((prev) =>
      checked ? [...prev, value] : prev.filter((priv) => priv !== value)
    );
  };

  const handleSavePrivileges = async () => {
    try {
      const privilegesToAdd = selectedPrivileges.filter(
        (priv) => !initialPrivileges.includes(priv)
      );
      const privilegesToRemove = initialPrivileges.filter(
        (priv) => !selectedPrivileges.includes(priv)
      );

      const addPromises = privilegesToAdd.map((privilegeName) =>
        axiosPrivate.post("/users/privileges/add", {
          public_id: selectedUser.public_id,
          privilege_name: privilegeName,
        })
      );

      const removePromises = privilegesToRemove.map((privilegeName) =>
        axiosPrivate.delete("/users/privileges/remove", {
          data: {
            public_id: selectedUser.public_id,
            privilege_name: privilegeName,
          },
        })
      );

      await Promise.all([...addPromises, ...removePromises]);

      const usersResponse = await axiosPrivate.get("/users/privilages");
      setUsers(usersResponse.data);
      closeModal();
      message.success("Privileges updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Surname",
      dataIndex: "surname",
      key: "surname",
      align: "center",
      ...getColumnSearchProps("surname"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Edit Privileges
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar /> <Loading />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <div className={styles.privilegesList}>
        {privileges.length === 0 ? (
          <NoData />
        ) : (
          <Table
            className={styles.fullWidthTable}
            columns={columns}
            dataSource={users}
            rowKey="public_id"
          />
        )}
        <Modal
          title={`Edit for ${selectedUser?.name} ${selectedUser?.surname}`}
          open={modalIsOpen}
          onOk={handleSavePrivileges}
          onCancel={closeModal}
          okButtonProps={{
            disabled:
              selectedPrivileges.sort().join(",") ===
              initialPrivileges.sort().join(","),
          }}
        >
          <Form style={{ display: "flex" }}>
            {privileges.map((privilege, index) => (
              <Form.Item key={index}>
                <Checkbox
                  value={privilege.name}
                  checked={selectedPrivileges.includes(privilege.name)}
                  onChange={handlePrivilegeChange}
                >
                  {privilege.name}
                </Checkbox>
              </Form.Item>
            ))}
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Privileges;
