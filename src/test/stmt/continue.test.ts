import { describe, test } from 'vitest';
import { runTest } from '../test-utils';

describe('Continue Statement Tests', () => {

    test('Continue in While Loop', () => {
        runTest(`
            var i = 0;
            while (i < 5) {
                i = i + 1;
                if (i == 3) {
                    continue;
                }
                print(i);
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:4
            //OUTPUT:5
        `);
    });

    test('Continue in For Loop', () => {
        runTest(`
            for (var i = 0; i < 5; i = i + 1) {
                if (i == 2) {
                    continue;
                }
                print(i);
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:3
            //OUTPUT:4
        `);
    });

    test('Continue at Loop Start', () => {
        runTest(`
            var i = 0;
            while (i < 3) {
                i = i + 1;
                continue;
                print("should not print");
            }
            print("done");
            //OUTPUT:done
        `);
    });

    test('Continue in Nested While Loops', () => {
        runTest(`
            var i = 0;
            while (i < 3) {
                var j = 0;
                while (j < 3) {
                    j = j + 1;
                    if (j == 2) {
                        continue;
                    }
                    print(i * 10 + j);
                }
                i = i + 1;
            }
            //OUTPUT:1
            //OUTPUT:3
            //OUTPUT:11
            //OUTPUT:13
            //OUTPUT:21
            //OUTPUT:23
        `);
    });

    test('Continue in Nested For Loops', () => {
        runTest(`
            for (var i = 0; i < 3; i = i + 1) {
                for (var j = 0; j < 3; j = j + 1) {
                    if (j == 1) {
                        continue;
                    }
                    print(i * 10 + j);
                }
            }
            //OUTPUT:0
            //OUTPUT:2
            //OUTPUT:10
            //OUTPUT:12
            //OUTPUT:20
            //OUTPUT:22
        `);
    });

    test('Continue Skips Multiple Statements', () => {
        runTest(`
            for (var i = 0; i < 4; i = i + 1) {
                if (i == 2) {
                    continue;
                }
                print("before");
                print(i);
                print("after");
            }
            //OUTPUT:before
            //OUTPUT:0
            //OUTPUT:after
            //OUTPUT:before
            //OUTPUT:1
            //OUTPUT:after
            //OUTPUT:before
            //OUTPUT:3
            //OUTPUT:after
        `);
    });

    test('Continue in Loop with Block', () => {
        runTest(`
            var i = 0;
            while (i < 5) {
                i = i + 1;
                {
                    if (i == 3) {
                        continue;
                    }
                    print(i);
                }
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:4
            //OUTPUT:5
        `);
    });

    test('Continue with Multiple Conditions', () => {
        runTest(`
            for (var i = 0; i < 10; i = i + 1) {
                if (i < 3 || i > 6) {
                    continue;
                }
                print(i);
            }
            //OUTPUT:3
            //OUTPUT:4
            //OUTPUT:5
            //OUTPUT:6
        `);
    });

    test('Continue in While Loop with Side Effects', () => {
        runTest(`
            var i = 0;
            while ((i = i + 1) < 6) {
                if (i == 3) {
                    continue;
                }
                print(i);
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:4
            //OUTPUT:5
        `);
    });

    test('Continue All Iterations Except One', () => {
        runTest(`
            for (var i = 0; i < 5; i = i + 1) {
                if (i != 2) {
                    continue;
                }
                print(i);
            }
            //OUTPUT:2
        `);
    });

    test('Continue with Increment in For Loop', () => {
        runTest(`
            var sum = 0;
            for (var i = 0; i < 5; i = i + 1) {
                if (i == 2) {
                    continue;
                }
                sum = sum + i;
            }
            print(sum);
            //OUTPUT:8
        `);
    });

    test('Continue in Infinite Loop with Break', () => {
        runTest(`
            var i = 0;
            while (true) {
                i = i + 1;
                if (i == 2) {
                    continue;
                }
                if (i >= 5) {
                    break;
                }
                print(i);
            }
            //OUTPUT:1
            //OUTPUT:3
            //OUTPUT:4
        `);
    });
});

