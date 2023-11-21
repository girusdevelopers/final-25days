import mongoose,{model,Schema} from "mongoose";

const currentDate = new Date();
const curr_date= currentDate.toLocaleTimeString();

type Article ={
    ArticleTitle:string;
    content:string;
    BannerKey:string;
    Banner_location:string;
    createdAt: Date;
}

// Create a Mongoose schema for the Article type
const articleSchema = new mongoose.Schema<Article>({
  ArticleTitle: String,
  content: String,
  BannerKey: String,
  Banner_location: String,
  createdAt: {
    type: Date,
   default: currentDate.setHours(5,30,4,0),
  },
});

// Create a Mongoose model for the Article type
const Article = mongoose.model("Article", articleSchema);
export default Article;
