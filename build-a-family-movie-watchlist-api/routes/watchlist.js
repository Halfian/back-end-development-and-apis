import express from 'express';
import { getWatchlist, addMovie, updateMovie, deleteMovie } from '../utils/db.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeModification } from '../middleware/authorize.js';

const router = express.Router();

router.get("/:userId", authenticate, (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const watchlist = getWatchlist(userId);

    res.status(200).json(watchlist || []);
});

router.post("/:userId/movies", authenticate, authorizeModification, (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieData = req.body;

    const newMovie = addMovie(userId, movieData);
    res.status(201).json(newMovie);
});

router.put("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieId = parseInt(req.params.movieId);
    const updates = req.body;
    
    const updatedMovie = updateMovie(userId, movieId, updates);
    if (!updatedMovie) {
        return res.status(404).json({ error: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
});

router.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    const userId = parseInt(req.params.userId);
    const movieId = parseInt(req.params.movieId);

    const deleted = deleteMovie(userId, movieId);
    if (!deleted) {
        return res.status(404).json({ "message": "Movie not found" })
    }
    res.status(200).json({ message: "Movie removed successfully" });
})

export default router;