var Grouper = function(data, groupby){
    this.data = data;
    this.groupby = groupby;
    var self = this;

    // Return a function that filters the objects by the values of the a set of keys
    // E.g. var f = this._filter(['name', 'class'], ['Gary', 10])
    //      f({'name': 'Gary', 'class': 10}) is true
    //      f({'name': 'Gary', 'class': 42}) is false
    this._filter = function(keys, values){
        return function(item){
            for(var i in keys){
                if(item[keys[i]] != values[i]){
                    return false;
                }
            }
            return true;
        }
    }

    // Return an array of containing each of the groups with all of the rows that correspond to that group
    this.groups = function(){
        var keys = [];
        var result = [];

        for(var i in this.data){
            // Create a key for the data e.g. {'name': 'Bob', class: 14, mass: 14} -> 'Bob,14' if the groupby fields are name and class
            var key = self.groupby.map(function(key){return self.data[i][key]});
            var keyString = key.join();

            // If the key hasn't been seen already then add an object to the result
            if(keys.indexOf(keyString) == -1){
                keys.push(keyString);
                // yield {'group': key, 'data': self.data.filter(self._filter(self.groupby, key))} // too fancy for some
                result.push({'group': key, 'data': self.data.filter(self._filter(self.groupby, key))});
            }
        }
        return result;
    }

    this.agg = function(aggFunc, valueName){
        var groups = this.groups();
        var result = [];

        if(!valueName){
            valueName = 'agg';
        }

        for (var i in groups) {
            var group = groups[i];
            value = aggFunc(group.data);

            var resultObj = {'group': group.group};
            resultObj[valueName] = value;

            result.push(resultObj);
        }
        return result;
    }

    // Standard agg functions
    this._sum = function(arr){
        return arr.reduce(function(v1, v2) { return v1 + v2[self._aggVar]; }, 0);
    }

    this._count = function(arr){
        return arr.length;
    }

    this._average = function(arr){
        return 0 ? arr.length == 0 : self._sum(arr) / arr.length;
    }

    // Convenience function to save the user from writing a sum/count/average function and using agg.
    this.sum = function(aggVar){
        self._aggVar = aggVar;
        return this.agg(this._sum, 'sum');
    }

    this.count = function(){
        return this.agg(this._count, 'count');
    }

    this.average = function(aggVar){
        self._aggVar = aggVar;
        return this.agg(this._average, 'average');
    }
}

var tablify = {
    'Grouper': Grouper
}
