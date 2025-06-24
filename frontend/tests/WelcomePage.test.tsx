import { render, screen, fireEvent, act } from "@testing-library/react";
import WelcomePage from "../pages/WelcomePage";

const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

// chatroom empty, nickname empty, both empty, special chars in nickname, special chars in chatroom id
// both valid

describe("WelcomePage", () => {
  test("renders without crashing", () => {
    render(<WelcomePage />);
    expect(screen.getByPlaceholderText(/nickname/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/chatroom id/i)).toBeInTheDocument();
  });

  test("does not submit if nickname is empty", () => {
    render(<WelcomePage />);
    fireEvent.change(screen.getByPlaceholderText(/chatroom id/i), {
      target: { value: "room1" },
    });
    fireEvent.click(screen.getByText(/submit/i));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Information is empty or not alphanumeric"
    );
  });
  test("does not submit if chatroom id is empty", () => {
    render(<WelcomePage />);
    fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
      target: { value: "beaverthelever" },
    });
    fireEvent.click(screen.getByText(/submit/i));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Information is empty or not alphanumeric"
    );
  });
  test("does not submit if both (nickname and chatroom id) are empty", () => {
    render(<WelcomePage />);
    fireEvent.click(screen.getByText(/submit/i));
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Information is empty or not alphanumeric"
    );
  });

  test("does submit if both are valid", () => {
    render(<WelcomePage />);
    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
        target: { value: "beaverthelever" },
      });
      fireEvent.change(screen.getByPlaceholderText(/chatroom id/i), {
        target: { value: "room1" },
      });
    });
    fireEvent.click(screen.getByText(/submit/i));
    expect(consoleLogSpy).toHaveBeenCalledWith("beaverthelever", "room1");
  });

  test("does not submit if there are special characters in nickname", () => {
    render(<WelcomePage />);
    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
        target: { value: "beaver@lever" },
      });
      fireEvent.change(screen.getByPlaceholderText(/chatroom id/i), {
        target: { value: "room1" },
      });
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Information is empty or not alphanumeric"
    );
  });

  test("does not submit if there are special characters in chatroom", () => {
    render(<WelcomePage />);
    act(() => {
      fireEvent.change(screen.getByPlaceholderText(/nickname/i), {
        target: { value: "beaverthelever" },
      });
      fireEvent.change(screen.getByPlaceholderText(/chatroom id/i), {
        target: { value: "room1!" },
      });
    });
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Information is empty or not alphanumeric"
    );
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });
});
