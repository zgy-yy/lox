import { describe, test } from 'vitest';
import { runTest } from '../test-utils';

describe('Expression Tests', () => {

    describe('Primary Expressions', () => {
        test('Number Literals', () => {
            runTest(`
                print 42; //OUTPUT:42
                print 3.14; //OUTPUT:3.14
                print -0; //OUTPUT:0
            `);
        });

        test('String Literals', () => {
            runTest(`
                print "hello"; //OUTPUT:hello
                print "world"; //OUTPUT:world
                print ""; //OUTPUT:
            `);
        });

        test('Boolean Literals', () => {
            runTest(`
                print true; //OUTPUT:true
                print false; //OUTPUT:false
            `);
        });

        test('Nil Literal', () => {
            runTest(`
                print nil; //OUTPUT:nil
            `);
        });

        test('Variable Expressions', () => {
            runTest(`
                var a = 10;
                print a; //OUTPUT:10
                var b = "test";
                print b; //OUTPUT:test
            `);
        });

        test('Grouping Expressions', () => {
            runTest(`
                print (1 + 2) * 3; //OUTPUT:9
                print (2 + 3) * (4 + 5); //OUTPUT:45
                print ((1)); //OUTPUT:1
            `);
        });
    });

    describe('Unary Expressions', () => {
        test('Logical Not', () => {
            runTest(`
                print !true; //OUTPUT:false
                print !false; //OUTPUT:true
                print !nil; //OUTPUT:true
                print !0; //OUTPUT:true
            `);
        });

        test('Negation', () => {
            runTest(`
                print -5; //OUTPUT:-5
                print -(-5); //OUTPUT:5
                print -(1 + 2); //OUTPUT:-3
            `);
        });

        test('Bitwise Not', () => {
            runTest(`
                print ~0; //OUTPUT:-1
                print ~1; //OUTPUT:-2
                print ~(-1); //OUTPUT:0
            `);
        });

        test('Prefix Increment', () => {
            runTest(`
                var a = 5;
                print ++a; //OUTPUT:6
                print a; //OUTPUT:6
            `);
        });

        test('Prefix Decrement', () => {
            runTest(`
                var a = 5;
                print --a; //OUTPUT:4
                print a; //OUTPUT:4
            `);
        });

        test('Multiple Unary Operators', () => {
            runTest(`
                print !!true; //OUTPUT:true
                print - -5; //OUTPUT:5
                print -(-5); //OUTPUT:5
            `);
        });
    });

    describe('Postfix Expressions', () => {
        test('Postfix Increment', () => {
            runTest(`
                var a = 5;
                print a++; //OUTPUT:5
                print a; //OUTPUT:6
            `);
        });

        test('Postfix Decrement', () => {
            runTest(`
                var a = 5;
                print a--; //OUTPUT:5
                print a; //OUTPUT:4
            `);
        });
    });

    describe('Factor Expressions (Multiplication, Division, Modulo)', () => {
        test('Multiplication', () => {
            runTest(`
                print 2 * 3; //OUTPUT:6
                print 4 * 5 * 2; //OUTPUT:40
                print -2 * 3; //OUTPUT:-6
            `);
        });

        test('Division', () => {
            runTest(`
                print 10 / 2; //OUTPUT:5
                print 15 / 3 / 2; //OUTPUT:2.5
                print 7 / 2; //OUTPUT:3.5
            `);
        });

        test('Modulo', () => {
            runTest(`
                print 10 % 3; //OUTPUT:1
                print 15 % 4; //OUTPUT:3
                print 20 % 5; //OUTPUT:0
            `);
        });

        test('Precedence', () => {
            runTest(`
                print 2 + 3 * 4; //OUTPUT:14
                print 10 - 6 / 2; //OUTPUT:7
                print 2 * 3 + 4; //OUTPUT:10
            `);
        });
    });

    describe('Term Expressions (Addition, Subtraction)', () => {
        test('Addition', () => {
            runTest(`
                print 1 + 2; //OUTPUT:3
                print 1 + 2 + 3; //OUTPUT:6
                print 10 + 20; //OUTPUT:30
            `);
        });

        test('Subtraction', () => {
            runTest(`
                print 5 - 2; //OUTPUT:3
                print 10 - 3 - 2; //OUTPUT:5
                print 20 - 5; //OUTPUT:15
            `);
        });

        test('String Concatenation', () => {
            runTest(`
                print "hello" + " " + "world"; //OUTPUT:hello world
                print "a" + "b" + "c"; //OUTPUT:abc
            `);
        });

        test('Mixed Operations', () => {
            runTest(`
                print 1 + 2 - 3; //OUTPUT:0
                print 10 - 5 + 3; //OUTPUT:8
            `);
        });
    });

    describe('Shift Expressions', () => {
        test('Right Shift', () => {
            runTest(`
                print 8 >> 2; //OUTPUT:2
                print 16 >> 1; //OUTPUT:8
                print 32 >> 3; //OUTPUT:4
            `);
        });

        test('Left Shift', () => {
            runTest(`
                print 2 << 2; //OUTPUT:8
                print 4 << 1; //OUTPUT:8
                print 1 << 3; //OUTPUT:8
            `);
        });

        test('Precedence', () => {
            runTest(`
                print 1 + 2 << 1; //OUTPUT:6
                print 8 >> 1 + 1; //OUTPUT:2
            `);
        });
    });

    describe('Comparison Expressions', () => {
        test('Greater Than', () => {
            runTest(`
                print 5 > 3; //OUTPUT:true
                print 3 > 5; //OUTPUT:false
                print 5 > 5; //OUTPUT:false
            `);
        });

        test('Greater Than or Equal', () => {
            runTest(`
                print 5 >= 3; //OUTPUT:true
                print 5 >= 5; //OUTPUT:true
                print 3 >= 5; //OUTPUT:false
            `);
        });

        test('Less Than', () => {
            runTest(`
                print 3 < 5; //OUTPUT:true
                print 5 < 3; //OUTPUT:false
                print 5 < 5; //OUTPUT:false
            `);
        });

        test('Less Than or Equal', () => {
            runTest(`
                print 3 <= 5; //OUTPUT:true
                print 5 <= 5; //OUTPUT:true
                print 5 <= 3; //OUTPUT:false
            `);
        });

    });

    describe('Equality Expressions', () => {
        test('Equality', () => {
            runTest(`
                print 1 == 1; //OUTPUT:true
                print 1 == 2; //OUTPUT:false
                print "hello" == "hello"; //OUTPUT:true
                print "hello" == "world"; //OUTPUT:false
                print true == true; //OUTPUT:true
                print nil == nil; //OUTPUT:true
            `);
        });

        test('Inequality', () => {
            runTest(`
                print 1 != 1; //OUTPUT:false
                print 1 != 2; //OUTPUT:true
                print "hello" != "world"; //OUTPUT:true
                print true != false; //OUTPUT:true
            `);
        });

        test('Chained Equality', () => {
            runTest(`
                print 1 == 1 == true; //OUTPUT:true
                print 1 != 2 != false; //OUTPUT:true
            `);
        });
    });

    describe('Bitwise AND Expressions', () => {
        test('Bitwise AND', () => {
            runTest(`
                print 5 & 3; //OUTPUT:1
                print 12 & 10; //OUTPUT:8
                print 7 & 3; //OUTPUT:3
            `);
        });

    });

    describe('Bitwise XOR Expressions', () => {
        test('Bitwise XOR', () => {
            runTest(`
                print 5 ^ 3; //OUTPUT:6
                print 12 ^ 10; //OUTPUT:6
                print 7 ^ 3; //OUTPUT:4
            `);
        });

        test('Precedence', () => {
            runTest(`
                print (5 ^ 3) & 1; //OUTPUT:0
                print 10 ^ 6 | 2; //OUTPUT:14
            `);
        });
    });

    describe('Bitwise OR Expressions', () => {
        test('Bitwise OR', () => {
            runTest(`
                print 5 | 3; //OUTPUT:7
                print 12 | 10; //OUTPUT:14
                print 7 | 3; //OUTPUT:7
            `);
        });

        test('Precedence', () => {
            runTest(`
                print 5 | 3 ^ 1; //OUTPUT:7
                print 10 | 6 & 2; //OUTPUT:10
            `);
        });
    });

    describe('Logical AND Expressions', () => {
        test('Logical AND', () => {
            runTest(`
                print true && true; //OUTPUT:true
                print true && false; //OUTPUT:false
                print false && true; //OUTPUT:false
                print false && false; //OUTPUT:false
            `);
        });

        test('Short Circuit Evaluation', () => {
            runTest(`
                var a = 0;
                false && (a = 1);
                print a; //OUTPUT:0
                
                true && (a = 2);
                print a; //OUTPUT:2
            `);
        });

        test('Precedence', () => {
            runTest(`
                print true && false || true; //OUTPUT:true
                print false || true && false; //OUTPUT:false
            `);
        });
    });

    describe('Logical OR Expressions', () => {
        test('Logical OR', () => {
            runTest(`
                print true || true; //OUTPUT:true
                print true || false; //OUTPUT:true
                print false || true; //OUTPUT:true
                print false || false; //OUTPUT:false
            `);
        });

        test('Short Circuit Evaluation', () => {
            runTest(`
                var a = 0;
                true || (a = 1);
                print a; //OUTPUT:0
                
                false || (a = 2);
                print a; //OUTPUT:2
            `);
        });
    });

    describe('Conditional (Ternary) Expressions', () => {
        test('Basic Ternary', () => {
            runTest(`
                print true ? 1 : 2; //OUTPUT:1
                print false ? 1 : 2; //OUTPUT:2
            `);
        });

        test('Nested Ternary', () => {
            runTest(`
                print true ? 1 : false ? 2 : 3; //OUTPUT:1
                print false ? 1 : true ? 2 : 3; //OUTPUT:2
                print false ? 1 : false ? 2 : 3; //OUTPUT:3
            `);
        });

        test('Precedence', () => {
            runTest(`
                print true || false ? 10 : 20; //OUTPUT:10
                print false || false ? 10 : 20; //OUTPUT:20
            `);
        });
    });

    describe('Assignment Expressions', () => {
        test('Simple Assignment', () => {
            runTest(`
                var a;
                a = 10;
                print a; //OUTPUT:10
                a = 20;
                print a; //OUTPUT:20
            `);
        });

        test('Chained Assignment', () => {
            runTest(`
                var a;
                var b;
                a = b = 5;
                print a; //OUTPUT:5
                print b; //OUTPUT:5
            `);
        });

        test('Assignment with Expression', () => {
            runTest(`
                var a = 5;
                a = a + 3;
                print a; //OUTPUT:8
                a = a * 2;
                print a; //OUTPUT:16
            `);
        });
    });

    describe('Comma Expressions', () => {
        test('Basic Comma', () => {
            runTest(`
                print 1, 2, 3; //OUTPUT:3
                print "a", "b", "c"; //OUTPUT:c
            `);
        });

        test('Comma with Assignment', () => {
            runTest(`
                var a;
                var b;
                a = 1, b = 2;
                print a; //OUTPUT:1
                print b; //OUTPUT:2
                print a, b; //OUTPUT:2
            `);
        });

        test('Comma Precedence', () => {
            runTest(`
                print 1 + 2, 3 + 4; //OUTPUT:7
                var  b = 10;
                print 1, b; //OUTPUT:10
            `);
        });
    });

    describe('Complex Expression Combinations', () => {
        test('Operator Precedence', () => {
            runTest(`
                print 1 + 2 * 3; //OUTPUT:7
                print (1 + 2) * 3; //OUTPUT:9
                print 1 + 2 * 3 - 4; //OUTPUT:3
                print 2 * 3 + 4 / 2; //OUTPUT:8
            `);
        });

        test('Mixed Logical and Arithmetic', () => {
            runTest(`
                print 1 + 2 == 3; //OUTPUT:true
                print 5 > 3 && 2 < 4; //OUTPUT:true
                print 1 + 2 * 3 > 5; //OUTPUT:true
            `);
        });

        test('Nested Expressions', () => {
            runTest(`
                print ((1 + 2) * (3 + 4)); //OUTPUT:21
                print (5 > 3) && (2 < 4); //OUTPUT:true
                print !(1 == 2); //OUTPUT:true
            `);
        });

        test('Increment and Decrement in Expressions', () => {
            runTest(`
                var a = 5;
                print ++a + 2; //OUTPUT:8
                print a; //OUTPUT:6
                
                var b = 10;
                print b-- + 3; //OUTPUT:13
                print b; //OUTPUT:9
            `);
        });

        test('Complex Bitwise Operations', () => {
            runTest(`
                print (5 | 3) & 7; //OUTPUT:7
                print (10 & 6) | 2; //OUTPUT:2
                print 5 ^ 3 ^ 1; //OUTPUT:7
            `);
        });

        test('Ternary in Arithmetic', () => {
            runTest(`
                print (true ? 10 : 20) + 5; //OUTPUT:15
                print 5 + (false ? 10 : 20); //OUTPUT:25
                print (1 > 0 ? 100 : 200) * 2; //OUTPUT:200
            `);
        });
    });
});

