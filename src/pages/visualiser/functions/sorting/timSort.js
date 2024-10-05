const insertionSort = async(array, left, right, updateArrayState, sleep) => {
    for (let i = left + 1; i <= right; i++) {
        const key = array[i];
        let j = i - 1;

        while (j >= left && array[j] > key) {
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;

        // Update the visualization state after each insertion step
        await sleep(100); // Delay for visualization
        updateArrayState([...array]);
    }
};

export const timSort = async (array, updateArrayState, sleep) => {
    const n = array.length;
    const minRun = 32;

    // Sort individual subarrays of size RUN
    for (let start = 0; start < n; start += minRun) {
        const end = Math.min(start + minRun - 1, n - 1);
        await insertionSort(array, start, end, updateArrayState, sleep);
    }

    // Start merging from size minRun (or 32). It will merge
    // to form size 64, then 128, 256, etc.
    let size = minRun;
    while (size < n) {
        for (let left = 0; left < n; left += size * 2) {
            const mid = left + size - 1;
            const right = Math.min((left + 2 * size - 1), (n - 1));

            if (mid < right) {
                // Merge the subarrays
                await merge(array, left, mid, right, updateArrayState, sleep);
            }
        }
        size *= 2;
    }
};

const merge = async (array, left, mid, right, updateArrayState, sleep) => {
    const leftArray = array.slice(left, mid + 1);
    const rightArray = array.slice(mid + 1, right + 1);

    let i = 0; 
    let j = 0; 
    let k = left;

    while (i < leftArray.length && j < rightArray.length) {
        if (leftArray[i] <= rightArray[j]) {
            array[k++] = leftArray[i++];
        } else {
            array[k++] = rightArray[j++];
        }
        // Update the visualization state after each merge step
        await sleep(100); // Delay for visualization
        updateArrayState([...array]);
    }

    while (i < leftArray.length) {
        array[k++] = leftArray[i++];
        // Update the visualization state after each merge step
        await sleep(100); // Delay for visualization
        updateArrayState([...array]);
    }

    while (j < rightArray.length) {
        array[k++] = rightArray[j++];
        // Update the visualization state after each merge step
        await sleep(100); // Delay for visualization
        updateArrayState([...array]);
    }
};
