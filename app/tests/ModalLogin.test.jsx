import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import ModalLogin from "../src/pages/User/HomeScreen/Modal/ModalLogin";
import useAuth from "../src/hooks/useAuth";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "../src/axiosInstance";
import { message } from "antd";
import { jwtDecode } from "jwt-decode";

vi.mock("react-router-dom", () => ({
    ...require("react-router-dom"),
    useNavigate: () => vi.fn(),
}));

vi.mock("../src/hooks/useAuth");
vi.mock("../src/axiosInstance");
vi.mock("jwt-decode");

const mockNavigate = vi.fn();
const mockSetAuth = vi.fn();
const mockSetModal = vi.fn();
const mockMessage = { open: vi.fn() };

useAuth.mockReturnValue({
  setAuth: mockSetAuth,
  setModal: mockSetModal,
});

message.useMessage = () => [mockMessage, <div />];

beforeEach(() => {
    global.localStorage = {
        setItem: vi.fn(),
        getItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    };
});

describe("ModalLogin Component", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });


test("displays error message if email and password are empty", () => {
    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Please fill out the email and password fields.",
    });
  });

  test("displays error message if email is empty", () => {
    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Email is required.",
    });
  });

  test("displays error message if password is empty", () => {
    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Password Cannot be empty",
    });
  });

  test("displays error message if email format is invalid", () => {
    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    expect(mockMessage.open).toHaveBeenCalledWith({
      type: "error",
      content: "Invalid email format. Please try again.",
    });
  });

  test("handles successful login", async () => {
    const mockAccessToken = "access_token";
    const mockRefreshToken = "refresh_token";
    const mockDecodedToken = {
      roles: ["user"],
      name: "John",
      surname: "Doe",
    };

    axios.post.mockResolvedValue({
        data: {
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken,
        },
    });

    jwtDecode.mockReturnValue(mockDecodedToken);

    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    await waitFor(() => {
        expect(mockSetAuth).toHaveBeenCalledWith({
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
          roles: mockDecodedToken.roles,
          username: `${mockDecodedToken.name} ${mockDecodedToken.surname}`,
        });
      });
  
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "authData",
        JSON.stringify({
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
          roles: mockDecodedToken.roles,
          username: `${mockDecodedToken.name} ${mockDecodedToken.surname}`,
        })
      );
      expect(mockSetModal).toHaveBeenCalledWith(false);
      expect(screen.getByText("Login successful!")).toBeInTheDocument();
    });

  test("handles login failure", async () => {
    axios.post.mockRejectedValue(new Error("Login failed"));

    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByDisplayValue("Sign in"));

    await waitFor(() => {
      expect(mockMessage.open).toHaveBeenCalledWith({
        type: "error",
        content: "Login failed. Please try again.",
      });
    });
  });

  test("handles Google login", () => {
    delete window.location;
    window.location = { href: "" };

    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={() => {}} />
      </Router>
    );

    fireEvent.click(screen.getByAltText("Logo"));

    expect(window.location.href).toBe("http://localhost:5000/login/google");
  });

  test("toggles modal on close button click", () => {
    const toggleModal = vi.fn();

    render(
      <Router>
        <ModalLogin toggleModal={toggleModal} setLogin={() => {}} />
      </Router>
    );

    const closeButton = document.querySelector('.close-modal');
    fireEvent.click(closeButton);

    expect(toggleModal).toHaveBeenCalled();
  });

  test("switches to register modal on link click", () => {
    const setLogin = vi.fn();

    render(
      <Router>
        <ModalLogin toggleModal={() => {}} setLogin={setLogin} />
      </Router>
    );

    fireEvent.click(screen.getByText("Register now"));

    expect(setLogin).toHaveBeenCalledWith(false);
  });
});