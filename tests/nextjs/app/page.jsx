import { Excluded, Forwarded } from "../components/ui/button";
import Client from "../components/client";

export default function Page() {
  return (
    <main id="host">
      <span id="nested">Next.js 16.4.2</span>
      <div id="existing" data-source="manual" data-origin="manual" />
      <Excluded />
      <Forwarded />
      <Client />
    </main>
  );
}
