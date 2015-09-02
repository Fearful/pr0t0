var mongoose = require('mongoose')
   ,Schema = mongoose.Schema,
   ObjectId = Schema.Types.ObjectId;
 
var templateSchema = new Schema({
    created: {type: Date, default: Date.now},
    lastModified: {type: Date, default: Date.now},
    lastModifiedBy: {type: Date, default: Date.now},
    description: {type: String, default: ''},
    mainFile: {type: String, default: ''},
    version: {type: String, default: '0.0.0'},
    name: {type: String, default: ''},
    owner: {type: String},
    path: {type: String},
    id: {type: ObjectId}
});
 
module.exports = mongoose.model('Template', templateSchema, 'templates');