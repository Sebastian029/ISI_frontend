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
import styles from "./Role.module.css";
import useAuth from "../../../hooks/useAuth.jsx";
import NoData from "../../../comp/NoData";

const Role = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const auth = useAuth();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [initialRoles, setInitialRoles] = useState([]);

  useEffect(() => {
    const fetchUsersAndRoles = async () => {
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          axiosPrivate.get("/users/roles"),
          axiosPrivate.get("/roles"),
        ]);

        setUsers(usersResponse.data);
        setRoles(rolesResponse.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndRoles();
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
    const userRoles = user.roles.map((priv) => priv.name);
    setSelectedUser(user);
    setSelectedRoles(userRoles);
    setInitialRoles(userRoles);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
    setSelectedRoles([]);
    setInitialRoles([]);
  };

  const handlePrivilegeChange = (e) => {
    const { value } = e.target;
    setSelectedRoles([value]); // Only one role can be selected at a time
  };

  const handleSaveRoles = async () => {
    try {
      await axiosPrivate.post("/change_role", {
        public_id: selectedUser.public_id,
        role_name: selectedRoles[0], // Only one role should be in the array
      });

      const usersResponse = await axiosPrivate.get("/users/roles");
      setUsers(usersResponse.data);
      closeModal();
      message.success("Roles updated successfully!");
    } catch (err) {
      setError(err.message);
      message.error("Failed to update roles.");
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
          Edit Role
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
      <div className={styles.rolesList}>
        {roles.length === 0 ? (
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
          onOk={handleSaveRoles}
          onCancel={closeModal}
          okButtonProps={{
            disabled:
              selectedRoles.sort().join(",") === initialRoles.sort().join(","),
          }}
        >
          <Form style={{ display: "flex" }}>
            {roles.map((privilege, index) => (
              <Form.Item key={index}>
                <Checkbox
                  value={privilege.name}
                  checked={selectedRoles.includes(privilege.name)}
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

export default Role;
