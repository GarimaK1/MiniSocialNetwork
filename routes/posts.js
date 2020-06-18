const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuthToken');
const Post = require('../models/Post');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post('/',
    checkAuth,
    [
        // We are getting user, name and avatar from token. So no need to check that.
        check('text', 'Text field is required.').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await User.findById(req.user.id).select('-password');

            const post = new Post({
                user: req.user.id,
                text: req.body.text,
                name: user.name,
                avatar: user.avatar
            });

            const postCreated = await post.save();

            res.json(postCreated);
        } catch (error) {
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    });

// @route   Get /api/posts
// @desc    Get all posts by all users
// @access  Private
// Can't see posts page till we login. So private.
// Any user token will do. But must have a token.
router.get('/', checkAuth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        if (!posts) return res.status(404).json({ msg: 'There are no posts to display.' });

        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}
);

// @route   Get /api/posts/:postId
// @desc    Get post by postId
// @access  Private
router.get('/:postId',
    checkAuth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) return res.status(404).json({ msg: 'Post not found.' });

            // check if this post belongs to this logged in user
            // console.log(typeof post.user);
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Unauthorized access to post.' });
            }

            res.json(post);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found.' });
            }
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// @route   Delete /api/posts/:postId
// @desc    Delete post by postId
// @access  Private
router.delete('/:postId',
    checkAuth,
    async (req, res) => {
        try {
            const post = await Post.findById(req.params.postId);

            if (!post) return res.status(404).json({ msg: 'Post not found.' });

            // check if this post belongs to this logged in user
            // console.log(typeof post.user);
            if (post.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'Unauthorized access to post.' });
            }

            await post.remove();

            res.json({ msg: 'Post deleted.' });
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found.' });
            }
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    }
);

// @route   PUT /api/posts/:postId/like
// @desc    Like a post
// @access  Private
router.put('/:postId/like', checkAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ msg: 'Post not found.' });

        // Check if post has already been liked by user
        if (post.likes.find(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Post already liked by user.' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route   Delete /api/posts/:postId/unlike
// @desc    Unlike a liked post (a user can like a post only once)
// @access  Private
router.delete('/:postId/unlike', checkAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ msg: 'Post not found.' });

        // Check if post has already been liked by user
        if (!post.likes.find(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Post has not yet been liked by user.' });
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        if (removeIndex > 0) post.likes.splice(removeIndex, 1);
        else console.log('removeIndex= -1');

        // Or filter it out
        // const likeToRemove = post.likes.filter(like => like.user.toString() !== req.user.id);

        await post.save();
        res.json(post.likes);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});

// @route   PUT /api/posts/:postId/comment
// @desc    Comment on a post
// @access  Private
router.put('/:postId/comment',
    checkAuth,
    [
        check('text', 'Text field is required for comment').notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.postId);

            if (!post) return res.status(404).json({ msg: 'Post not found.' });

            const comment = {
                text: req.body.text,
                user: req.user.id,
                name: user.name,
                avatar: user.avatar
            };

            post.comments.unshift(comment);
            await post.save();
            res.json(post.comments);
        } catch (error) {
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ msg: 'Post not found.' });
            }
            console.log(error);
            res.status(500).send('Internal Server Error');
        }
    });

// @route   Delete /api/posts/:postId/comment/:commentId
// @desc    Delete a comment by commentId and postID
// @access  Private
// One user can comment multiple times
router.delete('/:postId/comment/:commentId', checkAuth, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const post = await Post.findById(req.params.postId);

        if (!post) return res.status(404).json({ msg: 'Post not found.' });
        
        // Pull out comment
        const comment = post.comments.find(comment => comment.id === req.params.commentId);

        if (!comment) return res.status(404).json({ msg: 'Comment does not exist.' });

        // Check user created that comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized access to comment.' });
        }

        const removeIndex = post.comments.map(comment => comment.id).indexOf(req.params.commentId);
        post.comments.splice(removeIndex, 1);

        // Or filter it out.
        // const commentToRemove = post.comments.filter(comment => comment.id !== req.params.commentId); 

        await post.save();
        res.json(post.comments);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found.' });
        }
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;