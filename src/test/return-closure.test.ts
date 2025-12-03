import { describe, test } from 'vitest';
import { runTest } from './test-utils';

describe('Return Statement Tests', () => {
    describe('Basic Return', () => {
        test('Return with Value', () => {
            runTest(`
                fun getFive() {
                    return 5;
                }
                fun main(){
                    print(getFive());
                }
                //OUTPUT:5
            `);
        });

        test('Return without Value', () => {
            runTest(`
                fun doNothing() {
                    return;
                }
                fun main(){
                    var result = doNothing();
                    print(result);
                }
                //OUTPUT:null
            `);
        });

        test('Return String', () => {
            runTest(`
                fun greet() {
                    return "Hello";
                }
                fun main(){
                    print(greet());
                }
                //OUTPUT:Hello
            `);
        });

        test('Return Boolean', () => {
            runTest(`
                fun isTrue() {
                    return true;
                }
                fun main(){
                    print(isTrue());
                }
                //OUTPUT:true
            `);
        });
    });

    describe('Return in Expressions', () => {
        test('Return in Arithmetic', () => {
            runTest(`
                fun add(a, b) {
                    return a + b;
                }
                fun main(){
                    print(add(2, 3));
                }
                //OUTPUT:5
            `);
        });

        test('Return in Conditional', () => {
            runTest(`
                fun max(a, b) {
                    if (a > b) {
                        return a;
                    } else {
                        return b;
                    }
                }
                fun main(){
                    print(max(5, 3));
                    print(max(2, 8));
                }
                //OUTPUT:5
                //OUTPUT:8
            `);
        });

        test('Return Early', () => {
            runTest(`
                fun checkPositive(n) {
                    if (n <= 0) {
                        return false;
                    }
                    return true;
                }
                fun main(){
                    print(checkPositive(5));
                    print(checkPositive(-1));
                }
                //OUTPUT:true
                //OUTPUT:false
            `);
        });
    });

    describe('Return in Loops', () => {
        test('Return from Loop', () => {
            runTest(`
                fun findFirstEven() {
                    var i = 1;
                    while (i < 10) {
                        if (i % 2 == 0) {
                            return i;
                        }
                        i = i + 1;
                    }
                    return -1;
                }
                fun main(){
                    print(findFirstEven());
                }
                //OUTPUT:2
            `);
        });

        test('Return from For Loop', () => {
            runTest(`
                fun findValue(target) {
                    for (var i = 0; i < 5; i = i + 1) {
                        if (i == target) {
                            return i;
                        }
                    }
                    return -1;
                }
                fun main(){
                    print(findValue(3));
                }
                //OUTPUT:3
            `);
        });
    });

    describe('Nested Returns', () => {
        test('Return from Nested Function', () => {
            runTest(`
                fun outer() {
                    fun inner() {
                        return 42;
                    }
                    return inner();
                }
                fun main(){
                    print(outer());
                }
                //OUTPUT:42
            `);
        });

        test('Return Multiple Levels', () => {
            runTest(`
                fun level1() {
                    fun level2() {
                        fun level3() {
                            return 3;
                        }
                        return level3();
                    }
                    return level2();
                }
                fun main(){
                    print(level1());
                }
                //OUTPUT:3
            `);
        });
    });

    describe('Return with Complex Expressions', () => {
        test('Return Expression Result', () => {
            runTest(`
                fun calculate() {
                    return 2 * 3 + 4;
                }
                fun main(){
                    print(calculate());
                }
                //OUTPUT:10
            `);
        });

        test('Return Function Call Result', () => {
            runTest(`
                fun double(n) {
                    return n * 2;
                }
                fun quadruple(n) {
                    return double(double(n));
                }
                fun main(){
                    print(quadruple(5));
                }
                //OUTPUT:20
            `);
        });
    });
});

