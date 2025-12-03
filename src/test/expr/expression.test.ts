import { describe, test } from 'vitest';
import { runTest } from '../test-utils';

describe('Expression Tests', () => {

    describe('Primary Expressions', () => {
        test('Number Literals', () => {
            runTest(`
                fun main(){
                    print(42);
                    print(3.14);
                    print(-0);
                }
                //OUTPUT:42
                //OUTPUT:3.14
                //OUTPUT:0
            `);
        });

        test('String Literals', () => {
            runTest(`
                fun main(){
                    print("hello");
                    print("world");
                    print("");
                }
                //OUTPUT:hello
                //OUTPUT:world
                //OUTPUT:
            `);
        });

        test('Boolean Literals', () => {
            runTest(`
                fun main(){
                    print(true);
                    print(false);
                }
                //OUTPUT:true
                //OUTPUT:false
            `);
        });

        test('Nil Literal', () => {
            runTest(`
                fun main(){
                    print(null);
                }
                //OUTPUT:null
            `);
        });

        test('Variable Expressions', () => {
            runTest(`
                fun main(){
                    var a = 10;
                    print(a);
                    var b = "test";
                    print(b);
                }
                //OUTPUT:10
                //OUTPUT:test
            `);
        });

        test('Grouping Expressions', () => {
            runTest(`
                fun main(){
                    print((1 + 2) * 3);
                    print((2 + 3) * (4 + 5));
                    print(((1)));
                }
                //OUTPUT:9
                //OUTPUT:45
                //OUTPUT:1
            `);
        });
    });

    describe('Unary Expressions', () => {
        test('Logical Not', () => {
            runTest(`
                fun main(){
                    print(!true);
                    print(!false);
                    print(!null);
                    print(!0);
                }
                //OUTPUT:false
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:true
            `);
        });

        test('Negation', () => {
            runTest(`
                fun main(){
                    print(-5);
                    print(-(-5));
                    print(-(1 + 2));
                }
                //OUTPUT:-5
                //OUTPUT:5
                //OUTPUT:-3
            `);
        });

        test('Bitwise Not', () => {
            runTest(`
                fun main(){
                    print(~0);
                    print(~1);
                    print(~(-1));
                }
                //OUTPUT:-1
                //OUTPUT:-2
                //OUTPUT:0
            `);
        });

        test('Prefix Increment', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    print(++a);
                    print(a);
                }
                //OUTPUT:6
                //OUTPUT:6
            `);
        });

        test('Prefix Decrement', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    print(--a);
                    print(a);
                }
                //OUTPUT:4
                //OUTPUT:4
            `);
        });

        test('Multiple Unary Operators', () => {
            runTest(`
                fun main(){
                    print(!!true);
                    print(- -5);
                    print(-(-5));
                }
                //OUTPUT:true
                //OUTPUT:5
                //OUTPUT:5
            `);
        });
    });

    describe('Postfix Expressions', () => {
        test('Postfix Increment', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    print(a++);
                    print(a);
                }
                //OUTPUT:5
                //OUTPUT:6
            `);
        });

        test('Postfix Decrement', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    print(a--);
                    print(a);
                }
                //OUTPUT:5
                //OUTPUT:4
            `);
        });
    });

    describe('Factor Expressions (Multiplication, Division, Modulo)', () => {
        test('Multiplication', () => {
            runTest(`
                fun main(){
                    print(2 * 3);
                    print(4 * 5 * 2);
                    print(-2 * 3);
                }
                //OUTPUT:6
                //OUTPUT:40
                //OUTPUT:-6
            `);
        });

        test('Division', () => {
            runTest(`
                fun main(){
                    print(10 / 2);
                    print(15 / 3 / 2);
                    print(7 / 2);
                }
                //OUTPUT:5
                //OUTPUT:2.5
                //OUTPUT:3.5
            `);
        });

        test('Modulo', () => {
            runTest(`
                fun main(){
                    print(10 % 3);
                    print(15 % 4);
                    print(20 % 5);
                }
                //OUTPUT:1
                //OUTPUT:3
                //OUTPUT:0
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print(2 + 3 * 4);
                    print(10 - 6 / 2);
                    print(2 * 3 + 4);
                }
                //OUTPUT:14
                //OUTPUT:7
                //OUTPUT:10
            `);
        });
    });

    describe('Term Expressions (Addition, Subtraction)', () => {
        test('Addition', () => {
            runTest(`
                fun main(){
                    print(1 + 2);
                    print(1 + 2 + 3);
                    print(10 + 20);
                }
                //OUTPUT:3
                //OUTPUT:6
                //OUTPUT:30
            `);
        });

        test('Subtraction', () => {
            runTest(`
                fun main(){
                    print(5 - 2);
                    print(10 - 3 - 2);
                    print(20 - 5);
                }
                //OUTPUT:3
                //OUTPUT:5
                //OUTPUT:15
            `);
        });

        test('String Concatenation', () => {
            runTest(`
                fun main(){
                    print("hello" + " " + "world");
                    print("a" + "b" + "c");
                }
                //OUTPUT:hello world
                //OUTPUT:abc
            `);
        });

        test('Mixed Operations', () => {
            runTest(`
                fun main(){
                    print(1 + 2 - 3);
                    print(10 - 5 + 3);
                }
                //OUTPUT:0
                //OUTPUT:8
            `);
        });
    });

    describe('Shift Expressions', () => {
        test('Right Shift', () => {
            runTest(`
                fun main(){
                    print(8 >> 2);
                    print(16 >> 1);
                    print(32 >> 3);
                }
                //OUTPUT:2
                //OUTPUT:8
                //OUTPUT:4
            `);
        });

        test('Left Shift', () => {
            runTest(`
                fun main(){
                    print(2 << 2);
                    print(4 << 1);
                    print(1 << 3);
                }
                //OUTPUT:8
                //OUTPUT:8
                //OUTPUT:8
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print(1 + 2 << 1);
                    print(8 >> 1 + 1);
                }
                //OUTPUT:6
                //OUTPUT:2
            `);
        });
    });

    describe('Comparison Expressions', () => {
        test('Greater Than', () => {
            runTest(`
                fun main(){
                    print(5 > 3);
                    print(3 > 5);
                    print(5 > 5);
                }
                //OUTPUT:true
                //OUTPUT:false
                //OUTPUT:false
            `);
        });

        test('Greater Than or Equal', () => {
            runTest(`
                fun main(){
                    print(5 >= 3);
                    print(5 >= 5);
                    print(3 >= 5);
                }
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:false
            `);
        });

        test('Less Than', () => {
            runTest(`
                fun main(){
                    print(3 < 5);
                    print(5 < 3);
                    print(5 < 5);
                }
                //OUTPUT:true
                //OUTPUT:false
                //OUTPUT:false
            `);
        });

        test('Less Than or Equal', () => {
            runTest(`
                fun main(){
                    print(3 <= 5);
                    print(5 <= 5);
                    print(5 <= 3);
                }
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:false
            `);
        });

    });

    describe('Equality Expressions', () => {
        test('Equality', () => {
            runTest(`
                fun main(){
                    print(1 == 1);
                    print(1 == 2);
                    print("hello" == "hello");
                    print("hello" == "world");
                    print(true == true);
                    print(null == null);
                }
                //OUTPUT:true
                //OUTPUT:false
                //OUTPUT:true
                //OUTPUT:false
                //OUTPUT:true
                //OUTPUT:true
            `);
        });

        test('Inequality', () => {
            runTest(`
                fun main(){
                    print(1 != 1);
                    print(1 != 2);
                    print("hello" != "world");
                    print(true != false);
                }
                //OUTPUT:false
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:true
            `);
        });

        test('Chained Equality', () => {
            runTest(`
                fun main(){
                    print(1 == 1 == true);
                    print(1 != 2 != false);
                }
                //OUTPUT:true
                //OUTPUT:true
            `);
        });
    });

    describe('Bitwise AND Expressions', () => {
        test('Bitwise AND', () => {
            runTest(`
                fun main(){
                    print(5 & 3);
                    print(12 & 10);
                    print(7 & 3);
                }
                //OUTPUT:1
                //OUTPUT:8
                //OUTPUT:3
            `);
        });

    });

    describe('Bitwise XOR Expressions', () => {
        test('Bitwise XOR', () => {
            runTest(`
                fun main(){
                    print(5 ^ 3);
                    print(12 ^ 10);
                    print(7 ^ 3);
                }
                //OUTPUT:6
                //OUTPUT:6
                //OUTPUT:4
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print((5 ^ 3) & 1);
                    print(10 ^ 6 | 2);
                }
                //OUTPUT:0
                //OUTPUT:14
            `);
        });
    });

    describe('Bitwise OR Expressions', () => {
        test('Bitwise OR', () => {
            runTest(`
                fun main(){
                    print(5 | 3);
                    print(12 | 10);
                    print(7 | 3);
                }
                //OUTPUT:7
                //OUTPUT:14
                //OUTPUT:7
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print(5 | 3 ^ 1);
                    print(10 | 6 & 2);
                }
                //OUTPUT:7
                //OUTPUT:10
            `);
        });
    });

    describe('Logical AND Expressions', () => {
        test('Logical AND', () => {
            runTest(`
                fun main(){
                    print(true && true);
                    print(true && false);
                    print(false && true);
                    print(false && false);
                }
                //OUTPUT:true
                //OUTPUT:false
                //OUTPUT:false
                //OUTPUT:false
            `);
        });

        test('Short Circuit Evaluation', () => {
            runTest(`
                fun main(){
                    var a = 0;
                    false && (a = 1);
                    print(a);
                    
                    true && (a = 2);
                    print(a);
                }
                //OUTPUT:0
                //OUTPUT:2
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print(true && false || true);
                    print(false || true && false);
                }
                //OUTPUT:true
                //OUTPUT:false
            `);
        });
    });

    describe('Logical OR Expressions', () => {
        test('Logical OR', () => {
            runTest(`
                fun main(){
                    print(true || true);
                    print(true || false);
                    print(false || true);
                    print(false || false);
                }
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:false
            `);
        });

        test('Short Circuit Evaluation', () => {
            runTest(`
                fun main(){
                    var a = 0;
                    true || (a = 1);
                    print(a);
                    
                    false || (a = 2);
                    print(a);
                }
                //OUTPUT:0
                //OUTPUT:2
            `);
        });
    });

    describe('Conditional (Ternary) Expressions', () => {
        test('Basic Ternary', () => {
            runTest(`
                fun main(){
                    print(true ? 1 : 2);
                    print(false ? 1 : 2);
                }
                //OUTPUT:1
                //OUTPUT:2
            `);
        });

        test('Nested Ternary', () => {
            runTest(`
                fun main(){
                    print(true ? 1 : false ? 2 : 3);
                    print(false ? 1 : true ? 2 : 3);
                    print(false ? 1 : false ? 2 : 3);
                }
                //OUTPUT:1
                //OUTPUT:2
                //OUTPUT:3
            `);
        });

        test('Precedence', () => {
            runTest(`
                fun main(){
                    print(true || false ? 10 : 20);
                    print(false || false ? 10 : 20);
                }
                //OUTPUT:10
                //OUTPUT:20
            `);
        });
    });

    describe('Assignment Expressions', () => {
        test('Simple Assignment', () => {
            runTest(`
                fun main(){
                    var a;
                    a = 10;
                    print(a);
                    a = 20;
                    print(a);
                }
                //OUTPUT:10
                //OUTPUT:20
            `);
        });

        test('Chained Assignment', () => {
            runTest(`
                fun main(){
                    var a;
                    var b;
                    a = b = 5;
                    print(a);
                    print(b);
                }
                //OUTPUT:5
                //OUTPUT:5
            `);
        });

        test('Assignment with Expression', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    a = a + 3;
                    print(a);
                    a = a * 2;
                    print(a);
                }
                //OUTPUT:8
                //OUTPUT:16
            `);
        });
    });

    describe('Comma Expressions', () => {

        test('Comma with Assignment', () => {
            runTest(`
                fun main(){
                    var a;
                    var b;
                    a = 1, b = 2;
                    print(a);
                    print(b);
                }
                //OUTPUT:1
                //OUTPUT:2
            `);
        });

        test('Comma Precedence', () => {
            runTest(`
                fun main(){
                    print((1 + 2, 3 + 4));
                    var  b = 10;
                    print((1, b));
                }
                //OUTPUT:7
                //OUTPUT:10
            `);
        });
    });

    describe('Complex Expression Combinations', () => {
        test('Operator Precedence', () => {
            runTest(`
                fun main(){
                    print(1 + 2 * 3);
                    print((1 + 2) * 3);
                    print(1 + 2 * 3 - 4);
                    print(2 * 3 + 4 / 2);
                }
                //OUTPUT:7
                //OUTPUT:9
                //OUTPUT:3
                //OUTPUT:8
            `);
        });

        test('Mixed Logical and Arithmetic', () => {
            runTest(`
                fun main(){
                    print(1 + 2 == 3);
                    print(5 > 3 && 2 < 4);
                    print(1 + 2 * 3 > 5);
                }
                //OUTPUT:true
                //OUTPUT:true
                //OUTPUT:true
            `);
        });

        test('Nested Expressions', () => {
            runTest(`
                fun main(){
                    print(((1 + 2) * (3 + 4)));
                    print((5 > 3) && (2 < 4));
                    print(!(1 == 2));
                }
                //OUTPUT:21
                //OUTPUT:true
                //OUTPUT:true
            `);
        });

        test('Increment and Decrement in Expressions', () => {
            runTest(`
                fun main(){
                    var a = 5;
                    print(++a + 2);
                    print(a);
                    
                    var b = 10;
                    print(b-- + 3);
                    print(b);
                }
                //OUTPUT:8
                //OUTPUT:6
                //OUTPUT:13
                //OUTPUT:9
            `);
        });

        test('Complex Bitwise Operations', () => {
            runTest(`
                fun main(){
                    print((5 | 3) & 7);
                    print((10 & 6) | 2);
                    print(5 ^ 3 ^ 1);
                }
                //OUTPUT:7
                //OUTPUT:2
                //OUTPUT:7
            `);
        });

        test('Ternary in Arithmetic', () => {
            runTest(`
                fun main(){
                    print((true ? 10 : 20) + 5);
                    print(5 + (false ? 10 : 20));
                    print((1 > 0 ? 100 : 200) * 2);
                }
                //OUTPUT:15
                //OUTPUT:25
                //OUTPUT:200
            `);
        });
    });
});

