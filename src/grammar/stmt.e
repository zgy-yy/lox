
var a=23;

class Thing {
    var a;
  getCallback() {
    this.a=28;
    print(this);
    fun localFunction() {
        print(this.a);
      print( this);
    }

    return localFunction;
  }
}


fun main(){
   var callback = Thing().getCallback();
   callback();
}