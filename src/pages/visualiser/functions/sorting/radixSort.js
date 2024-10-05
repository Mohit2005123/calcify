export const radixSort = async (arr, updateArrayState, sleep) => {
    const getMax = (array) => Math.max(...array);
    
    const countingSort = async (array, exp) => {
        const output = new Array(array.length);
        const count = new Array(10).fill(0);
        
        // Count occurrences
        for (let i = 0; i < array.length; i++) {
            const index = Math.floor(array[i] / exp) % 10;
            count[index]++;
        }
        
        // Change count[i] so that it contains actual position of this digit in output[]
        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        // Build output array
        for (let i = array.length - 1; i >= 0; i--) {
            const index = Math.floor(array[i] / exp) % 10;
            output[count[index] - 1] = array[i];
            count[index]--;
            await sleep(100); // Visualization delay
            updateArrayState(output);
        }

        // Copy output array to arr[] so that arr[] now contains sorted numbers
        for (let i = 0; i < array.length; i++) {
            array[i] = output[i];
        }
    };

    const sort = async (array) => {
        const max = getMax(array);
        for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
            await countingSort(array, exp);
        }
        updateArrayState(array);
    };

    await sort(arr);
};
