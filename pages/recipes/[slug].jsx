import { createClient } from "contentful";
import { documentToReactComponent, documentToReactComponents } from '@contentful/rich-text-react-renderer'
import Image from 'next/image'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const { items } = await client.getEntries({ content_type: "recipe" });
  const paths = items.map(recipe => {
    const { slug } = recipe.fields
    return {
      params: {
        slug
      }
    }
  })

  return {
    paths,
    fallback: false
  }
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params

  const { items } = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': slug
  })

  return {
    props: { recipe: items[0] }
  }
}

export default function RecipeDetails ({recipe}) {
  const {featuredImage, title, cookingTime, ingredients, method} = recipe.fields
  
  return (
  <div>
    <div className="banner">
      <Image src={`https:${featuredImage.fields.file.url}`} width={featuredImage.fields.file.details.image.width} height={featuredImage.fields.file.details.image.width} />
      <h2>{title}</h2>
    </div>
    <div className="info">
      <p>Takes about {cookingTime} minutes to cook.</p>
      <h3>Ingredients:</h3>
      {ingredients.map((ingredient) => (
        <span key={ingredient}> {ingredient}</span>
      ))}
    </div>
    <div className="method">
      <h3>Method:</h3>
      <div>
        {documentToReactComponents(method)}
      </div>
    </div>
    
    <style jsx>{`
        h2,h3 {
          text-transform: uppercase;
        }
        .banner h2 {
          margin: 0;
          background: #fff;
          display: inline-block;
          padding: 20px;
          position: relative;
          top: -60px;
          left: -10px;
          transform: rotateZ(-1deg);
          box-shadow: 1px 3px 5px rgba(0,0,0,0.1);
        }
        .info p {
          margin: 0;
        }
        .info span::after {
          content: ", ";
        }
        .info span:last-child::after {
          content: ".";
        }
      `}</style>
  </div>
  
  );
}