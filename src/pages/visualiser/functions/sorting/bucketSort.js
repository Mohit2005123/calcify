export const bucketSort = async (arr, updateArrayState, sleep) => {
    const bucket = [];

    // Create empty buckets
    for (let i = 0; i < arr.length; i++) {
        bucket[i] = [];
    }

    // Distribute input array values into buckets
    for (let i = 0; i < arr.length; i++) {
        const index = Math.floor(arr[i] / 10); // Assuming range is 0-100
        bucket[index].push(arr[i]);
    }

    // Sort each bucket and put them back into arr
    const sortedArray = [];
    for (let i = 0; i < bucket.length; i++) {
        if (bucket[i].length) {
            bucket[i].sort((a, b) => a - b);
            for (let j = 0; j < bucket[i].length; j++) {
                sortedArray.push(bucket[i][j]);
                await sleep(100); // Visualization delay
                updateArrayState(sortedArray);
            }
        }
    }
    
    for (let i = 0; i < sortedArray.length; i++) {
        arr[i] = sortedArray[i];
    }
    updateArrayState(arr);
};
