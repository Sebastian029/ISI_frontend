import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import TopBar from "../TopBar/TopBar";
import Footer from "../Footer/Footer";
import Loading from "../../../comp/Loading";

const Privileges = () => {
  const [users, setUsers] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    privilege_name: "",
  });
  const axiosPrivate = useAxiosPrivate();

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
  }, [axiosPrivate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemove = async (publicId, privilegeName) => {
    try {
      await axiosPrivate.delete("/users/privileges/remove", {
        data: { public_id: publicId, privilege_name: privilegeName },
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = async () => {
    try {
      const selectedUser = users.find(
        (user) => user.name === formData.username
      );
      if (!selectedUser) {
        throw new Error("User not found");
      }

      await axiosPrivate.post("/users/privileges/add", {
        public_id: selectedUser.public_id,
        privilege_name: formData.privilege_name,
      });

      const usersResponse = await axiosPrivate.get("/users/privilages");
      setUsers(usersResponse.data);
      setFormData({ username: "", privilege_name: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <TopBar />
      <h1>Users and Privileges</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - Privileges:{" "}
            {user.privileges.map((privilege) => (
              <span key={privilege.id}>
                {privilege.name}
                <button
                  onClick={() => handleRemove(user.public_id, privilege.name)}
                >
                  Remove
                </button>
              </span>
            ))}
          </li>
        ))}
      </ul>
      <h2>Add Privilege to User</h2>
      <div>
        <label>Username:</label>
        <select
          name="username"
          value={formData.username}
          onChange={handleChange}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option key={user.id} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Privilege Name:</label>
        <select
          name="privilege_name"
          value={formData.privilege_name}
          onChange={handleChange}
        >
          <option value="">Select Privilege</option>
          {privileges.map((privilege) => (
            <option key={privilege.id} value={privilege.name}>
              {privilege.name}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAdd}>Add Privilege</button>
      <h2>Available Privileges</h2>
      <ul>
        {privileges.map((privilege) => (
          <li key={privilege.id}>{privilege.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Privileges;
