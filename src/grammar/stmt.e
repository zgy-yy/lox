                fun makePair() {
                    var x = 0;
             
                    fun getSetX() {
                        return x;
                    }
                    return getSetX;
                }
                var getX = makePair();
                print(getX());
                //OUTPUT:0