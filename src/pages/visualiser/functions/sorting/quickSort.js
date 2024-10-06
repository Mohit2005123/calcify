export const quickSort = async (array, low, high, setArray, sleep) => {
    if (low < high) {
      let pi = await partition(array, low, high, setArray, sleep);
      await quickSort(array, low, pi - 1, setArray, sleep);
      await quickSort(array, pi + 1, high, setArray, sleep);
    }
  };
  
  const partition = async (arr, low, high, setArray, sleep) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(200);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(200);
    return i + 1;
  };
  