// import express from "express";
//
// import Note from '../models/Note.js';
//
// import {faker} from "@faker-js/faker";
//
// const routes = express.Router();
//
//
// // routes.get("/", async(req, res)=>{
// //     res.send("Hello World")
// // });
//
// routes.post('/seed',async (req, res)=>{
//
//     console.log('Seed DB');
// if (req.body?.METHOD ==='SEED'){
//
//     await Note.deleteMany({});
//
//     for (let i =0; i < 10;i++){
//         await Note.create({
//             title:faker.lorem.sentence({min:3, max:10}),
//             body: faker.lorem.paragraph(2),
//             author: faker.internet.userName()
//         })
//     }
//
//     res.json({
//         message:"Het werkt"
//     })
//
// }else{
//     res.status(400).json({
//         message:"Method not implemented"
//     })
// }
// });
// const checkAcceptHeader = (req, res, next) => {
//     const acceptHeader = req.get('Accept');
//
//     if (acceptHeader !== 'application/json') {
//         return res.status(406).json({ message: 'Not Acceptable. Only application/json is allowed.' });
//     }
//
//     next();
// };
// // const createPagination = (total, start, limit) => {
//     const currentItems = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return total;
//         }
//
//         const calculatedItems = Math.min(limit, total - start);
//         return calculatedItems < 0 ? 0 : calculatedItems;
//     };
//
//     const numberOfPages = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return Math.ceil(total / 12); // 12 is het aantal items per pagina (itemsPerPage)
//         }
//
//         const calculatedPages = Math.ceil(currentItems(total, start, limit) / 12);
//         return calculatedPages < 0 ? 0 : calculatedPages;
//     };
//
//     const currentPage = (start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return 1;
//         }
//
//         return Math.floor(start / limit) + 1;
//     };
//
//     const firstPageItem = (start, limit) => {
//         return isNaN(start) ? 1 : start + 1;
//     };
//
//     const lastPageItem = (total, start, limit) => {
//         return isNaN(start) || isNaN(limit) ? total : Math.min(start + limit, total);
//     };
//
//     const previousPageItem = (total, start, limit) => {
//         return Math.max(firstPageItem(start, limit) - limit, 1);
//     };
//
//     const nextPageItem = (total, start, limit) => {
//         return Math.min(lastPageItem(total, start, limit) + 1, total + 1);
//     };
//
//     const getFirstQueryString = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return '';
//         }
//
//         return `?start=1&limit=${limit}`;
//     };
//
//     const getLastQueryString = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return '';
//         }
//
//         const lastStart = lastPageItem(total, start, limit);
//         return `?start=${lastStart}&limit=${limit}`;
//     };
//
//     const getPreviousQueryString = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit) || start <= 0) {
//             return '';
//         }
//
//         const previousStart = previousPageItem(total, start, limit);
//         return `?start=${previousStart}&limit=${limit}`;
//     };
//
//     const getNextQueryString = (total, start, limit) => {
//         if (isNaN(start) || isNaN(limit)) {
//             return '';
//         }
//
//         const nextStart = nextPageItem(total, start, limit);
//         return `?start=${nextStart}&limit=${limit}`;
//     };
//
//     const itemToPageNumber = (total, start, limit, itemNumber) => {
//         if (isNaN(start) || isNaN(limit) || isNaN(itemNumber) || itemNumber < 1) {
//             return 1;
//         }
//
//         const itemsPerPage = limit;
//         const offset = start;
//         const index = itemNumber - 1;
//
//         if (index < 0) {
//             return 1;
//         }
//
//         const pageNumber = Math.floor((offset + index) / itemsPerPage) + 1;
//         return pageNumber;
//     };
//
//     // return {
//     //     currentItems,
//     //     numberOfPages,
//     //     currentPage,
//     //     firstPageItem,
//     //     lastPageItem,
//     //     previousPageItem,
//     //     nextPageItem,
//     //     getFirstQueryString,
//     //     getLastQueryString,
//     //     getPreviousQueryString,
//     //     getNextQueryString,
//     //     itemToPageNumber,
//     //
//     // };
// // };
//
//
// const createPagination = (total, start, limit) => {
//     return {
//         currentItems: currentItems(total, start, limit),
//         totalPages: numberOfPages(total, start, limit),
//         totalItems: total,
//         currentPage: currentPage(start, limit),
//         firstPageItem: firstPageItem(start, limit),
//         lastPageItem: lastPageItem(total, start, limit),
//         previousPageItem: previousPageItem(total, start, limit),
//         nextPageItem: nextPageItem(total, start, limit),
//         firstQueryString: getFirstQueryString(total, start, limit),
//         lastQueryString: getLastQueryString(total, start, limit),
//         previousQueryString: getPreviousQueryString(total, start, limit),
//         nextQueryString: getNextQueryString(total, start, limit),
//
//     };
// };
//
//
// routes.get('/', checkAcceptHeader, async (req, res) => {
//     try {
//         const itemsPerPage = 12;
//         const start = parseInt(req.query.start);
//         const limit = parseInt(req.query.limit);
//         const itemNumber = parseInt(req.query.limit);
//
//         let totalItems;
//         let query = Note.find({});
//
//         if (!isNaN(start) && !isNaN(limit)) {
//             query = query.skip(start).limit(limit);
//         }else {
//             // Calculate totalItems without considering limit
//             totalItems = await Note.countDocuments();
//             query = query.skip(start).limit(itemsPerPage); // Use a default limit if not provided
//         }
//
//
//
//
//         const pagination = createPagination(totalItems, start, limit);
//
//         const notes = await Note.find({}).skip().limit();
//
//
//         let items = notes.map((note) => {
//             const noteObject = note.toObject();
//             return {
//                 ...noteObject,
//                 _links: {
//                     self: { href: `${req.protocol}://${req.get('host')}/notes/${note._id}` }
//                 }
//             };
//         });
//
//         const response = {
//             items: items,
//             _links: {
//                 self: { href: `${req.protocol}://${req.get('host')}/notes` }
//             },
//             pagination: {
//                 currentPage: "pagination.currentPage",
//                 currentItems: "pagination.currentItems",
//                 totalPages: "pagination.totalPages",
//                 totalItems: "pagination.totalItems",
//                 _links: {
//                     first: {
//                         page: 1,
//                         href:" `${req.protocol}://${req.get('host')}/notes${pagination.firstQueryString}`"
//                     },
//                     last: {
//                         page:" pagination.totalPages",
//                         href: "${req.protocol}://${req.get('host')}/notes${pagination.lastQueryString}"
//                     },
//                     previous: "pagination.previousQueryString !== '' "? {
//                         page: "pagination.currentPage - 1",
//                         href: "${req.protocol}://${req.get('host')}/notes${pagination.previousQueryString}"
//                     } : null,
//                     next:  {
//                         page:" pagination.currentPage + 1,",
//                         href: "${req.protocol}://${req.get('host')}/notes${pagination.nextQueryString}"
//                     },
//
//                 }
//             }
//         };
//
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Add other allowed methods if needed
//         res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//
//         res.json(response);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });
//
// const checkContentTypeHeader = (req, res, next) => {
//     const contentTypeHeader = req.get('Content-Type');
//
//     if (!contentTypeHeader || (contentTypeHeader !== 'application/json' && contentTypeHeader !== 'application/x-www-form-urlencoded')) {
//         return res.status(415).json({ message: 'Unsupported Media Type. Only application/json and application/x-www-form-urlencoded are allowed.' });
//     }
//
//     next();
// };
//
//
//
// routes.post('/', checkContentTypeHeader, async (req, res) => {
//     const contentType = req.get('Content-Type');
//
//     if (
//         contentType !== 'application/json' &&
//         contentType !== 'application/x-www-form-urlencoded'
//     ) {
//         res.status(415).json({ message: 'Unsupported Media Type' });
//         return;
//     }
//
//     const { title, body, author } = req.body;
//
//     if (!title || !body || !author) {
//         res.status(400).json({ message: 'Fields "title", "body", and "author" are required' });
//         return;
//     }
//
//     try {
//         const newNote = await Note.create({
//             title,
//             body,
//             author,
//         });
//
//         // Voeg Access-Control-Allow-Origin en Access-Control-Allow-Headers toe
//         res.header('Access-Control-Allow-Origin', '*');
//         res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Voeg Access-Control-Allow-Headers toe
//         res.status(201).json({
//             message: 'Note created successfully',
//             createdNote: {
//                 id: newNote._id,
//                 title: newNote.title,
//                 body: newNote.body,
//                 author: newNote.author,
//                 _links: {
//                     self: { href: `${req.protocol}://${req.get('host')}/Notes/${newNote._id}` },
//                     collection: { href: `${req.protocol}://${req.get('host')}/notes` }
//                 }
//             }
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
//
//
//
//
//
//
//
//
//
//
// routes.options("/", (req, res) => {
//     // Specify allowed methods in the response header
//     res.header('Allow', 'GET, POST, OPTIONS');
//     res.sendStatus(200);
// });
//
//
//
// // GET detail resource
// routes.get('/:id', async (req, res) => {
//     try {
//         const note = await Note.findById(req.params.id);
//
//         if (!note) {
//             return res.status(404).json({ message: 'Note not found' });
//         }
//         const noteObject = note.toObject();
//         const response = {
//             ...noteObject,
//             _links: {
//                 self: { href: `${req.protocol}://${req.get('host')}/notes/${note._id}` },
//                 collection: { href: `${req.protocol}://${req.get('host')}/notes` }
//             }
//         };
//
//
//         res.json(response);
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({ message: 'Internal Server Error' });
//     }
// });
//
//
// routes.options('/:id', (req, res) => {
//     res.header('Allow', 'GET, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Origin', '*'); // Voeg Access-Control-Allow-Origin toe
//     res.header('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.sendStatus(200);
// });
//
//
// routes.delete('/:id', async (req, res) => {
//     try {
//         const deletedNote = await Note.findByIdAndDelete(req.params.id);
//
//         if (!deletedNote) {
//             return res.status(404).json({ message: 'Note not found' });
//         }
//
//         // Respond with a 204 status code for a successful deletion
//         res.status(204).send();
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
//
//
// routes.put('/:id', async (req, res) => {
//     try {
//         // Retrieve the updated values from the request body
//         const { title, body, author } = req.body;
//
//         // Check if any of the required fields are empty
//         if (!title || !body || !author) {
//             return res.status(400).json({ message: 'Fields "title", "body", and "author" are required' });
//         }
//
//         // Update the note with the new values
//         const updatedNote = await Note.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title,
//                 body,
//                 author,
//             },
//             { new: true }
//         );
//
//         // Check if the note with the given ID exists
//         if (!updatedNote) {
//             return res.status(404).json({ message: 'Note not found' });
//         }
//
//         // Return the updated note
//         res.json(updatedNote);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });
//
//
// export default routes;