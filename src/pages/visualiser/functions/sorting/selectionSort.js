export const selectionSort = async (arr, updateArrayState, sleep) => {
    let n = arr.length;
  
    for (let i = 0; i < n - 1; i++) {
      // Find the minimum element in the unsorted part of the array
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
  
      // Swap the found minimum element with the first element
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
      }
  
      // Update the array state with the current state of the array
      updateArrayState([...arr]);
      await sleep(100); // Sleep to visualize the sorting
    }
  };
  