import mongoose from "mongoose";

const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: String,
    body: String,
    author: String

});
const Movie = mongoose.model('Movie', movieSchema);

export default Movie