import GetStarted from "@/components/custom/dashboard/get-started/GetStarted";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Clarity - Get Started",
};

export default function GetStartedPage() {
  return <GetStarted />;
}
