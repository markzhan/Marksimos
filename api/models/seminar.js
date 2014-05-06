var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var seminarSchema = new Schema({
    simulationSpan: Number
});

exports.getSeminarSetting = function(){
    var deferred = Q.defer();
    process.nextTick(function(){
        deferred.resolve({
            simulationSpan: 3
        });
    });
    return deferred.promise;
}