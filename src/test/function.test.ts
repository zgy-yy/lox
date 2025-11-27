import { describe, test } from 'vitest';
import { runTest } from './test-utils';

describe('Function Tests', () => {

    describe('Function Declaration', () => {
        test('Simple Function Declaration', () => {
            runTest(`
                fun sayHello() {
                    print("Hello");
                }
                sayHello();
                //OUTPUT:Hello
            `);
        });

        test('Function with Parameters', () => {
            runTest(`
                fun greet(name) {
                    print("Hello, " + name);
                }
                greet("Alice");
                //OUTPUT:Hello, Alice
                greet("Bob");
                //OUTPUT:Hello, Bob
            `);
        });

        test('Function with Multiple Parameters', () => {
            runTest(`
                fun add(a, b) {
                    print(a + b);
                }
                add(1, 2);
                //OUTPUT:3
                add(10, 20);
                //OUTPUT:30
            `);
        });

        test('Function with No Parameters', () => {
            runTest(`
                fun getValue() {
                    print(42);
                }
                getValue();
                //OUTPUT:42
            `);
        });

        test('Function with Three Parameters', () => {
            runTest(`
                fun sum(a, b, c) {
                    print(a + b + c);
                }
                sum(1, 2, 3);
                //OUTPUT:6
                sum(10, 20, 30);
                //OUTPUT:60
            `);
        });
    });

    describe('Function Calls', () => {
        test('Call Function Multiple Times', () => {
            runTest(`
                fun printNumber(n) {
                    print(n);
                }
                printNumber(1);
                //OUTPUT:1
                printNumber(2);
                //OUTPUT:2
                printNumber(3);
                //OUTPUT:3
            `);
        });

        test('Nested Function Calls', () => {
            runTest(`
                fun add(a, b) {
                    print(a + b);
                }
                fun multiply(a, b) {
                    print(a * b);
                }
                multiply(2, 3);
                //OUTPUT:6
                add(1, 6);
                //OUTPUT:7
            `);
        });

        test('Function Call as Expression', () => {
            runTest(`
                fun getFive() {
                    print("getting five");
                }
                var result = getFive();
                print(result);
                //OUTPUT:getting five
                //OUTPUT:null
            `);
        });

        test('Function Call with Expressions as Arguments', () => {
            runTest(`
                fun add(a, b) {
                    print(a + b);
                }
                add(1 + 2, 3 * 4);
                //OUTPUT:15
            `);
        });
    });

    describe('Function Scope', () => {
        test('Local Variables in Function', () => {
            runTest(`
                fun test() {
                    var local = "local";
                    print(local);
                }
                test();
                //OUTPUT:local
            `);
        });

        test('Function Parameters Shadow Outer Variables', () => {
            runTest(`
                var x = "outer";
                fun test(x) {
                    print(x);
                }
                test("inner");
                //OUTPUT:inner
                print(x);
                //OUTPUT:outer
            `);
        });

        test('Function Accesses Outer Variables', () => {
            runTest(`
                var global = "global";
                fun test() {
                    print(global);
                }
                test();
                //OUTPUT:global
            `);
        });

        test('Function Modifies Outer Variables', () => {
            runTest(`
                var counter = 0;
                fun increment() {
                    counter = counter + 1;
                }
                increment();
                print(counter);
                //OUTPUT:1
                increment();
                print(counter);
                //OUTPUT:2
            `);
        });

        test('Nested Scopes in Function', () => {
            runTest(`
                fun test() {
                    var a = 1;
                    {
                        var b = 2;
                        print(a + b);
                    }
                    print(a);
                }
                test();
                //OUTPUT:3
                //OUTPUT:1
            `);
        });
    });

    describe('Recursive Functions', () => {
        test('Simple Recursion', () => {
            runTest(`
                fun count(n) {
                    if (n > 0) {
                        print(n);
                        count(n - 1);
                    }
                }
                count(3);
                //OUTPUT:3
                //OUTPUT:2
                //OUTPUT:1
            `);
        });

        test('Fibonacci-like Recursion', () => {
            runTest(`
                fun fib(n) {
                    if (n <= 1) {
                        print(n);
                    } else {
                        print(n);
                        fib(n - 1);
                        fib(n - 2);
                    }
                }
                fib(3);
                //OUTPUT:3
                //OUTPUT:2
                //OUTPUT:1
                //OUTPUT:0
                //OUTPUT:1
            `);
        });
    });

    describe('Function as Value', () => {
        test('Assign Function to Variable', () => {
            runTest(`
                fun sayHi() {
                    print("Hi");
                }
                var greet = sayHi;
                greet();
                //OUTPUT:Hi
            `);
        });

        test('Pass Function as Argument', () => {
            runTest(`
                fun callTwice(fn) {
                    fn();
                    fn();
                }
                fun sayHello() {
                    print("Hello");
                }
                callTwice(sayHello);
                //OUTPUT:Hello
                //OUTPUT:Hello
            `);
        });

        test('Function Reference', () => {
            runTest(`
                var count = 0;
                fun counter() {
                    count = count + 1;
                    print(count);
                }
                var c = counter;
                c();
                //OUTPUT:1
                c();
                //OUTPUT:2
            `);
        });
    });

    describe('Closures', () => {
        test('Nested Functions', () => {
            runTest(`
                var x = 5;
                var y = 3;
                fun outer() {
                    fun inner() {
                        print(x + y);
                    }
                    inner();
                }
                outer();
                //OUTPUT:8
            `);
        });

        test('Nested Function with Multiple Variables', () => {
            runTest(`
                var multiplier = 2;
                fun makeMultiplier(m) {
                    multiplier = m;
                    fun multiply(n) {
                        print(multiplier * n);
                    }
                    multiply(5);
                }
                makeMultiplier(2);
                //OUTPUT:10
                makeMultiplier(3);
                //OUTPUT:15
            `);
        });
    });

    describe('Native Functions', () => {
        test('Clock Function', () => {
            runTest(`
                var time = clock();
                print(time > 0);
                //OUTPUT:true
            `);
        });

        test('Print Function', () => {
            runTest(`
                print("test");
                //OUTPUT:test
                print(1 + 2);
                //OUTPUT:3
            `);
        });
    });

    describe('Function Arguments', () => {
        test('Zero Arguments', () => {
            runTest(`
                fun noArgs() {
                    print("no args");
                }
                noArgs();
                //OUTPUT:no args
            `);
        });

        test('One Argument', () => {
            runTest(`
                fun oneArg(x) {
                    print(x);
                }
                oneArg(42);
                //OUTPUT:42
            `);
        });

        test('Multiple Arguments', () => {
            runTest(`
                fun manyArgs(a, b, c, d) {
                    print(a + b + c + d);
                }
                manyArgs(1, 2, 3, 4);
                //OUTPUT:10
            `);
        });

        test('Arguments with Different Types', () => {
            runTest(`
                fun printAll(a, b, c) {
                    print(a);
                    print(b);
                    print(c);
                }
                printAll(1, "two", true);
                //OUTPUT:1
                //OUTPUT:two
                //OUTPUT:true
            `);
        });
    });

    describe('Function in Control Flow', () => {
        test('Function in If Statement', () => {
            runTest(`
                fun positive() {
                    print("positive");
                }
                fun negative() {
                    print("negative");
                }
                if (true) {
                    positive();
                } else {
                    negative();
                }
                //OUTPUT:positive
            `);
        });

        test('Function in While Loop', () => {
            runTest(`
                var count = 0;
                fun increment() {
                    count = count + 1;
                    print(count);
                }
                while (count < 3) {
                    increment();
                }
                //OUTPUT:1
                //OUTPUT:2
                //OUTPUT:3
            `);
        });

        test('Function in For Loop', () => {
            runTest(`
                fun printNum(n) {
                    print(n);
                }
                for (var i = 0; i < 3; i = i + 1) {
                    printNum(i);
                }
                //OUTPUT:0
                //OUTPUT:1
                //OUTPUT:2
            `);
        });
    });

    describe('Complex Function Scenarios', () => {
        test('Function Calling Another Function', () => {
            runTest(`
                fun add(a, b) {
                    print(a + b);
                }
                fun multiply(a, b) {
                    print(a * b);
                }
                fun calculate(x, y) {
                    add(x, y);
                    multiply(x, y);
                }
                calculate(3, 4);
                //OUTPUT:7
                //OUTPUT:12
            `);
        });

        test('Function with Local Function', () => {
            runTest(`
                fun outer() {
                    fun inner() {
                        print("inner");
                    }
                    inner();
                    print("outer");
                }
                outer();
                //OUTPUT:inner
                //OUTPUT:outer
            `);
        });

        test('Function Modifying Parameters', () => {
            runTest(`
                fun modify(x) {
                    x = x + 10;
                    print(x);
                }
                var value = 5;
                modify(value);
                print(value);
                //OUTPUT:15
                //OUTPUT:5
            `);
        });
    });
});

