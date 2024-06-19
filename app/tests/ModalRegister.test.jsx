import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import ModalRegister from "../src/pages/User/HomeScreen/Modal/ModalRegister";
import useAuth from "../src/hooks/useAuth";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "../src/axiosInstance";
import { message } from "antd";

vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

vi.mock("../src/hooks/useAuth");
vi.mock("../src/axiosInstance");

const mockSetAuth = vi.fn();
const mockSetModal = vi.fn();
const mockMessage = { open: vi.fn() };

useAuth.mockReturnValue({
  setAuth: mockSetAuth,
  setModal: mockSetModal,
});

message.useMessage = () => [mockMessage, <div />];

describe("ModalRegister Component", () => {
  beforeEach(() => {
    global.localStorage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("displays error message if name is empty", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter your name.",
    });
  });

  test("displays error message if last name is empty", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter your last name.",
    });
  });

  test("displays error message if phone number is empty", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter your phone number.",
    });
  });

  test("displays error message if email is empty", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "123456789" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter your email.",
    });
  });

  test("displays error message if password is empty", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter your password.",
    });
  });

  test("displays error message if passwords do not match", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "Password124!" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Passwords do not match.",
    });
  });

  test("displays error message for invalid email format", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter a valid email address.",
    });
  });

  test("displays error message for invalid phone number format", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "12345" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "Password123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "Password123!" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please enter a valid 9-digit phone number.",
    });
  });

  test("displays error message for invalid password format", () => {
    render(
      <Router>
        <ModalRegister toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("First name"), {
      target: { value: "John" },
    });
    fireEvent.change(screen.getByPlaceholderText("Last name"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone number"), {
      target: { value: "123456789" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign up"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Password must contain at least one uppercase letter.",
    });
  });

  test("toggles modal on close button click", () => {
    const toggleModal = vi.fn();

    render(
      <Router>
        <ModalRegister toggleModal={toggleModal} setLogin={() => {}} />
      </Router>
    );

    const closeButton = document.querySelector(".close-modal");
    fireEvent.click(closeButton);

    expect(toggleModal).toHaveBeenCalled();
  });
});
