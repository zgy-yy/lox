import { expect, vi } from 'vitest';
import { Grus } from '@/Grus';

export const runTest = (source: string) => {
    // 1. Extract expectations from source comments
    const expectedOutputs: string[] = [];
    const lines = source.split('\n');
    // Regex to capture content after //OUTPUT:
    const outputRegex = /\/\/OUTPUT:\s*(.*)/;

    for (const line of lines) {
        const match = line.match(outputRegex);
        if (match) {
            // Trim to ignore extra whitespace around the expected value
            expectedOutputs.push(match[1].trim());
        }
    }

    // Capture console.log
    const logSpy = vi.spyOn(console, 'log')

    try {
        // 2. Parse and Execute using Grus
        const reportError = vi.fn();
        const grus = new Grus(source, reportError);
        
        grus.run();

        // Expect no errors (scanner, parser, resolver, or interpreter errors)
        if (reportError.mock.calls.length > 0) {
            // Optionally print errors for debugging
            console.error('Errors:', reportError.mock.calls);
        }
        expect(reportError).not.toHaveBeenCalled();

        // 3. Verify Output
        const actualOutputs = logSpy.mock.calls.map((args: any[]) => String(args[0]));
        
        // Verify that actual outputs match expected outputs
        expect(actualOutputs).toEqual(expectedOutputs);
    } finally {
        logSpy.mockRestore();
    }
};

