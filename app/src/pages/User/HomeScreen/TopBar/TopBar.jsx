import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TopBar.module.css";
import Modal from "../Modal/Modal.jsx";
import useAuth from "../../../../hooks/useAuth.jsx";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../../../../assets/appLogo.png";

import { Dropdown, Space } from "antd";

function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuth();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (auth && auth.username) {
      setUsername("Welcome " + auth.username + "!");
    }
  }, [auth]);

  const getSelectedOption = () => {
    switch (location.pathname) {
      case "/":
        return "home";
      case "/recommended":
        return "recommended";
      case "/favourites":
        return "favourites";
      case "/reservations":
        return "reservations";
      case "/account":
        return "account";
      default:
        return "";
    }
  };
  const selectedOption = getSelectedOption();
  const items = [
    {
      label: (
        <a href="/" className={selectedOption === "home" ? "active" : ""}>
          Home
        </a>
      ),
      key: "home",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="/recommended"
          className={selectedOption === "recommended" ? "active" : ""}
        >
          Recommended
        </a>
      ),
      key: "recommended",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="/favourites"
          className={selectedOption === "favourites" ? "active" : ""}
        >
          Favourites
        </a>
      ),
      key: "favourites",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="/reservations"
          className={selectedOption === "reservations" ? "active" : ""}
        >
          Reservations
        </a>
      ),
      key: "reservations",
    },
    {
      type: "divider",
    },
    {
      label: (
        <a
          href="/account"
          className={selectedOption === "account" ? "active" : ""}
        >
          Account
        </a>
      ),
      key: "account",
    },
  ];

  return (
    <>
      <div className={styles.mainBoxWrapper}>
        <div className={styles.mainBox}>
          <div className={styles.username}>
            <img src={logo} alt="App Logo" />
            {username}
          </div>
          <div className={styles.appLogo}>
            <img src={logo} alt="App Logo" />
            Flight Finder
          </div>
          <Dropdown
            className={styles.dropdownMenu}
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <Space>
              <span style={{ fontSize: "0.9em", fontFamily: "Lato" }}>
                {selectedOption &&
                  selectedOption.charAt(0).toUpperCase() +
                    selectedOption.slice(1)}
              </span>
              <MenuOutlined />
            </Space>
          </Dropdown>

          <div
            className={`${styles.box} ${
              selectedOption === "home" ? styles.selected : ""
            }`}
            onClick={() => navigate("/")}
          >
            Home
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "recommended" ? styles.selected : ""
            }`}
            onClick={() => navigate("/recommended")}
          >
            Recommended
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "favourites" ? styles.selected : ""
            }`}
            onClick={() => navigate("/favourites")}
          >
            Favourites
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "reservations" ? styles.selected : ""
            }`}
            onClick={() => navigate("/reservations")}
          >
            My reservations
          </div>
          <div
            className={`${styles.box} ${
              selectedOption === "account" ? styles.selected : ""
            }`}
            onClick={() => navigate("/account")}
          >
            {auth ? "Account" : "Sign In"}
          </div>
          <Modal />
        </div>
      </div>
    </>
  );
}

export default TopBar;
