import { useEffect, useState } from "react";
import { TContext } from "../App";
import { navigate } from "../router";
import { StoreItem } from "../types";

interface ProductListProps {
  context: TContext;
}

export function ProductList({ context }: ProductListProps) {
  const [products, setProducts] = useState<StoreItem[] | undefined>(
    context.data?.products
  );

  // нужен, так как пользователь может открыть страчнику с помощью перехода
  // и она начнет рендерится на клиенте.
  useEffect(() => {
    if (!products) {
      fetch("https://fakestoreapi.com/products?limit=6")
        .then((res) => res.json())
        .then(setProducts);
    }
  }, []);

  if (!products) return <p>Loading products list...</p>;

  const onClick = (event: React.MouseEvent<HTMLElement>, id: string) => {
    event.preventDefault();
    navigate(`/product/${id}`);
  };

  return (
    <div>
      <h1>Store</h1>
      <div className="products">
        {products.map((p) => (
          <div className="product" key={p.id}>
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
