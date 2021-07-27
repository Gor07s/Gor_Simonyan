const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.raw());

let wordsForData = []

function wordFinder(word){
    let start = null
    if(word.includes("{") && word.includes("}")) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === "{") {
                start = i
            }
            else if (word[i] === "}") {
                if (start !== null) {
                    wordsForData.push(word.slice(start + 1, i))
                    let newWord = word.replace(word.slice(start, i + 1), "")
                    wordFinder(newWord)
                    return
                }
            }
        }
    }
}

const check = app.use(async (req, res, next) => {
    wordsForData = []
    const text = (req.body.templateText).split(" ")
    const words = text.map(word => word).filter(word => word.includes("{" && "}"))
    await words.forEach(word => wordFinder(word))
    next()
});

const getWords = () => {
    const words = new Set(wordsForData)
    return Array.from(words)
}

module.exports = { check, getWords };