// var BSON = require('bson');
//
//
// var input = {"player":1,"id":"#p8","position":[2,1],"box":[3,2]};
//
//
//
// var bson = new BSON();
//
// var data = bson.serialize(input);
// console.log(data);
//
// var data1 = bson.deserialize(data);
// console.log(data1);
//
var GSON= require('gson');
var input = {"player":1,"id":"#p8","position":[2,1],"box":[3,2]};
var g = GSON.encode(input);
