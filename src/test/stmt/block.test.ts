import { describe, test } from 'vitest';
import { runTest } from '@/test/test-utils';

describe('Block Statement Tests', () => {

    test('Basic Block Scoping', () => {
        runTest(`
            fun main(){
                var a = "global a";
                var b = "global b";
                var c = "global c";
                {
                  var a = "outer a";
                  var b = "outer b";
                  {
                    var a = "inner a";
                    print(a);
                    print(b);
                    print(c);
                  }
                  print(a);
                  print(b);
                  print(c);
                }
                print(a);
                print(b);
                print(c);
            }
            //OUTPUT:inner a
            //OUTPUT:outer b
            //OUTPUT:global c
            //OUTPUT:outer a
            //OUTPUT:outer b
            //OUTPUT:global c
            //OUTPUT:global a
            //OUTPUT:global b
            //OUTPUT:global c
        `);
    });

    test('Empty Block', () => {
        runTest(`
            fun main(){
                var a = "outer";
                {}
                print(a);
            }
            //OUTPUT:outer
        `);
    });

    test('Nested Empty Blocks', () => {
        runTest(`
            fun main(){
                var a = "outer";
                {{}}
                print(a);
            }
            //OUTPUT:outer
        `);
    });
    
    test('Block Reassigns Outer Variable', () => {
        runTest(`
            fun main(){
                var a = 1;
                {
                    a = 2;
                    print(a);
                }
                print(a);
            }
            //OUTPUT:2
            //OUTPUT:2
        `);
    });
});

