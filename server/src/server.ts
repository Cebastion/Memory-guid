import cors from 'cors'
import express, { Request, Response } from 'express'
import { MongoDB } from './service/MongoDB.service'

const app = express()
const PORT = 8800
const mongodb = new MongoDB()

app.use(cors())
app.use(express.json())

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

app.listen(PORT, async () => {
  console.log(`http://localhost:${PORT}`)
})