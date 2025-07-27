import { useEffect, useState } from "react";
import { navigate } from "../router";
import { StoreItem } from "../types";
import { pause } from "../utils";

export function ProductList({
  initialProductsList,
}: {
  initialProductsList?: StoreItem[];
}) {
  const [products, setProducts] = useState<StoreItem[] | undefined>(
    initialProductsList
  );

  useEffect(() => {
    if (!products || products.length === 0) {
      pause()
        .then(() => fetch("https://fakestoreapi.com/products?limit=100"))
        .then((res) => res.json())
        .then(setProducts);
    }
  }, [products]);

  if (!products || products.length === 0)
    return <p>Loading products list...</p>;

  const onClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.preventDefault();
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <h1>Store</h1>
      <div className="products">
        {products.map((p, index) => (
          <div className="product" key={index}>
            <img src={p.image} alt={p.title} />
            <h2>{p.title}</h2>
            <p>
              <strong>${p.price}</strong>
            </p>
            <a
              href={`/product/${p.id}`}
              onClick={(event) => onClick(event, p.id)}
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
