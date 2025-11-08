const { Router } = require("express");


const router = Router();


router.get('/', (req, res) => {
    res.status(200).json(
        {
            msg: 'API GET - ALL',
        }
    )
})

router.get('/:id', (req, res) => {
    res.status(200).json(
        {
            msg: 'API GET - ID',
        }
    )
})

router.post('/', (req, res) => {
    res.status(200).json(
        {
            msg: 'API POST',
        }
    )
})


router.put('/:id', (req, res) => {
    res.status(200).json(
        {
            msg: 'API PUT',
        }
    )
})


router.delete('/:id', (req, res) => {
    res.status(200).json(
        {
            msg: 'API DELETE',
        }
    )
})

module.exports = router;