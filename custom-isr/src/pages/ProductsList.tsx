import { useState } from "react";
import { StoreItem } from "../types";
import { navigate } from "../router";

export function ProductList({
  products,
}: {
  products: StoreItem[];
}) {
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
            <a href={`/product/${p.id}`} onClick={(event) => onClick(event, p.id)}>
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
