import express from "express";

import Note from '../models/Note.js';

import {faker} from "@faker-js/faker";

const routes = express.Router();


// routes.get("/", async(req, res)=>{
//     res.send("Hello World")
// });

routes.post('/seed',async (req, res)=>{

    console.log('Seed DB');
if (req.body?.METHOD ==='SEED'){

    await Note.deleteMany({});

    for (let i =0; i < 10;i++){
        await Note.create({
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
const checkAcceptHeader = (req, res, next) => {
    const acceptHeader = req.get('Accept');

    if (acceptHeader !== 'application/json') {
        return res.status(406).json({ message: 'Not Acceptable. Only application/json is allowed.' });
    }

    next();
};

routes.get('/', checkAcceptHeader, async (req, res) => {
    try {
        const itemsPerPage = 12;
        const start = parseInt(req.query.start);
        const limit = parseInt(req.query.limit);

        let query = Note.find({});

        if (!isNaN(start) && !isNaN(limit)) {
            query = query.skip(start).limit(limit);
        }

        const notes = await query.exec();

        const totalItems = await Note.countDocuments();
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        const result = {
            items: notes.map(note => ({
                id: note._id,
                title: note.title,
                body: note.body,
                date: note.date,
                _links: {
                    self: {
                        href: `https://docent.cmi.hro.nl/bootb/demo/notes/${note._id}`,
                    },
                    collection: {
                        href: `https://docent.cmi.hro.nl/bootb/demo/notes/`,
                    },
                },
            })),
            pagination: {
                currentItems: notes.length,
                totalPages: totalPages,
                totalItems: totalItems,
            }
        };

        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const checkContentTypeHeader = (req, res, next) => {
    const contentTypeHeader = req.get('Content-Type');

    if (!contentTypeHeader || (contentTypeHeader !== 'application/json' && contentTypeHeader !== 'application/x-www-form-urlencoded')) {
        return res.status(415).json({ message: 'Unsupported Media Type. Only application/json and application/x-www-form-urlencoded are allowed.' });
    }

    next();
};

routes.post('/', checkContentTypeHeader,async (req, res)=>{


    for (let i =0; i < 10;i++){
            await Note.create({
                title:faker.lorem.sentence({min:3, max:10}),
                body: faker.lorem.paragraph(2),
                author: faker.internet.userName()
            })
        }
        res.json({
            message:"Het werkt"
        })
});









routes.options("/", (req, res) => {
    // Specify allowed methods in the response header
    res.header('Allow', 'GET, POST, OPTIONS');
    res.sendStatus(200);
});



// GET detail resource
routes.get('/:id', async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(note);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Internal Server Error' });
    }
});


routes.options('/:id', (req, res) => {
    // Specify allowed methods in the response header
    res.header('Allow', 'GET, OPTIONS');
    res.sendStatus(200);
});

routes.delete('/:id', async (req, res) => {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

routes.put('/:id', async (req, res) => {
    try {
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            {
                title:faker.lorem.sentence({min:3, max:10}),
                body: faker.lorem.paragraph(2),
                author: faker.internet.userName()

            },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        res.json(updatedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default routes;