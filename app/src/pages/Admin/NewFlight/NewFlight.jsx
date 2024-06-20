import { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  TimePicker,
  DatePicker,
  InputNumber,
  message,
  Form,
  Select,
  Button,
} from "antd";
import "antd/dist/reset.css";
import TopBar from "../TopBar/TopBar";
import { axiosPrivate } from "../../../hooks/useAxiosPrivate";
import styles from "./NewFlight.module.css";
import dayjs from "dayjs";
import useAuth from "../../../hooks/useAuth";

function NewFlight() {
  const [form] = Form.useForm();
  const [planes, setPlanes] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const [airports, setAirports] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const auth = useAuth();

  const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

  const formatTime = (time) => dayjs(time).format("HH:mm");

  const saveFlightData = async (values) => {
    try {
      const data = {
        departure_airport_id: airports.find(
          (ap) => ap.airport_name === values.departureAirport
        )?.airport_id,
        arrive_airport_id: airports.find(
          (ap) => ap.airport_name === values.arrivalAirport
        )?.airport_id,
        travel_time: formatTime(values.travelTime),
        distance: values.distance,
        plane_id: planes.find((p) => p.plane_name === values.plane)?.plane_id,
        airline_id: airlines.find((al) => al.airline_name === values.airline)
          ?.airline_id,
        data_lotu: formatDate(values.departureDateInput),
      };

      await axiosPrivate.post("/flight_register", data);
      // console.log(response.data);
      messageApi.open({
        type: "success",
        content: "Flight registered successfully",
      });
      form.resetFields();
    } catch (error) {
      console.error("Error registering flight:", error);
      messageApi.open({
        type: "error",
        content: "Error registering flight. Please try again.",
      });
    }
  };

  const handleClear = () => {
    form.resetFields();
  };

  useEffect(() => {
    const fetchPlanes = async () => {
      try {
        const response = await axiosPrivate.get("/planes");
        setPlanes(response.data);
      } catch (error) {
        console.error("Error fetching planes:", error);
      }
    };

    const fetchAirlines = async () => {
      try {
        const response = await axiosPrivate.get("/airlines");
        setAirlines(response.data);
      } catch (error) {
        console.error("Error fetching airlines:", error);
      }
    };

    const fetchAirports = async () => {
      try {
        const response = await axiosPrivate.get("/airports");
        setAirports(response.data);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };

    fetchPlanes();
    fetchAirlines();
    fetchAirports();
  }, [auth.auth]);

  const disablePastDates = (current) => {
    return current && current < dayjs().endOf("day");
  };

  return (
    <>
      <TopBar />
      {contextHolder}
      <div className={styles.mainBox}>
        <div className={`${styles.formContainer} ${styles.box}`}>
          <Form
            form={form}
            layout="vertical"
            onFinish={saveFlightData}
            //</div>  onFinishFailed={(errorInfo) => {
            //    console.log("Failed:", errorInfo);
            //   }}
          >
            <Form.Item
              name="departureAirport"
              label="Departure Airport"
              rules={[
                { required: true, message: "Please select departure airport" },
              ]}
            >
              <Select>
                {airports.map((airport) => (
                  <Select.Option
                    key={airport.airport_id}
                    value={airport.airport_name}
                  >
                    {airport.airport_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="arrivalAirport"
              label="Arrival Airport"
              rules={[
                { required: true, message: "Please select arrival airport" },
              ]}
            >
              <Select>
                {airports.map((airport) => (
                  <Select.Option
                    key={airport.airport_id}
                    value={airport.airport_name}
                  >
                    {airport.airport_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="departureDateInput"
              label="Departure Date"
              rules={[{ required: true, message: "Please select date" }]}
            >
              <DatePicker
                className={styles.inputContainer}
                format="DD-MM-YYYY"
                placeholder="Departure date"
                disabledDate={disablePastDates}
              />
            </Form.Item>

            <Form.Item
              name="distance"
              label="Distance"
              rules={[{ required: true, message: "Please enter distance" }]}
            >
              <InputNumber
                placeholder="Distance"
                className={styles.inputContainer}
              />
            </Form.Item>

            <Form.Item
              name="travelTime"
              label="Travel Time"
              rules={[{ required: true, message: "Please select time" }]}
            >
              <TimePicker
                className={styles.timePicker}
                format="HH:mm"
                placeholder="Travel Time"
              />
            </Form.Item>

            <Form.Item
              name="plane"
              label="Plane"
              rules={[{ required: true, message: "Please select plane" }]}
            >
              <Select>
                {planes.map((plane) => (
                  <Select.Option key={plane.plane_id} value={plane.plane_name}>
                    {plane.plane_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="airline"
              label="Airline"
              rules={[{ required: true, message: "Please select airline" }]}
            >
              <Select>
                {airlines.map((airline) => (
                  <Select.Option
                    key={airline.airline_id}
                    value={airline.airline_name}
                  >
                    {airline.airline_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                Add
              </Button>
              <Button type="default" onClick={handleClear}>
                Clear
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
}

export default NewFlight;
