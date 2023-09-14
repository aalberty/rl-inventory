var app = angular.module("myAppInventoryFilter", []).filter("inventoryFilter", function(){
    //var fieldMap = {"itemTypes": "slot", "itemQualities": "quality", "itemTradeable": "tradeable"};
    return function(input, filterOptions){ //pass in filter options by adding ': param' after calling custom filter
        var res = [];
        var types = getActiveFilterOptions(filterOptions.itemTypes);
        var qualities = getActiveFilterOptions(filterOptions.itemQualities);
        var tradeables = getActiveFilterOptions(filterOptions.itemTradeable);
        var paints = getActiveFilterOptions(filterOptions.itemPaints);
        var certs = getActiveFilterOptions(filterOptions.itemCerts);
        for(var i in input){
           var item = input[i];
           for(var field in Object.keys(item)){
               if(item[Object.keys(item)[field]] == ""){
                   item[Object.keys(item)[field]] = "none";
               }
           }
           if(types.indexOf(item.slot.toLowerCase().split(" ").join("")) != -1 &&
           qualities.indexOf(item.quality.toLowerCase().split(" ").join("")) != -1 &&
           tradeables.indexOf((item.tradeable + '').toLowerCase().split(" ").join("")) != -1 &&
           certs.indexOf(item.certification.toLowerCase().split(" ").join("")) != -1 &&
           paints.indexOf(item.paint.toLowerCase().split(" ").join("")) != -1){
               res.push(item);
           }
        }
        return res;
    }

    function getActiveFilterOptions(filterArr){
        var filters = Object.keys(filterArr);
        var res = [];
        for(var filter in filters){
            var filterType = filters[filter];
            if(filterArr[filterType].value == true){
                res.push(filterArr[filterType].label.toLowerCase().split(" ").join(""));
            }
        }
        return res;
    }
   
    
});
    
//Sample working filter to get all tradeable items
// app.filter('testFilter', function(){
//     function thing(input){
//         if(input.tradeable == "true"){
//             return true;
//         }
//     }
//     return function(input){
//         var res = [];
//         for(var i in input){
//             if(thing(input[i])){
//                 res.push(input[i]);
//             }
//         }
//         console.log(res);
//         return res;
//     }
// });
