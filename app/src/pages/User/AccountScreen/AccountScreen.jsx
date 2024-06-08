import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountScreen.module.css";
import Footer from "../HomeScreen/Footer/Footer";
import TopBar from "../HomeScreen/TopBar/TopBar";
import { Button, Form, Input, Space } from "antd";
import { InputOTP } from "antd-input-otp";
import { Slider } from "antd";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";

function AccountScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [accountData, setAccountData] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [axiosResponse, setAxiosResponse] = useState(null);

  const handleLogout = () => {
    console.log("logout");
    localStorage.setItem("authData", null);
    setAuth(null);
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/contact");
        if (response) {
          setAccountData(response.data);
          setPhoneNumber(response.data.phone_number.split(""));
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [auth]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAccountData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDataChange = async (inputType, value) => {
    try {
      const params = {
        [inputType]: value,
      };

      const response = await axiosPrivate.patch("/update_user", params);

      if (response) {
        setAxiosResponse(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFinish = (otp) => {
    handleDataChange("phoneNumber", otp.join(""));
  };
  return (
    <div style={appStyles}>
      <TopBar />
      <div className={styles.mainBox}>
        <div className={styles.accountBox}>
          <p className={styles.detailsTitle}>Account Details</p>
          <div className={styles.form}>
            <Form layout={"vertical"}>
              <Form.Item className={styles.formItem} label="First Name">
                <Space.Compact
                  style={{
                    width: "100%",
                  }}
                >
                  <Input
                    name="name"
                    value={accountData.name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                  <Button
                    type="primary"
                    onClick={() => handleDataChange("name", accountData.name)}
                  >
                    Save
                  </Button>
                </Space.Compact>
              </Form.Item>
              <Form.Item className={styles.formItem} label="Last Name">
                <Space.Compact
                  style={{
                    width: "100%",
                  }}
                >
                  <Input
                    name="surname"
                    value={accountData.surname}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                  <Button
                    type="primary"
                    onClick={() =>
                      handleDataChange("surname", accountData.surname)
                    }
                  >
                    Save
                  </Button>
                </Space.Compact>
              </Form.Item>
              <Form.Item className={styles.formItem} label="Phone number">
                <Slider min={0} max={999999999} />

                {/*}
                <Space.Compact
                  style={{
                    width: "100%",
                  }}
                >
                  <div className={styles.inputOTP}>
                    <InputOTP
                      name="phone_number"
                      length={9}
                      inputType="numeric"
                      onChange={setPhoneNumber}
                      value={phoneNumber}
                      autoSubmit={handleFinish}
                    />
                  </div>
                </Space.Compact>
                */}
              </Form.Item>
              <Form.Item className={styles.formItem} label="Email">
                <Space.Compact
                  style={{
                    width: "100%",
                  }}
                >
                  <Input
                    name="email"
                    value={accountData.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                    readOnly="true"
                  />
                </Space.Compact>
              </Form.Item>
            </Form>

            <div className={styles.logoutButton} onClick={() => handleLogout()}>
              Logout
            </div>
            {axiosResponse && (
              <p className={styles.axiosResponseStyle}>
                {JSON.stringify(axiosResponse.data.message, null, 2)}
              </p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AccountScreen;
