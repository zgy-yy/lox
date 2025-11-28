
fun foo(){

    return 1;
}
fun bar(){
    return foo;
}

var a=2;
a = bar()();
print(a);