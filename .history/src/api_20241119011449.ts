import ColumnGeneratorWorker from "./columnGenerator.worker.ts?worker";
export function generateHeader(index: number) {
    const asciiFirstLetter = 65;
    const lettersCount = 26;
    let div = index + 1;
    let label = "";
    let pos;
    while (div > 0) {
      pos = (div - 1) % lettersCount;
      label = String.fromCharCode(asciiFirstLetter + pos) + label;
      div = parseInt(((div - pos) / lettersCount).toString(), 10);
    }
    return label;
  }
export const fetchData = async (rows: number) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/users?rows=${rows}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    const colsNumber = 100;

    return new Promise((resolve, reject) => {
      // Initialize the worker
      const worker = new ColumnGeneratorWorker();

      worker.onmessage = (event) => {
        resolve(event.data);
        worker.terminate(); // Cleanup
      };

      worker.onerror = (error) => {
        console.error("Worker error:", error);
        reject(error);
      };

      // Send data to the worker
      worker.postMessage({ rows: data, colsNumber });
    });
  } catch (error) {
    console.error("Error fetching data for Handsontable:", error);
  }
};
