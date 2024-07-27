const express = require('express')
const redis = require('../redis')
const router = express.Router()

router.get('/', async (req, res) => {
  const added_todos = parseInt(await redis.getAsync('added_todos')) || 0;
  res.status(200).json({
    added_todos,
  })
})

module.exports = router;