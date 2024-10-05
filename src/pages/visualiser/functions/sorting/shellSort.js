export const shellSort = async (array, updateArrayState, sleep) => {
    const n = array.length;
    let gap = Math.floor(n / 2);

    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j = i;

            while (j >= gap && array[j - gap] > temp) {
                array[j] = array[j - gap];
                j -= gap;
            }
            array[j] = temp;

            // Update the visualization state after each inner loop iteration
            await sleep(100); // Delay for visualization
            updateArrayState([...array]);
        }
        gap = Math.floor(gap / 2);
    }
};
