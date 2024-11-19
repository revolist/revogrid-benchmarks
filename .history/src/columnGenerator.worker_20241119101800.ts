// columnGenerator.worker.ts
function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

self.onmessage = (event) => {
  const { rowsNumber, colsNumber } = event.data;
  const updatedRows = (new Array(rowsNumber)).map((row: Record<string, any>) => {
    const newRow = { ...row };
    for (let j = 0; j < colsNumber; j++) {
      newRow[j] = getRandomArbitrary(0, 10000);
    }
    return newRow;
  });

  // Send the updated rows back to the main thread
  self.postMessage(updatedRows);
};
