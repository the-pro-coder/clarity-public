"use client";
import { Fragment } from "react/jsx-runtime";
import { useTheme } from "next-themes";

export default function SetTheme({ theme = "system" }) {
  const { setTheme } = useTheme();
  setTheme(theme);
  return <Fragment></Fragment>;
}
