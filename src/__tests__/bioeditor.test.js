import React from "react";
import App from "../app.js";
import BioEditor from "../bioeditor.js";
import axios from "../axios";
import { render, waitForElement, fireEvent } from "@testing-library/react";

jest.mock("../axios");

test("When no bio is passed to it, an Add button is rendered", () => {
    const { container } = render(<BioEditor bio={null} />);
    const button = container.querySelector("button");
    expect(button.innerHTML).toContain("ADD A BIO");
});

test("When a bio is passed to it, an Edit button is rendered.", () => {
    const { container } = render(<BioEditor bio="myBio" />);
    const button = container.querySelector("button");
    expect(button.innerHTML).toContain("EDIT YOUR BIO");
});

test("OnClick of an Add or Edit button causes a textarea to be rendered", () => {
    const onClick = jest.fn();
    const { container } = render(<BioEditor submitClick={onClick} />);
    const button = container.querySelector("button");
    fireEvent.click(button);
    expect(container.innerHTML).toContain("textarea");
});
