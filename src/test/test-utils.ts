import { expect, vi } from 'vitest';
import { Scanner } from '@/parser/Scanner';
import { Parser } from '@/parser/Parser';
import { Interpreter } from '@/execute/Interperter';

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
        // 2. Parse and Execute
        const errorHandler = vi.fn();
        const scanner = new Scanner(source, errorHandler);
        const tokens = scanner.scanTokens();
        const parser = new Parser(tokens, errorHandler);
        const statements = parser.parse();

        // Expect no parse errors
        if (errorHandler.mock.calls.length > 0) {
             // Optionally print parsing errors for debugging
             console.error('Parse errors:', errorHandler.mock.calls);
        }
        expect(errorHandler).not.toHaveBeenCalled();

        if (statements) {
            const runtimeErrorHandler = vi.fn();
            const interpreter = new Interpreter(runtimeErrorHandler);
            
            interpreter.interpret(statements);

            // Expect no runtime errors
            expect(runtimeErrorHandler).not.toHaveBeenCalled();
        }

        // 3. Verify Output
        const actualOutputs = logSpy.mock.calls.map((args: any[]) => String(args[0]));
        
        // Verify that actual outputs match expected outputs
        expect(actualOutputs).toEqual(expectedOutputs);
    } finally {
        logSpy.mockRestore();
    }
};

