const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'questions', required: true },
    title: { type: String, default: 'demo option' },
    isCorrect: { type: Boolean, default: false }
}, {
    collection: 'option',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
module.exports = mongoose.model('option', optionSchema);