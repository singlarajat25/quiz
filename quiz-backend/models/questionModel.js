const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: { type: String, default: 'demo question' },
    isAttempted: { type: Boolean, default: false },
    marks: { type: Number, min: 1, max: 10, default: 1 },
    isAnsweredCorrectly: { type: String, enum: ['', 'true', 'false'], default: '' }
}, {
    collection: 'question',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
module.exports = mongoose.model('question', questionSchema);