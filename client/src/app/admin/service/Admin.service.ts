import axios from "axios"
import { IAdmin } from "../interface/Admin.interface"
import { IArticleAll, IArticle } from "@/interface/Article.interface"

class AdminService {
    private URL = 'http://localhost:8800'

    async SignIn(admin: IAdmin) {
        const { data } = await axios.post(this.URL + '/admin', admin)
        return data
    }

    async GetArticle(name: string): Promise<IArticle> {
        console.log(name)
        const { data } = await axios.get<IArticle>(this.URL + `/name_street/${name}`)
        if (data) {
            return data
        } else {
            throw new Error(`Article with name ${name} not found`);
        }
    }

    async SaveEditArticle(article_edit: IArticle) {
        const { data } = await axios.post(this.URL + `/edit`, article_edit)
        return data
    }

    async AddArticle(article: IArticle) {
        const { data } = await axios.post(this.URL + `/add`, article)
        return data
    }

    async DeleteArticle(name: string){
        await axios.post(this.URL + `/delete/${name}`)
    }
}

export { AdminService }