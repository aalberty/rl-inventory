var app = angular.module("myAppInventoryCtrl", []);
app.controller("inventoryCtrl", function($scope, $http){
    $scope.loadJsonInventory = loadJsonInventory;
    $scope.filterOpenClose = filterOpenClose;
    $scope.setOrderBy = setOrderBy;
    $scope.updateAllCheckboxes = updateAllCheckboxes;
    $scope.resetAllFilters = resetAllFilters;
    $scope.orderByField = "name";
    $scope.reverseBool = false;
    $scope.displayList = [];
    $scope.filterOptions = {};
    //TODO: separate out blueprint items and make display-able
    $scope.filterOptions.itemTypes = {
        "": {
            "label": "None",
            "value": true
        },
        "Antenna": {
            "label": "Antenna",
            "value": true
        },
        "Paint Finish": {
            "label": "Paint Finish",
            "value": true
        },
        "Decal": {
            "label": "Decal",
            "value": true
        },
        "Wheels": {
            "label": "Wheels",
            "value": true
        },
        "Rocket Boost": {
            "label": "Rocket Boost",
            "value": true
        },
        "Engine Audio": {
            "label": "Engine Audio",
            "value": true
        },
        "Goal Explosion": {
            "label": "Goal Explosion",
            "value": true
        },
        "Trail": {
            "label": "Trail",
            "value": true
        },
        "Player Banner": {
            "label": "Player Banner",
            "value": true
        },
        "Avatar Border": {
            "label": "Avatar Border",
            "value": true
        },
        "Topper": {
            "label": "Topper",
            "value": true
        },
        "Player Anthem": {
            "label": "Player Anthem",
            "value": true
        },
        "Body": {
            "label": "Body",
            "value": true
        },
        "Player Title": {
            "label": "Player Title",
            "value": true
        },
        "Animated Decal": {
            "label": "Animated Decal",
            "value": true
        }
    };
    //Black Market needs to cover both itself and BlackMarket. There are two entries for some reason
    //Ditto with Very Rare
    //Unknown should cover both itself and the empty string
    $scope.filterOptions.itemQualities = {
        "unknown": {
            "label": "Unknown/None",
            "value": true
        },
        "Common": {
            "label": "Common",
            "value": true
        },
        "Very rare": {
            "label": "Very Rare",
            "value": true
        },
        "Limited": {
            "label": "Limited",
            "value": true
        },
        "Import": {
            "label": "Import",
            "value": true
        },
        "Rare": {
            "label": "Rare",
            "value": true
        },
        "Exotic": {
            "label": "Exotic",
            "value": true
        },
        "Black market": {
            "label": "Black Market",
            "value": true
        },
        "Uncommon": {
            "label": "Uncommon",
            "value": true
        },
        "Legacy": {
            "label": "Legacy",
            "value": true
        }
    };

    $scope.filterOptions.itemTradeable = {
        "True": {
            "label": "True",
            "value": true
        },
        "False": {
            "label": "False",
            "value": true
        }
    };

    $scope.filterOptions.itemPaints = {
        "none": {
            "label": "None",
            "value": true
        },
        "Burnt Sienna": {
            "label": "Burnt Sienna",
            "value": true
        },
        "Purple": {
            "label": "Purple",
            "value": true
        },
        "Pink": {
            "label": "Pink",
            "value": true
        },
        "Orange": {
            "label": "Orange",
            "value": true
        },
        "Forest Green": {
            "label": "Forest Green",
            "value": true
        },
        "Saffron": {
            "label": "Saffron",
            "value": true
        },
        "Cobalt": {
            "label": "Cobalt",
            "value": true
        },
        "Sky Blue": {
            "label": "Sky Blue",
            "value": true
        },
        "Grey": {
            "label": "Grey",
            "value": true
        },
        "Lime": {
            "label": "Lime",
            "value": true
        },
        "Titanium White": {
            "label": "Titanium White",
            "value": true
        },
        "Crimson": {
            "label": "Crimson",
            "value": true
        },
        "Black": {
            "label": "Black",
            "value": true
        }
    };

    $scope.filterOptions.itemCerts = {
        "none": {
            "label": "None",
            "value": true
        },
        "AerialGoals": {
            "label": "Aerial Goals",
            "value": true
        },
        "Juggles": {
            "label": "Juggles",
            "value": true
        },
        "ShotsOnGoal": {
            "label": "Shots on Goal",
            "value": true
        },
        "BackwardsGoals": {
            "label": "Backwards Goals",
            "value": true
        },
        "BicycleGoals": {
            "label": "Bicycle Goals",
            "value": true
        },
        "Goals": {
            "label": "Goals",
            "value": true
        },
        "EpicSaves": {
            "label": "Epic Saves",
            "value": true
        },
        "Clears": {
            "label": "Clears",
            "value": true
        },
        "Assists": {
            "label": "Assists",
            "value": true
        },
        "MVPs": {
            "label": "MVPs",
            "value": true
        },
        "LongGoals": {
            "label": "Long Goals",
            "value": true
        },
        "Centers": {
            "label": "Centers",
            "value": true
        },
        "Wins": {
            "label": "Wins",
            "value": true
        },
        "Saves": {
            "label": "Saves",
            "value": true
        },
        "TurtleGoals": {
            "label": "Turtle Goals",
            "value": true
        }
    };

    $scope.textAreaPlaceholder = "Paste your json file contents here.";
    $scope.filtersArrow = "up";
    var fullList = [];

    function loadJsonInventory(input){
        console.log("raw input: ", input);
        var parsedInput;
        try{
            parsedInput = JSON.parse(input);
        } catch(e){
            alert("Malformed JSON input.");
            return;
        }
        console.log("parsed input: ", parsedInput);
        if(parsedInput != undefined && parsedInput.inventory){
            fullList = parsedInput.inventory;
            $scope.displayList = parsedInput.inventory.map(_mapCallback);
            console.log("items in $scope", $scope.displayList);
            // getPaintColors();
            // getCertTypes();
        } else
            alert("Unexpected JSON format. Please copy entire contents of inventory.json file.");
    }

    function _mapCallback(ele) {
        var res = Object.assign(ele, {"blueprint_item": ""});
        return res;
    }

    function filterOpenClose(column){
        if($scope[column] == "up"){
            $scope[column] = "down";
        } else if($scope[column] == "down"){
            $scope[column] = "up";
        }
    }

    function setOrderBy(property){
        if($scope.orderByField == property){
            $scope.reverseBool = !$scope.reverseBool;
        } else {
            $scope.reverseBool = false;
        }
        $scope.orderByField = property;
    }

    function updateAllCheckboxes(group, value){
        var keys = Object.keys($scope.filterOptions[group]);
        for(var cb in keys){
            $scope.filterOptions[group][keys[cb]].value = value;
        }
    }

    function resetAllFilters(){
        updateAllCheckboxes("itemPaints", true);
        updateAllCheckboxes("itemCerts", true);
        updateAllCheckboxes("itemTypes", true);
        updateAllCheckboxes("itemQualities", true);
        updateAllCheckboxes("itemTradeable", true);
        $scope.query = "";
    }

    function getPaintColors(){
        var res = [];
        for(var item in $scope.displayList){
            if(res.indexOf($scope.displayList[item].paint) == -1)
                res.push($scope.displayList[item].paint);
        }
        console.log(res);
    }

    function getCertTypes(){
        var res = [];
        for(var item in $scope.displayList){
            if(res.indexOf($scope.displayList[item].certification) == -1)
                res.push($scope.displayList[item].certification);
        }
        console.log(res);
    }
});