describe('Closure Tests', () => {
    describe('Basic Closure', () => {
        test('Closure Captures Outer Variable', () => {
            runTest(`
                fun makeCounter() {
                    var count = 0;
                    fun counter() {
                        count = count + 1;
                        return count;
                    }
                    return counter;
                }
                fun main(){
                    var counter = makeCounter();
                    print(counter());
                    print(counter());
                    print(counter());
                }
                //OUTPUT:1
                //OUTPUT:2
                //OUTPUT:3
            `);
        });
    });

    describe('Closure with Parameters', () => {
        test('Closure Captures Parameter', () => {
            runTest(`
                fun makeAdder(x) {
                    fun add(y) {
                        return x + y;
                    }
                    return add;
                }
                fun main(){
                    var addFive = makeAdder(5);
                    print(addFive(3));
                    var addTen = makeAdder(10);
                    print(addTen(7));
                }
                //OUTPUT:8
                //OUTPUT:17
            `);
        });

        test('Closure with Multiple Parameters', () => {
            runTest(`
                fun makeMultiplier(a) {
                    fun multiply(b) {
                        return a * b;
                    }
                    return multiply;
                }
                fun main(){
                    var double = makeMultiplier(2);
                    print(double(5));
                    var triple = makeMultiplier(3);
                    print(triple(4));
                }
                //OUTPUT:10
                //OUTPUT:12
            `);
        });
    });

    describe('Nested Closures', () => {
        test('Nested Closure Access', () => {
            runTest(`
                fun outer(x) {
                    fun middle(y) {
                        fun inner(z) {
                            return x + y + z;
                        }
                        return inner;
                    }
                    return middle;
                }
                fun main(){
                    var mid = outer(1);
                    var inner = mid(2);
                    print(inner(3));
                }
                //OUTPUT:6
            `);
        });

        test('Closure Chain', () => {
            runTest(`
                fun createChain() {
                    var value = 0;
                    fun increment() {
                        value = value + 1;
                        return value;
                    }
                    fun getValue() {
                        return value;
                    }
                    fun getIncrement() {
                        return increment;
                    }
                    return getIncrement;
                }
                fun main(){
                    var getInc = createChain();
                    var inc = getInc();
                    print(inc());
                    print(inc());
                }
                //OUTPUT:1
                //OUTPUT:2
            `);
        });
    });

    describe('Closure State Isolation', () => {
        test('Independent Closure Instances', () => {
            runTest(`
                fun makeCounter() {
                    var count = 0;
                    fun counter() {
                        count = count + 1;
                        return count;
                    }
                    return counter;
                }
                fun main(){
                    var counter1 = makeCounter();
                    var counter2 = makeCounter();
                    print(counter1());
                    print(counter1());
                    print(counter2());
                    print(counter2());
                }
                //OUTPUT:1
                //OUTPUT:2
                //OUTPUT:1
                //OUTPUT:2
            `);
        });

        test('Closure Preserves State', () => {
            runTest(`
                fun makeAccumulator() {
                    var sum = 0;
                    fun accumulate(n) {
                        sum = sum + n;
                        return sum;
                    }
                    return accumulate;
                }
                fun main(){
                    var acc = makeAccumulator();
                    print(acc(5));
                    print(acc(10));
                    print(acc(20));
                }
                //OUTPUT:5
                //OUTPUT:15
                //OUTPUT:35
            `);
        });
    });

    describe('Closure with Return', () => {
        test('Closure Returns Function', () => {
            runTest(`
                fun makeGetter() {
                    var value = 42;
                    fun getValue() {
                        return value;
                    }
                    return getValue;
                }
                fun main(){
                    var getter = makeGetter();
                    print(getter());
                }
                //OUTPUT:42
            `);
        });

    });

    describe('Complex Closure Scenarios', () => {

        test('Closure with Conditional', () => {
            runTest(`
                fun makeConditional(x) {
                    if (x > 0) {
                        fun positive() {
                            return x;
                        }
                        return positive;
                    } else {
                        fun negative() {
                            return -x;
                        }
                        return negative;
                    }
                }
                fun main(){
                    var pos = makeConditional(5);
                    print(pos());
                    var neg = makeConditional(-3);
                    print(neg());
                }
                //OUTPUT:5
                //OUTPUT:3
            `);
        });

        test('Recursive Closure', () => {
            runTest(`
                fun makeRecursive() {
                    fun factorial(n) {
                        if (n <= 1) {
                            return 1;
                        }
                        return n * factorial(n - 1);
                    }
                    return factorial;
                }
                fun main(){
                    var fact = makeRecursive();
                    print(fact(5));
                }
                //OUTPUT:120
            `);
        });
    });
});

