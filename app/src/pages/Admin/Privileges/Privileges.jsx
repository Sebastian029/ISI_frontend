import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import TopBar from "../TopBar/TopBar";
import Footer from '../Footer/Footer';
import Modal from 'react-modal';
import styles from "./Privileges.module.css";

Modal.setAppElement('#root');

const Privileges = () => {
  const [users, setUsers] = useState([]);
  const [privileges, setPrivileges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ username: '', privilege_name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const axiosPrivate = useAxiosPrivate();

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  
  // Updated filter logic to search by name, surname, or email
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPrivileges, setSelectedPrivileges] = useState([]);

  useEffect(() => {
    const fetchUsersAndPrivileges = async () => {
      try {
        const [usersResponse, privilegesResponse] = await Promise.all([
          axiosPrivate.get('/users/privilages'),
          axiosPrivate.get('/privilages')
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
      await axiosPrivate.delete('/users/privileges/remove', { data: { public_id: publicId, privilege_name: privilegeName } });
      const usersResponse = await axiosPrivate.get('/users/privilages');
      setUsers(usersResponse.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAdd = async () => {
    try {
      const selectedUser = users.find(user => user.name === formData.username);
      if (!selectedUser) {
        throw new Error('User not found');
      }
      
      await axiosPrivate.post('/users/privileges/add', { public_id: selectedUser.public_id, privilege_name: formData.privilege_name });
      const usersResponse = await axiosPrivate.get('/users/privilages');
      setUsers(usersResponse.data);
      setFormData({ username: '', privilege_name: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${styles.button} ${i === currentPage ? styles.active : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  const openModal = (user) => {
    setSelectedUser(user);
    setSelectedPrivileges(user.privileges.map(priv => priv.name));
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedUser(null);
    setSelectedPrivileges([]);
  };

  const handlePrivilegeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedPrivileges(prev =>
      checked ? [...prev, value] : prev.filter(priv => priv !== value)
    );
  };

  const handleSavePrivileges = async () => {
    try {
      const initialPrivileges = selectedUser.privileges.map(priv => priv.name);
      const privilegesToAdd = selectedPrivileges.filter(priv => !initialPrivileges.includes(priv));
      const privilegesToRemove = initialPrivileges.filter(priv => !selectedPrivileges.includes(priv));

      // Add new privileges
      for (const privilegeName of privilegesToAdd) {
        await axiosPrivate.post('/users/privileges/add', {
          public_id: selectedUser.public_id,
          privilege_name: privilegeName
        });
      }

      // Remove unselected privileges
      for (const privilegeName of privilegesToRemove) {
        await axiosPrivate.delete('/users/privileges/remove', {
          data: { public_id: selectedUser.public_id, privilege_name: privilegeName }
        });
      }

      // Fetch the updated users list
      const usersResponse = await axiosPrivate.get('/users/privilages');
      setUsers(usersResponse.data);
      closeModal();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <><TopBar /> <div className={styles.privilegesList}>Loading...</div></>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <TopBar />
      <div className={styles.privilegesList}>
        <h1>Users and Privileges</h1>
        <input
          type="text"
          placeholder="Search by name, surname, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <ul className={styles.mainList}>
          {currentUsers.map(user => (
            <li className={styles.privileges} key={user.id}>
              <span>{user.name} {user.surname} </span>
              {user.email} - Privileges:
              <ul>
                {user.privileges.map(privilege => (
                  <li key={privilege.id}>{privilege.name}</li>
                ))}
              </ul>
              <button className={styles.button} onClick={() => openModal(user)}>Edit Privileges</button>
            </li>
          ))}
        </ul>
        <div className={styles.pagination}>
          <button
            className={styles.button}
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            className={styles.button}
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <h2>Add Privilege to User</h2>
        <div>
          <label>Username:</label>
          <select name="username" value={formData.username} onChange={handleChange}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.name}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Privilege Name:</label>
          <select name="privilege_name" value={formData.privilege_name} onChange={handleChange}>
            <option value="">Select Privilege</option>
            {privileges.map(privilege => (
              <option key={privilege.id} value={privilege.name}>{privilege.name}</option>
            ))}
          </select>
        </div>
        <button onClick={handleAdd}>Add Privilege</button>

        <h2>Available Privileges</h2>
        <ul>
          {privileges.map(privilege => (
            <li key={privilege.id}>{privilege.name}</li>
          ))}
        </ul>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Privileges"
        className={styles.modal}
        overlayClassName={styles.overlay}
      >
        <h2>Edit Privileges for {selectedUser?.name}</h2>
        <form>
          {privileges.map(privilege => (
            <div key={privilege.id}>
              <label>
                <input
                  type="checkbox"
                  value={privilege.name}
                  checked={selectedPrivileges.includes(privilege.name)}
                  onChange={handlePrivilegeChange}
                />
                {privilege.name}
              </label>
            </div>
          ))}
        </form>
        <button onClick={handleSavePrivileges}>Save</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>

      <Footer />
    </>
  );
};

export default Privileges;
