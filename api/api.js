import bodyParser from 'body-parser';
import express from 'express';

export const api = express.Router();

api.use(bodyParser.urlencoded({extended: true}));
api.use(bodyParser.json({limit: '1mb'}));

api.get("/", async(req, res, next) => {
    return res.json({message: "hello Api"})
})