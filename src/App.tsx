import { useState } from "react";
import CameraScanner from "./CameraScanner";

function App() {
  const [text, setText] = useState("");

  return (
    <div style={{ padding: 20 }}>
      <h1>Barcode Camera Test</h1>

      <CameraScanner onScan={setText} />

      <h2>Result:</h2>
      <input
        value={text}
        readOnly
        style={{ width: "100%", padding: 10, fontSize: 18 }}
      />
    </div>
  );
}

export default App;
