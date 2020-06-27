import Link from 'next/link';
import { PrismaClient, Product, Sku } from '@prisma/client';

export async function getStaticProps() {
  const prisma = new PrismaClient();
  const category = await prisma.category.findOne({
    where: { name: 'Sale' },
    include: {
      products: {
        take: 10,
        include: { variants: { take: 1 } },
      },
    },
  });
  const products = category.products;

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
    variants: Sku[];
  })[];
}) => (
  <>
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      {' | '}
      <Link href="/products">
        <a>All products</a>
      </Link>
    </nav>
    <h2>Products on sale</h2>
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>
            <a>
              {product.name}: {product.description}
            </a>
          </Link>
        </li>
      ))}
    </ul>
  </>
);
