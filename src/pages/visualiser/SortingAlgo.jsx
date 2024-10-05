import React, { useState, useEffect } from 'react';
import { bubbleSort } from './functions/sorting/bubbleSort.js';
import { quickSort } from './functions/sorting/quickSort.js';
import { insertionSort } from './functions/sorting/insertionSort.js';
import { selectionSort } from './functions/sorting/selectionSort.js';
import { mergeSort } from './functions/sorting/mergeSort.js';
import { heapSort } from './functions/sorting/heapSort.js';
import { shellSort } from './functions/sorting/shellSort.js';
import { timSort } from './functions/sorting/timSort.js';
import { radixSort } from './functions/sorting/radixSort.js';
import { bucketSort } from './functions/sorting/bucketSort.js';
const AVAILABLE_ALGORITHMS = {
    bubble: { name: 'Bubble Sort', color: 'rgba(59, 130, 246, 0.8)', borderColor: '#3b82f6' },
    quick: { name: 'Quick Sort', color: 'rgba(236, 72, 153, 0.8)', borderColor: '#ec4899' },
    insertion: { name: 'Insertion Sort', color: 'rgba(16, 185, 129, 0.8)', borderColor: '#10b981' },
    selection: { name: 'Selection Sort', color: 'rgba(245, 158, 11, 0.8)', borderColor: '#f59e0b' },
    merge: { name: 'Merge Sort', color: 'rgba(234, 88, 12, 0.8)', borderColor: '#ea580c' },
    heap: { name: 'Heap Sort', color: 'rgba(37, 99, 235, 0.8)', borderColor: '#2563eb' },
    shell: { name: 'Shell Sort', color: 'rgba(0, 123, 255, 0.8)', borderColor: '#007bff' },
    tim: { name: 'Tim Sort', color: 'rgba(255, 193, 7, 0.8)', borderColor: '#ffc107' },
    radix: { name: 'Radix Sort', color: 'rgba(128, 0, 128, 0.8)', borderColor: '#800080' },
    bucket: { name: 'Bucket Sort', color: 'rgba(255, 105, 180, 0.8)', borderColor: '#ff69b4' }
};

// Fixed array for sorting
const FIXED_ARRAY = [5, 35, 20, 80, 50, 90, 10, 60, 45, 70, 25, 15, 85, 30, 55, 95, 40, 75, 65, 100];

