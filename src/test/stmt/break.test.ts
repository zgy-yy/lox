import { describe, test } from 'vitest';
import { runTest } from '../test-utils';

describe('Break Statement Tests', () => {

    test('Break in While Loop', () => {
        runTest(`
            var i = 0;
            while (i < 5) {
                if (i == 3) {
                    break;
                }
                print i;
                i = i + 1;
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('Break in For Loop', () => {
        runTest(`
            for (var i = 0; i < 5; i = i + 1) {
                if (i == 3) {
                    break;
                }
                print i;
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('Break at Loop Start', () => {
        runTest(`
            var i = 0;
            while (i < 3) {
                break;
                print i;
                i = i + 1;
            }
            print "done";
            //OUTPUT:done
        `);
    });

    test('Break in Nested While Loops', () => {
        runTest(`
            var i = 0;
            while (i < 3) {
                var j = 0;
                while (j < 3) {
                    if (j == 1) {
                        break;
                    }
                    print i * 10 + j;
                    j = j + 1;
                }
                i = i + 1;
            }
            //OUTPUT:0
            //OUTPUT:10
            //OUTPUT:20
        `);
    });

    test('Break in Nested For Loops', () => {
        runTest(`
            for (var i = 0; i < 3; i = i + 1) {
                for (var j = 0; j < 3; j = j + 1) {
                    if (j == 1) {
                        break;
                    }
                    print i * 10 + j;
                }
            }
            //OUTPUT:0
            //OUTPUT:10
            //OUTPUT:20
        `);
    });

    test('Break with Condition', () => {
        runTest(`
            var i = 0;
            while (true) {
                print i;
                i = i + 1;
                if (i >= 3) {
                    break;
                }
            }
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
        `);
    });

    test('Break After Multiple Iterations', () => {
        runTest(`
            for (var i = 0; i < 10; i = i + 1) {
                print i;
                if (i == 4) {
                    break;
                }
            }
            print "after loop";
            //OUTPUT:0
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:3
            //OUTPUT:4
            //OUTPUT:after loop
        `);
    });

    test('Break in Loop with Block', () => {
        runTest(`
            var i = 0;
            while (i < 5) {
                {
                    if (i == 2) {
                        break;
                    }
                    print i;
                }
                i = i + 1;
            }
            //OUTPUT:0
            //OUTPUT:1
        `);
    });

    test('Break with Multiple Conditions', () => {
        runTest(`
            for (var i = 0; i < 10; i = i + 1) {
                if (i > 2 && i < 5) {
                    print i;
                }
                if (i == 5) {
                    break;
                }
            }
            //OUTPUT:3
            //OUTPUT:4
        `);
    });

    test('Break in While Loop with Side Effects', () => {
        runTest(`
            var i = 0;
            while ((i = i + 1) < 10) {
                if (i == 4) {
                    break;
                }
                print i;
            }
            //OUTPUT:1
            //OUTPUT:2
            //OUTPUT:3
        `);
    });
});

