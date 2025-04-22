/* eslint-disable @typescript-eslint/no-explicit-any */
import { PaletteKeyType } from "@/styles";
import { ReactNode } from "react";
import { Header } from "../header";

export class Builder<T> {
  options: Header<T>;

  constructor() {
    this.options = {
      key: "",
      name: "",
    };
  }

  public build() {
    return this.options;
  }

  public key(key: string) {
    this.options = {
      ...this.options,
      key,
    };
    return this;
  }

  public name(name: string) {
    this.options = {
      ...this.options,
      name,
    };
    return this;
  }

  public themeMode(themeMode: string) {
    const themeModeValue = themeMode !== "dark" ? "light" : "dark";
    this.options = {
      ...this.options,
      themeMode: themeModeValue,
    };
    return this;
  }

  public colorName(colorName: PaletteKeyType) {
    this.options = {
      ...this.options,
      colorName,
    };
    return this;
  }

  public width(width: string | number) {
    const widthValue = typeof width === "number" ? `${width}px` : width;
    this.options = {
      ...this.options,
      width: widthValue,
    };
    return this;
  }

  public headerAlign(headerAlign: "left" | "center" | "right") {
    this.options = {
      ...this.options,
      headerAlign: headerAlign,
    };
    return this;
  }

  public align(align: "left" | "center" | "right") {
    this.options = {
      ...this.options,
      align: align,
    };
    return this;
  }

  public flex(flex: boolean) {
    this.options = {
      ...this.options,
      flex,
    };
    return this;
  }

  public tooltip(tooltip: ReactNode | string) {
    this.options = {
      ...this.options,
      tooltip,
    };
    return this;
  }

  public sort() {
    this.options = {
      ...this.options,
      sort: true,
    };
    return this;
  }

  public className(className: string) {
    this.options = {
      ...this.options,
      itemClassName: className,
    };
    return this;
  }

  public renderOption(renderOption: (value: any, data: T) => React.ReactNode) {
    this.options = {
      ...this.options,
      renderOption,
    };
    return this;
  }

  public static builder<T>(): Builder<T> {
    return new Builder<T>();
  }
}
