const { ObjectId } = require('mongoose').Types;
const Model = require('../models/optionModel');

exports.get = async (questionId, optionId) => {
    try {
        const option = await Model.findOne({ _id: ObjectId(optionId), questionId: ObjectId(questionId) });
        return option;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

exports.saveMany = async (data, questionId) => {
    try {
        data.map(option => {
            option.questionId = questionId;
        })
        await Model.insertMany(data);
        return true;
    } catch (err) {
        throw err;
    }
}