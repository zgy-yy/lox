import { describe, test } from 'vitest';
import { runTest } from '../test-utils';

describe('For Loop Tests', () => {

    test('Basic For Loop', () => {
        runTest(`
            for (var i = 0; i < 3; i = i + 1) {
                print(i);
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('For Loop with Existing Variable', () => {
        runTest(`
            var i = 0;
            for (i = 0; i < 3; i = i + 1) {
                print(i);
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('For Loop without Initializer', () => {
        runTest(`
            var i = 0;
            for (; i < 2; i = i + 1) {
                print(i);
            }
            //OUTPUT:0
            //OUTPUT:1
        `);
    });

    test('For Loop without Increment', () => {
        runTest(`
            for (var i = 0; i < 3;) {
                print(i);
                i = i + 1;
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('Nested For Loops', () => {
        runTest(`
            for (var i = 0; i < 2; i = i + 1) {
                for (var j = 0; j < 2; j = j + 1) {
                    print(i + j);
                }
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('For Loop Scope', () => {
        runTest(`
            var i = "outer";
            for (var i = 0; i < 1; i = i + 1) {
                print(i);
            }
            //OUTPUT:0
            print(i); 
            //OUTPUT:outer
        `);
    });

    test('Complex Increment Expression', () => {
        runTest(`
            for (var i = 1; i < 10; i = i * 2) {
                print(i);
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:4
            //OUTPUT:8
        `);
    });

    test('Closure in For Loop', () => {
        // Testing if variable capture works correctly in loop (though we don't have functions yet fully tested here, 
        // block scoping is relevant).
        runTest(`
            var a = 0;
            for (var i = 0; i < 3; i = i + 1) {
                var b = i;
                a = a + b;
            }
            print(a); //OUTPUT:3
        `);
    });

    test('For Loop with Empty Body', () => {
        runTest(`
            var i = 0;
            for (; i < 3; i = i + 1);
            print(i); //OUTPUT:3
        `);
    });

    test('Loop Condition Evaluation Order', () => {
        // Ensures condition is evaluated before body
        runTest(`
            var i = 0;
            for (; i < 0; i = i + 1) {
                print("should not run");
            }
            print("done"); //OUTPUT:done
        `);
    });
    
    test('Shadowing in Loop Body', () => {
        runTest(`
            for (var i = 0; i < 2; i = i + 1) {
                var i = "shadow";
                print(i);
            }
            //OUTPUT:shadow
            //OUTPUT:shadow
        `);
    });
});
