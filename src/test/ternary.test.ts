import { describe, test } from 'vitest';
import { runTest } from './test-utils';

describe('Conditional (Ternary) Operator Tests', () => {

    test('Basic Ternary Operation', () => {
        runTest(`
            print true ? "yes" : "no"; //OUTPUT:yes
            print false ? "yes" : "no"; //OUTPUT:no
        `);
    });

    test('Evaluation with Expressions', () => {
        runTest(`
            print 1 < 2 ? 10 : 20; //OUTPUT:10
            print 1 > 2 ? 10 : 20; //OUTPUT:20
            print (1 + 1 == 2) ? "math works" : "math broken"; //OUTPUT:math works
        `);
    });

    test('Nested Ternary Operators', () => {
        // Right-associative: a ? b : c ? d : e  =>  a ? b : (c ? d : e)
        runTest(`
            print true ? 1 : true ? 2 : 3; //OUTPUT:1
            print false ? 1 : true ? 2 : 3; //OUTPUT:2
            print false ? 1 : false ? 2 : 3; //OUTPUT:3
        `);
    });

    test('Precedence with Logic Operators', () => {
        // Precedence: || < && < ?: < =
        // logic_or ? expression : conditional
        // This means logic operators bind tighter than ternary
        runTest(`
            print true || false ? "or wins" : "ternary wins"; //OUTPUT:or wins
            print false || false ? "or wins" : "ternary wins"; //OUTPUT:ternary wins
        `);
    });

    test('Precedence with Assignment', () => {
        // Assignment has lower precedence than ternary: a = b ? c : d  =>  a = (b ? c : d)
        runTest(`
            var a;
            a = true ? 100 : 200;
            print a; //OUTPUT:100
            
            a = false ? 100 : 200;
            print a; //OUTPUT:200
        `);
    });
    
    test('Side Effects in Branches', () => {
        // Verify that only the executed branch produces side effects
        runTest(`
             var a = 0;
             var b = 0;
             true ? (a = 1) : (b = 1);
             print a; //OUTPUT:1
             print b; //OUTPUT:0
             
             false ? (a = 2) : (b = 2);
             print a; //OUTPUT:1
             print b; //OUTPUT:2
        `);
    });
});

