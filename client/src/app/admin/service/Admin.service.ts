import axios from "axios"
import { IAdmin } from "../interface/Admin.interface"
import { IArticleAll, IArticle } from "@/interface/Article.interface"

class AdminService {
    private URL = 'http://localhost:8800'

    async SignIn(admin: IAdmin) {
        const { data } = await axios.post(this.URL + '/admin', admin)
        return data
    }

    async GetArticle(_id: string): Promise<IArticle> {
        const { data } = await axios.get<IArticle>(this.URL + `/street/${_id}`)
        if (data) {
            return data
        } else {
            throw new Error(`Article with name ${name} not found`)
        }
    }

    async SaveEditArticle(article_edit: IArticle) {
        const { data } = await axios.post(this.URL + `/edit/${article_edit.article._id}`, article_edit)
        return data
    }

    async AddArticle(article: IArticle) {
        const { data } = await axios.post(this.URL + `/add/${article.article._id}`, article)
        return data
    }

    async DeleteArticle(article: IArticle): Promise<IArticleAll> {
        const { data } = await axios.post(this.URL + `/delete`, article)
        return data
    }
}

export { AdminService }