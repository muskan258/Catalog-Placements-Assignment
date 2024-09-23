const fs = require('fs');

// Helper function to decode y values
function decodeValue(value, base) {
    return parseInt(value, base);
}

// Function to read the JSON input
function readInput(file) {
    const data = fs.readFileSync(file);
    return JSON.parse(data);
}

// Lagrange interpolation to solve for the polynomial
function lagrangeInterpolation(points) {
    let constantTerm = 0;
    const k = points.length;

    for (let i = 0; i < k; i++) {
        let term = points[i].y;
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                term *= points[j].x / (points[j].x - points[i].x);
            }
        }
        constantTerm += term;
    }

    return constantTerm;
}

// Main function to solve for the constant term from multiple JSON files
function findSecret(files) {
    files.forEach(file => {
        try {
            const input = readInput(file);
            const points = [];
            const n = input.keys.n;
            const k = input.keys.k;

            // Decode all the (x, y) points
            for (let i = 1; i <= n; i++) {
                const entry = input[i.toString()];
                
                // Ensure entry, value, and base are valid
                if (!entry || !entry.value || !entry.base) {
                    console.error(`Invalid entry for key "${i}" in file "${file}"`);
                    continue;
                }

                const x = parseInt(i);
                const y = decodeValue(entry.value, entry.base);
                points.push({ x, y });
            }

            // Use Lagrange interpolation to find the polynomial's constant term
            const secret = lagrangeInterpolation(points.slice(0, k)); // Using k points to solve

            console.log(`The constant term (secret) for ${file} is:`, secret);
        } catch (err) {
            console.error(`Error reading or parsing file "${file}":`, err.message);
        }
    });
}

// Call the function with an array of file paths
findSecret(['testcase1.json', 'testcase2.json']); // Example usage with two JSON files
