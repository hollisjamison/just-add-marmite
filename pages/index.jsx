import { createClient } from "contentful";
import RecipeCard from "../components/RecipeCard";

export async function getStaticProps() {
  console.log("fetching");
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const { items } = await client.getEntries({ content_type: "recipe" });

  return {
    props: {
      items,
    },
  };
}

export default function Recipes({ items }) {
  console.log(items)

  return (
    <div className="recipe-list">
      {items.map((recipe) => (
        <RecipeCard recipe={recipe} key={recipe.sys.id} />
      ))}

      <style jsx>
        {`
          .recipe-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-gap: 20px 60px;
          }
        `}
      </style>
    </div>
  );
}
