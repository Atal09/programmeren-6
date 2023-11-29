import express from "express";

import Note from '../models/Note.js';

const routes = express.Router();

routes.post('/seed',async (req, res)=>{

    console.log('Seed DB');
    await Note.deleteMany({});

    for (let i =0; i<10;i++){
        await Note.create({
            title:faker.lorem.sentence({min:3, max:10}),
            body: faker.lorem.paragraph(),
            author: faker.lorem
        })
    }

    res.json({
        message:"Het werkt"
    })
});





export default routes;