export const heapSort = async (arr, updateArrayState, sleep) => {
    const heapify = async (arr, n, i) => {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < n && arr[left] > arr[largest]) {
            largest = left;
        }
        if (right < n && arr[right] > arr[largest]) {
            largest = right;
        }

        if (largest !== i) {
            [arr[i], arr[largest]] = [arr[largest], arr[i]];  // Swap
            await sleep(100);
            updateArrayState([...arr]);
            await heapify(arr, n, largest);
        }
    };

    const n = arr.length;

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(arr, n, i);
    }

    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        await sleep(100);
        updateArrayState([...arr]);
        await heapify(arr, i, 0);
    }
};
