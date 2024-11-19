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
export const fetchData = async (rowsNumber: number, colsNumber: number) => {
  try {
    return new Promise<any[]>((resolve, reject) => {
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
      worker.postMessage({ rowsNumber, colsNumber });
    });
  } catch (error) {
    console.error("Error fetching data for Handsontable:", error);
    throw error;
  }
};
