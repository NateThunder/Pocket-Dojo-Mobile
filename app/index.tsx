import { Redirect } from "expo-router";

export default function RootIndex() {
  // Redirect the root path to the Flow Trainer tab
  return <Redirect href="/flow-trainer" />;
}
