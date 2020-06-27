import Link from 'next/link';
import { PrismaClient, Product, Sku, Attribute, Price } from '@prisma/client';

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const products = await prisma.product.findMany({
    include: {
      variants: { include: { attributes: true, prices: true } },
    },
  });

  return {
    props: {
      products,
    },
  };
}

export default ({
  products,
}: {
  products: (Product & {
    variants: (Sku & {
      attributes: Attribute[];
      prices: Price[];
    })[];
  })[];
}) => (
  <>
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      {' | '}
      <Link href="/sale">
        <a>Sale</a>
      </Link>
    </nav>
    <h2>All Products</h2>
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>
            <a>
              {product.name}: {product.description}
            </a>
          </Link>
          <ul>
            {product.variants.map((sku) => (
              <li key={sku.id}>
                Attributes:{' '}
                <span>
                  {sku.attributes.map(
                    (attr) => `${attr.key}: ${attr.value} | `
                  )}
                  Inventory: {sku.inventoryCount ?? 'infinite'}
                </span>
                <ul>
                  {sku.prices.map((price) => (
                    <li key={price.id}>
                      Price: {price.amount} {price.currency}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </>
);
