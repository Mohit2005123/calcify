export const insertionSort = async (arr, updateArrayState, sleep) => {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
  
      // Move elements of arr[0..i-1], that are greater than key, to one position ahead of their current position
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
  
        // Update the array state with the current state of the array
        updateArrayState([...arr]);
        await sleep(100); // Sleep to visualize the sorting
      }
      arr[j + 1] = key;
  
      // Update the array state after inserting the key
      updateArrayState([...arr]);
      await sleep(100); // Sleep to visualize the sorting
    }
  };
  