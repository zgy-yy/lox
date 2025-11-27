import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('If Statement Tests', () => {

    test('Basic If Statement', () => {
        runTest(`
            if (true) print("yes"); //OUTPUT:yes
            if (false) print("no");
        `);
    });

    test('If Else Statement', () => {
        runTest(`
            if (true) {
                print("yes"); //OUTPUT:yes
            } else {
                print("no");
            }

            if (false) {
                print("yes");
            } else {
                print("no"); //OUTPUT:no
            }
        `);
    });

    test('Truthy and Falsy', () => {
        runTest(`
            if (1) print("yes"); //OUTPUT:yes
            if (0) print("yes"); //OUTPUT:yes
            if (null) print("no"); 
            if ("") print("yes"); //OUTPUT:yes
        `);
    });

    test('Nested If Statements', () => {
        runTest(`
            var a = 1;
            if (a == 1) {
                print("level 1"); //OUTPUT:level 1
                if (a > 0) {
                    print("level 2"); //OUTPUT:level 2
                }
            }
        `);
    });

    test('Dangling Else', () => {
        runTest(`
            if (true) if (false) print("wrong"); else print("correct"); //OUTPUT:correct
            if (true) if (true) print("inner"); else print("wrong"); //OUTPUT:inner
        `);
    });

    test('If with Logical Operators', () => {
        runTest(`
            if (true && true) print("both true"); //OUTPUT:both true
            if (true && false) print("one false"); 
            if (false || true) print("one true"); //OUTPUT:one true
            
            var a = 5;
            if (a > 0 && a < 10) print("in range"); //OUTPUT:in range
            if (a < 0 || a > 10) print("out of range"); else print("in range again"); //OUTPUT:in range again
        `);
    });
});
