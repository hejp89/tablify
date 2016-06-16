// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
var tablify = {
    'agg': function(data, aggFunc, groupby, variable){

        var summ = data.reduce(function (res, value){
            var key = groupby.map(function(key){return value[key]});
            var keyString = key.join();

            if (!res[keyString]){
                res[keyString] = {}
                res[keyString][variable] = 0;
                for(var i in groupby){
                    res[keyString][groupby[i]] = value[groupby[i]];
                }
            }
            res[keyString][variable] = aggFunc(res[keyString][variable], value[variable]);
            return res;
        }, {});

        var r = [];
        for(row in summ){
            r.push(summ[row]);
        }
        return r;
    }
}
