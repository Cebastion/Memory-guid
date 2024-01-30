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
let fileCounter = 0

// POST
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folderName = req.params.folder
    const dir = path.join('src', 'img', folderName, 'hero')
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    if (ext !== '.png') {
      return cb(new Error('Only png files are allowed'), null)
    }

    fileCounter++
    const filename = `hero_${fileCounter}${ext}`
    cb(null, filename)
  },
})

const upload = multer({ storage: storage })

app.post('/upload/:folder', upload.array('images', 2), (req, res) => {
  if (!req.files || req.files.length === 0) {
    console.log('error')
    return res.status(400).send('No files uploaded.')
  }

  res.status(200).send('Files uploaded successfully.')
})
app.post('/admin', (req: Request, res: Response) => {
  const { email, password } = req.body
})

app.post('/edit', async (req: Request, res: Response) => {
  const data = req.body
  await mongodb.EditStreet(data)
})

app.post('/add', async (req: Request, res: Response) => {
  const data = req.body
  await mongodb.AddStreet(data)
})

app.post('/delete', async (req: Request, res: Response) => {
  const data = req.body
  await mongodb.DeleteStreet(data)
  const articles = await mongodb.articles()
  res.json(articles)
})

// GET

app.get('/', async (req: Request, res: Response) => {
  res.json("Hello World")
})

app.get('/names_streets', async (req: Request, res: Response) => {
  const names = await mongodb.namesArticles()
  res.json(names)
})

app.get('/all_article', async (req: Request, res: Response) => {
  const articles = await mongodb.articles()
  res.json(articles)
})

app.get('/:name_street/:type/:id', (req: Request, res: Response) => {
  const name_street = req.params.name_street
  const id = req.params.id
  const type = req.params.type
  const photo = (__dirname + `/img/${name_street}/${type}/${type}_${id}.webp`)
  if (!!photo) {
    res.sendFile(photo)
  } else {
    res.send({ error: '404' })
  }
})

app.get('/name_street/:name_street', async (req: Request, res: Response) => {
  const name_street = req.params.name_street
  const article = await mongodb.article(name_street)
  res.json(article)
})

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`)
})

function fileUpload(): any {
  throw new Error('Function not implemented.')
}
