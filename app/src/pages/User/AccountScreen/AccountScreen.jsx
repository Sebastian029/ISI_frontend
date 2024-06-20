import { useEffect, useState } from "react";
import styles from "./AccountScreen.module.css";
import Footer from "../HomeScreen/Footer/Footer";
import TopBar from "../HomeScreen/TopBar/TopBar";
import { Button, Form, Input, Space, Switch } from "antd";
import { InputOTP } from "antd-input-otp";
import { axiosPrivate } from "../../../hooks/useAxiosPrivate";
import useAuth from "../../../hooks/useAuth";
import { message } from "antd";
import { Logout } from "../../../comp/Logout";

function AccountScreen() {
  const appStyles = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  };
  const { auth } = useAuth();
  const [accountData, setAccountData] = useState({
    name: "",
    surname: "",
    email: "",
    notification: "",
  });
  const [phoneNumber, setPhoneNumber] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/contact");
        if (response) {
          setAccountData(response.data);
          if(response.data.phone_number){
            setPhoneNumber(response.data.phone_number.split(""));
          }
        }
      } catch (err) {
        //    console.log(err);
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
        messageApi.open({
          type: "info",
          content: JSON.stringify(response.data.message, null, 2),
        });
      }
    } catch (err) {
      //  console.log(err);
    }
  };

  const handleSwitch = async (checked) => {
    try {
      const response = await axiosPrivate.patch("/notification");

      if (response) {
        messageApi.open({
          type: "info",
          content: JSON.stringify(response.data.message, null, 2),
        });
      }
      setAccountData((prevData) => ({
        ...prevData,
        notification: checked,
      }));
    } catch (err) {
      //console.log(err);
    }
  };

  const handleFinish = (otp) => {
    handleDataChange("phoneNumber", otp.join(""));
  };
  return (
    <>
      <div style={appStyles}>
        <TopBar />
        {contextHolder}
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
                      className={styles.button}
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
                      className={styles.button}
                    >
                      Save
                    </Button>
                  </Space.Compact>
                </Form.Item>
                <Form.Item className={styles.formItem} label="Phone number">
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
                      readOnly={true}
                    />
                  </Space.Compact>
                </Form.Item>

                <Form.Item className={styles.formItem}>
                  <Switch
                    defaultChecked
                    className={styles.switch}
                    value={accountData.notification}
                    onChange={handleSwitch}
                  />
                  Do u want to receive email notifications?
                </Form.Item>
              </Form>

              <div className={styles.logoutButton}>
                <Logout />
              </div>

              {/*axiosResponse ? (
                <p className={styles.axiosResponseStyle}>
                  {JSON.stringify(axiosResponse.data.message, null, 2)}
                </p>
              ) : (
                <p className={styles.axiosResponseBlankStyle}></p>
              )*/}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default AccountScreen;