const SortingAlgo = () => {
    const [selectedAlgorithms, setSelectedAlgorithms] = useState(['bubble']);
    const [arrays, setArrays] = useState(() => {
        return { bubble: FIXED_ARRAY };
    });
    const [sorting, setSorting] = useState(false);
    const [showBars, setShowBars] = useState(true);

    useEffect(() => {
        const newArrays = {};
        selectedAlgorithms.forEach(algo => {
            newArrays[algo] = [...FIXED_ARRAY];  // Use the fixed array
        });
        setArrays(newArrays);
    }, [selectedAlgorithms]);

    const resetArrays = () => {
        const newArrays = {};
        selectedAlgorithms.forEach(algo => {
            newArrays[algo] = [...FIXED_ARRAY];  // Reset to the fixed array
        });
        setArrays(newArrays);
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const startSort = async () => {
        setSorting(true);
        try {
            await Promise.all(selectedAlgorithms.map(algo => sortArray(algo)));
        } catch (error) {
            console.error('Sorting error:', error);
        }
        setSorting(false);
    };
    const isArraySorted = (array) => {
        for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
                return false;
            }
        }
        return true;
    };
    const sortArray = async (algorithmKey) => {
        const currentArray = [...arrays[algorithmKey]];

        if (isArraySorted(currentArray)) {
            console.log(`${algorithmKey} array is already sorted!`);
            return;
        }

        const updateArrayState = (newArray) => {
            setArrays(prev => ({
                ...prev,
                [algorithmKey]: newArray
            }));
        };

        switch (algorithmKey) {
            case 'bubble':
                await bubbleSort(currentArray, updateArrayState, sleep);
                break;
            case 'quick':
                await quickSort(currentArray, 0, currentArray.length - 1, updateArrayState, sleep);
                break;
            case 'insertion':
                await insertionSort(currentArray, updateArrayState, sleep);
                break;
            case 'selection':
                await selectionSort(currentArray, updateArrayState, sleep);
                break;
            case 'merge':
                await mergeSort(currentArray, updateArrayState, sleep);
                break;
            case 'heap':
                await heapSort(currentArray, updateArrayState, sleep);
                break;
            case 'shell':
                await shellSort(currentArray, updateArrayState, sleep);
                break;
            case 'tim':
                await timSort(currentArray, updateArrayState, sleep);
                break;
            case 'radix':
                await radixSort(currentArray, updateArrayState, sleep);
                break;
            case 'bucket':
                await bucketSort(currentArray, updateArrayState, sleep);
                break;
            default:
                console.error('Unknown sorting algorithm');
        }
    };



    const toggleView = () => {
        setShowBars(!showBars);
    };

    const handleAlgorithmToggle = (algorithm) => {
        setSelectedAlgorithms(prev => {
            if (prev.includes(algorithm) && prev.length === 1) {
                return prev;
            }

            if (prev.includes(algorithm)) {
                return prev.filter(a => a !== algorithm);
            }
            return [...prev, algorithm];
        });
    };

    const renderArrayVisualization = (algorithmKey) => {
        const currentArray = arrays[algorithmKey];
        if (!currentArray) return null;

        const algorithmInfo = AVAILABLE_ALGORITHMS[algorithmKey];

        if (showBars) {
            return (
                <div style={{
                    display: 'flex',
                    height: '10rem',
                    alignItems: 'flex-end',
                }}>
                    {currentArray.map((value, index) => (
                        <div key={index} style={{
                            flex: 1,
                            backgroundColor: algorithmInfo.color,
                            marginRight: index < currentArray.length - 1 ? '2px' : '0',
                            height: `${value + 5}%`,
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }}>
                            {value}
                        </div>
                    ))}
                </div>
            );
        }

        return (
            <div style={{
                display: 'flex',
                border: `2px solid ${algorithmInfo.borderColor}`,
                borderRadius: '0.5rem',
                overflow: 'hidden',
                height: '4rem',
            }}>
                {currentArray.map((value, index) => (
                    <div key={index} style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRight: index < currentArray.length - 1 ? `1px solid ${algorithmInfo.borderColor}` : 'none',
                        backgroundColor: algorithmInfo.color.replace('0.8', value / 100),
                        color: value > 50 ? 'white' : 'black',
                        fontWeight: 'bold'
                    }}>
                        {value}
                    </div>
                ))}
            </div>
        );
    };
    const getGridStyle = () => {
        const count = selectedAlgorithms.length;
        return {
            display: 'grid',
            gridTemplateColumns: count > 9 ? 'repeat(4, 1fr)' : count > 6 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '2rem',
        };
    };
    

    return (
        <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Algorithm Comparison Visualizer</h1>

            <div style={{
                marginBottom: '1rem',
                padding: '1rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.5rem'
            }}>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 'bold' }}>Select Algorithms to Compare:</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {Object.entries(AVAILABLE_ALGORITHMS).map(([key, { name, color }]) => (
                        <label key={key} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            borderRadius: '0.25rem',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={selectedAlgorithms.includes(key)}
                                onChange={() => handleAlgorithmToggle(key)}
                                disabled={sorting || (selectedAlgorithms.length === 1 && selectedAlgorithms.includes(key))}
                            />
                            <span style={{
                                display: 'inline-block',
                                width: '1rem',
                                height: '1rem',
                                backgroundColor: color,
                                borderRadius: '0.25rem'
                            }}></span>
                            {name}
                        </label>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button
                    onClick={startSort}
                    disabled={sorting || selectedAlgorithms.length === 0}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        backgroundColor: selectedAlgorithms.length === 0 ? '#ccc' : '#3b82f6',
                        color: 'white',
                        border: 'none'
                    }}
                >
                    Start Sorting
                </button>
                <button
                    onClick={resetArrays}
                    disabled={sorting}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', backgroundColor: '#10b981', color: 'white', border: 'none' }}
                >
                    Reset Arrays
                </button>
                <button
                    onClick={toggleView}
                    style={{ padding: '0.5rem 1rem', borderRadius: '0.25rem', backgroundColor: '#f59e0b', color: 'white', border: 'none' }}
                >
                    Toggle View
                </button>
            </div>

            {/* Visualizations */}
            <div style={getGridStyle()}>
                {selectedAlgorithms.map((algo) => (
                    <div key={algo}>
                        <h3 style={{
                            marginBottom: '0.5rem',
                            color: AVAILABLE_ALGORITHMS[algo].borderColor,
                            fontWeight: 'bold'
                        }}>
                            {AVAILABLE_ALGORITHMS[algo].name}
                        </h3>
                        {renderArrayVisualization(algo)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SortingAlgo;