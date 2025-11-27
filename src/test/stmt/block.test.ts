import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Block Statement Tests', () => {

    test('Basic Block Scoping', () => {
        runTest(`
            var a = "global a";
            var b = "global b";
            var c = "global c";
            {
              var a = "outer a";
              var b = "outer b";
              {
                var a = "inner a";
                print(a); //OUTPUT:inner a
                print(b); //OUTPUT:outer b
                print(c); //OUTPUT:global c
              }
              print(a); //OUTPUT:outer a
              print(b); //OUTPUT:outer b
              print(c); //OUTPUT:global c
            }
            print(a); //OUTPUT:global a
            print(b); //OUTPUT:global b
            print(c); //OUTPUT:global c
        `);
    });

    test('Empty Block', () => {
        runTest(`
            var a = "outer";
            {}
            print(a); //OUTPUT:outer
        `);
    });

    test('Nested Empty Blocks', () => {
        runTest(`
            var a = "outer";
            {{}}
            print(a); //OUTPUT:outer
        `);
    });
    
    test('Block Reassigns Outer Variable', () => {
        runTest(`
            var a = 1;
            {
                a = 2;
                print(a); //OUTPUT:2
            }
            print(a); //OUTPUT:2
        `);
    });
});

