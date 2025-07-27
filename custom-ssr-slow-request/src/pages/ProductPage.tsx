import { useEffect, useState } from "react";
import { StoreItem } from "../types";
import { navigate } from "../router";

export function ProductPage({
  id,
  initialProduct,
}: {
  id: string;
  initialProduct?: StoreItem;
}) {
  const [product, setProduct] = useState<StoreItem | undefined>(initialProduct);
  const [isProductExists, setProductExist] = useState<boolean>(true);

  useEffect(() => {
    if (!product) {
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => res.json())
        .then(setProduct)
        .catch(() => setProductExist(false));
    }
  }, [id, product]);

  if (!isProductExists) {
    return <p>Product does not exists!</p>;
  }

  if (!product) return <p>Loading products page...</p>;

  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate('/');
  };

  return (
    <div>
      <a href="/" onClick={(event) => onClick(event)}>
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
