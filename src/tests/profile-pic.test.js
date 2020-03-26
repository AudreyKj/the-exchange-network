import React from "react";
import ProfilePic from "../profilepic.js";
import { render, fireEvent } from "@testing-library/react";

test("renders default image when there is no url prop", () => {
    const { container } = render(<ProfilePic />);
    const image = container.querySelector("img");
    expect(image.src).toContain("/default-user-avatar.png");
});

test("renders image with specified url prop", () => {
    const { container } = render(<ProfilePic url="/some-url.gif" />);
    const image = container.querySelector("img");
    expect(image.src).toContain("/some-url.gif");
});

test("renders image with first and last props in alt", () => {
    const { container } = render(<ProfilePic first="audrey" last="audrey" />);
    expect(container.querySelector("img").alt).toContain("audrey audrey");
});

test("onClick prop gets called when img is called", () => {
    const onClick = jest.fn();
    const { container } = render(<ProfilePic toggleModal={onClick} />);
    const img = container.querySelector("img");
    fireEvent.click(img);
    expect(onClick.mock.calls.length).toBe(1);
});
