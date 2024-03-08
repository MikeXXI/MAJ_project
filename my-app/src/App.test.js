import { queryByTestId, render, screen } from "@testing-library/react";
import { toBeInTheDocument } from "@testing-library/jest-dom/extend-expect"; // Import the toBeInTheDocument function
import App from "./App";

describe(" App Component Tests", () => {
  it("renders the App component", () => {
    render(<App />);
    const title = screen.getByText(/Users manager/i);
    expect(title).toBeInTheDocument();
    expect(screen.queryByTestId("title")).toBeInTheDocument(); 
  });
});
