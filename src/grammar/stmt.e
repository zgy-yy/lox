
var i=14;


class A{
    var a=i;
    var b=23;
    foo(){
        print(b);
    }
}

fun main(){
    var a=23;
    var ba = new A();
    fun bar(){
        return ba;
    }
    bar().b =90;
    print(bar().b);
}