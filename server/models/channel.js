var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChannelSchema = new Schema({

    name: {
        type: String,
        index: true,
        required: true
    },
    // slug: {
    //     type: String,
    //     lowercase: true,
    //     trim: true
    // },
    created: Date,
    // updated: [Date],
    creator: {
        type: Schema.ObjectId,
        ref: 'User'
    },

    // Messages: {
    //     body : String,
    //     timestamp : Date,
    //     uid : String
    // }


});

/**
 * Pre hook.
 */

ChannelSchema.pre('save', function(next, done){
    if (this.isNew)
        this.created = Date.now();

    // this.updated.push(Date.now());

    next();
});

/**
 * Statics
 */
ChannelSchema.statics = {
    load: function(id, cb) {
        this.findOne({
            _id: id
        }).populate('creator', 'username').exec(cb);
    }
};

/**
 * Methods
 */

ChannelSchema.statics.findByContent = function (content, callback) {
    return this.find({ content: content }, callback);
}

ChannelSchema.methods.expressiveQuery = function (creator, date, callback) {
    return this.find('creator', creator).where('date').gte(date).run(callback);
}

/**
 * Plugins
 */

// function slugGenerator (options){
//     options = options || {};
//     var key = options.key || 'content';
//
//     return function slugGenerator(schema){
//         schema.path(key).set(function(v){
//             this.slug = v.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/-+/g, '');
//             return v;
//         });
//     };
// };
//
// ChannelSchema.plugin(slugGenerator());

/**
 * Define model.
 */

mongoose.model('Channel', ChannelSchema);

