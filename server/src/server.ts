import cors from 'cors'
import express, { Request, Response } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { MongoDB } from './service/MongoDB.service'

const app = express()
const PORT = 8800
const mongodb = new MongoDB()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// POST
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join('src', 'images')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const _id = req.query._id
    if (_id) {
      const ext = path.extname(file.originalname)
      const filename = `${_id}${ext}`
      cb(null, filename)
    }
  },
})

const upload = multer({ storage: storage })

app.post('/admin', (req: Request, res: Response) => {
  const { email, password } = req.body
})

app.post('/edit', upload.single('image'), async (req: Request, res: Response) => {
  await mongodb.connect()
  const data = req.body
  await mongodb.EditStreet(data)
  await mongodb.disconnect()
  res.status(200).send("Successfully")
})

app.post('/add', upload.single('image'), async (req: Request, res: Response) => {
  await mongodb.connect()
  const data = req.body
  await mongodb.AddStreet(data)
  await mongodb.disconnect()
  res.status(200).send("Successfully")
})

app.post('/delete', async (req: Request, res: Response) => {
  await mongodb.connect()
  const data = req.body
  await mongodb.DeleteStreet(data)
  const articles = await mongodb.articles()
  await mongodb.disconnect()
  res.json(articles)
})

// GET

app.get('/', async (req: Request, res: Response) => {
  res.json("Hello World")
})

app.get('/names_streets', async (req: Request, res: Response) => {
  await mongodb.connect()
  const names = await mongodb.namesArticles()
  await mongodb.disconnect()
  res.json(names)
})

app.get('/all_article', async (req: Request, res: Response) => {
  await mongodb.connect()
  const articles = await mongodb.articles()
  await mongodb.disconnect()
  res.json(articles)
})

app.get('/image/:_id', (req: Request, res: Response) => {
  const _id = req.params._id
  const supportedFormats = ['webp', 'png', 'jpg', 'jpeg']
  const dir = path.join(__dirname, 'images')
  console.log(dir)
  const files = fs.readdirSync(dir)
  const file = files.find(name => {
    for (const format of supportedFormats) {
      if (name.endsWith(`.${format}`) && name.split(`.${format}`)[0] === _id) {
        return true
      }
    }
    return false
  })
  if (!!file) {
    res.sendFile(`${__dirname}/images/${file}`)
  } else {
    res.send({ error: '404' })
  }
})

app.get('/street/:_id', async (req: Request, res: Response) => {
  const _id = req.params._id
  await mongodb.connect()
  const article = await mongodb.article(_id)
  await mongodb.disconnect()
  res.json(article)
})

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`)
})