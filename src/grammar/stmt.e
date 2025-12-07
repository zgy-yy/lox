
var a=23;

class Thing {
  var a;
  var b;
  init(a,b){
    this.a =a;
    this.b= b;
    print("init",a,b);
    return 12;
  }
}


fun main(){
   var callback =new  Thing(1,2);
   print(callback);
}