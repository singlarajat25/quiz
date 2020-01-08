const { ObjectId } = require('mongoose').Types;
const Model = require('../models/questionModel');

exports.getAllQuestions = async () => {
    try {
        const data = await Model.find({}, { marks: 0, created_at: 0, updated_at: 0 });
        return data;
    } catch (err) {
        throw err;
    }
}

exports.save = async data => {
    try {
        const question = await new Model(data).save();
        return question;
    } catch (err) {
        throw err;
    }
}

exports.update = async (_id, flag) => {
    try {
        const { nModified } = await Model.updateOne(
            { _id: ObjectId(_id) },
            { $set: { isAnsweredCorrectly: flag, isAttempted: true } },
            { runValidators: true }
        );
        if (!!nModified) {
            return this.getQuestionDetails(_id);
        }
    } catch (err) {
        throw err;
    }
}

exports.getQuestionDetails = async questionId => {
    try {
        const data = await Model.aggregate([
            {
                $match: { _id: ObjectId(questionId) }
            },
            {
                $lookup: {
                    from: "option",
                    let: { "questionId": "$_id" },
                    pipeline: [
                        {
                            $match: {
                                "$expr": { "$eq": ["$questionId", "$$questionId"] }
                            }
                        },
                        {
                            $project: {
                                "title": 1,
                                "status": 1
                            }
                        }
                    ],
                    as: "options"
                }
            },
            {
                $project: {
                    "title": 1,
                    "marks": 1,
                    "options": 1,
                    "isAttempted": 1,
                    "isAnsweredCorrectly": 1
                }
            }
        ]);
        const { progressPercentage } = await this.getQuizProgress();
        data[0].progress = progressPercentage;
        return data[0];
    } catch (err) {
        throw err;
    }
}

exports.getQuizProgress = async () => {
    try {
        let progress = await Model.aggregate([
            {
                $group: {
                    "_id": null,
                    "totalMarks": { "$sum": "$marks" },
                    "questions": { "$push": "$$ROOT" }
                }
            },
            {
                $unwind: '$questions'
            },
            {
                $group: {
                    "_id": {
                        "isAnsweredCorrectly": "$questions.isAnsweredCorrectly",
                        "totalMarks": "$totalMarks"
                    },
                    "questions": {
                        "$push": {
                            "title": "$questions.title",
                            "isAttempted": "$questions.isAttempted",
                            "marks": "$questions.marks",
                            "_id": "$questions._id"
                        }
                    }
                }
            },
            {
                $match: {
                    "_id.isAnsweredCorrectly": { "$ne": "" }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "categoryWiseMarks": {
                        "$cond": [
                            {
                                "$eq": ["$_id.isAnsweredCorrectly", "true"]
                            },
                            {
                                "$sum": "$questions.marks"
                            },
                            {
                                "$multiply": [-0.25, { "$sum": "$questions.marks" }]
                            }
                        ]
                    },
                    "isAnsweredCorrectly": "$_id.isAnsweredCorrectly",
                    "totalMarks": "$_id.totalMarks"
                }
            },
            {
                $group: {
                    "_id": "$totalMarks",
                    "marksObtained": { "$sum": "$categoryWiseMarks" }
                }
            },
            {
                $project: {
                    "_id": 0,
                    "progressPercentage": {
                        "$multiply": [{ "$divide": ["$marksObtained", "$_id"] }, 100]
                    }
                }
            }
        ]);
        progress = (progress.length < 1 || progress[0].progressPercentage < 0) ? [{ progressPercentage: 0 }] : progress;
        return progress[0];
    } catch (err) {
        throw err;
    }
};