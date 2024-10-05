export const mergeSort = async (arr, updateArrayState, sleep) => {
    const merge = async (left, right) => {
        let result = [], leftIndex = 0, rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex] < right[rightIndex]) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }

        await sleep(100);  // Control the speed of sorting
        const newArray = result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        updateArrayState(newArray);
        return newArray;
    };

    const divide = async (arr) => {
        if (arr.length <= 1) return arr;
        const middle = Math.floor(arr.length / 2);
        const left = await divide(arr.slice(0, middle));
        const right = await divide(arr.slice(middle));

        return merge(left, right);
    };

    await divide(arr);
};
