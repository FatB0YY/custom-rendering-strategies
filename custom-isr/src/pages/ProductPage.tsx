import { StoreItem } from "../types";
import { navigate } from "../router";

export function ProductPage({ product }: { id: string; product: StoreItem }) {
  const onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    navigate("/");
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
