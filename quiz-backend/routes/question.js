const express = require('express');
const router = express.Router();

const { getAllQuestion, addQuestion, getQuestionDetails, evaluateAnswer } = require('../controllers/question');


/* GET questions listing. */
router.get('/', getAllQuestion);
router.get('/:questionId', getQuestionDetails);
router.post('/evaluate-answer', evaluateAnswer);
router.post('/', addQuestion);

module.exports = router;
