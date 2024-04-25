import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./App";

describe(" App Component Tests", () => {
  it("renders the App component", () => {
    render(<App />);
    const title = screen.getByText(/GESTION DES UTILISATEURS/i);
    expect(title).toBeInTheDocument();
  });
});
