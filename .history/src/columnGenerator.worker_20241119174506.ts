// columnGenerator.worker.ts
function getRandomArbitrary(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

self.onmessage = (event) => {
  const { rowsNumber, colsNumber, isRowArray } = event.data;
  const updatedRows: any[] = [];

  let row: any = isRowArray ? [] : {};
  for (let j = 0; j < colsNumber; j++) {
    row[j] = getRandomArbitrary(0, 10000);
  }

  for (let i = 0; i < rowsNumber; i++) {
    updatedRows.push(isRowArray ? [...row] : {...row});
  }

  // Send the updated rows back to the main thread
  self.postMessage(updatedRows);
};
