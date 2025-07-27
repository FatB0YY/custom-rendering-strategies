import { useEffect, useState } from "react";
import { TContext } from "../App";
import { navigate } from "../router";
import { StoreItem } from "../types";

interface ProductPageProps {
  context: TContext;
}

export function ProductPage({ context }: ProductPageProps) {
  const id = context.url.pathname.split("/").at(-1);
  const products = context.data?.products || [];

  const [product, setProduct] = useState<StoreItem | undefined>(
    products[Number(id)]
  );
  const [isProductExists, setProductExist] = useState<boolean>(true);

  useEffect(() => {
    if (!product) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then(setProduct)
        .catch(() => setProductExist(false));
    }
  }, [id]);

  if (!isProductExists) {
    return <p>Product does not exists!</p>;
  }

  if (!product) return <p>Loading products page...</p>;

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate("/");
  };

  return (
    <div>
      <a href="/" onClick={onClick}>
        ← Back
      </a>
      <h1>{product.title}</h1>
      <img src={product.image} width="150" />
      <p>{product.description}</p>
      <p>
        <strong>${product.price}</strong>
      </p>
    </div>
  );
}
