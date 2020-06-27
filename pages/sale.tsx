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
}) => <pre>{JSON.stringify(products, null, 2)}</pre>;
