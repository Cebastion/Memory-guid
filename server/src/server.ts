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
    const folderName = req.params.folder
    const files = fs.readdirSync(path.join('src', 'img', folderName, 'hero'))
    if (files.length === 0) {
      const ext = path.extname(file.originalname)

      fileCounter++
      const filename = `hero_${fileCounter}${ext}`
      cb(null, filename)
    } else {
      const ext = path.extname(file.originalname)

      const filename = `hero_${files.length + 1}${ext}`
      cb(null, filename)
    }
  },
})

const upload = multer({ storage: storage })

app.post('/upload/:folder', upload.array('images'), (req: Request, res: Response) => {
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

app.post('/delete_img/:folder/:name_img', (req: Request, res: Response) => {
  const folder = req.params.folder
  const name_img = req.params.name_img
  const supportedFormats = ['webp', 'png', 'jpg']
  const files = fs.readdirSync(path.join('src', 'img', folder, 'hero'))
  const file = files.find(name => {
    for (const format of supportedFormats) {
      if (name.endsWith(`.${format}`) && name.split(`.${format}`)[0] === name_img) {
        return true;
      }
    }
    return false;
  });
  const pathImg = path.join('src', 'img', folder, 'hero', file)
  fs.unlinkSync(pathImg)

  const files_new = fs.readdirSync(path.join('src', 'img', folder, 'hero'))

  if (files_new.length > 0) {
    files_new.forEach((file, index) => {
      const oldPath = path.join('src', 'img', folder, 'hero', file);
      const fileExtension = path.extname(file);
  
      const newNumber = index + 1;
      const newName = `hero_${newNumber}${fileExtension}`;
      const newPath = path.join('src', 'img', folder, 'hero', newName);
  
      fs.renameSync(oldPath, newPath);
    });

    res.status(200)
  } else {
    res.status(200)
  }
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
