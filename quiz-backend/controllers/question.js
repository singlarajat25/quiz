const { getAllQuestions, save, getQuestionDetails, update } = require('../dbServices/question');
const { get, saveMany } = require('../dbServices/option');
const { handleError, handleResponse } = require('../middlewares/requestHandlers');

const { ObjectId } = require('mongoose').Types;

exports.getAllQuestion = async (req, res) => {
    try {
        const list = await getAllQuestions();
        handleResponse({ res, data: list });
    } catch (err) {
        handleError({ res, err });
    }
};

exports.getQuestionDetails = async ({ params: { questionId } }, res) => {
    try {
        const question = await getQuestionDetails(questionId);
        handleResponse({ res, data: question });
    } catch (err) {
        handleError({ res, err });
    }
}

exports.addQuestion = async ({ body: { title, marks, options } }, res) => {
    try {
        const question = await save({ title, marks });
        await saveMany(options, question._id);
        handleResponse({ res, msg: 'Question added successfully', data: question });
    } catch (err) {
        handleError({ res, err });
    }
}

exports.evaluateAnswer = async ({ body: { questionId, optionId } }, res) => {
    try {
        const { isCorrect } = await get(questionId, optionId);
        const question = await update(questionId, isCorrect);
        handleResponse({res, data: question })
    } catch (err) {
        handleError({ res, err });
    }
}