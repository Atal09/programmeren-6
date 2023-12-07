import express from "express";

import Movie from '../models/Movie.js';

import {faker} from "@faker-js/faker";

const routes = express.Router();


routes.get("/", (req, res)=>{
    res.send("Hello World")
});

routes.post('/seed',async (req, res)=>{

    console.log('Seed DB');
    if (req.body?.METHOD ==='SEED'){

        await Movie.deleteMany({});

        for (let i =0; i < 10;i++){
            await Movie.create({
                title:faker.lorem.sentence({min:3, max:10}),
                body: faker.lorem.paragraph(2),
                author: faker.internet.userName()
            })
        }

        res.json({
            message:"Het werkt"
        })

    }else{
        res.status(400).json({
            message:"Method not implemented"
        })
    }
});



routes.options("/", (req, res) => {
    // Specify allowed methods in the response header
    res.header('Allow', 'GET, POST, OPTIONS');
    res.sendStatus(200);
});




export default routes;