/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/** Helpers: upsert “référentiels” et (re)créer un seller/client dédiés aux tests */
async function ensureRefs() {
    // upsert par "name" (unique) → ne casse pas tes données existantes
    const cats = ['T-shirts', 'Costumes'];
    const sizes = ['S', 'M', 'L'];
    const colors = ['Noir', 'Blanc'];
    const materials = ['Coton', 'Laine'];

    for (const name of cats) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name }, // id auto (cuid) OK
        });
    }
    for (const name of sizes) {
        await prisma.size.upsert({ where: { name }, update: {}, create: { name } });
    }
    for (const name of colors) {
        await prisma.color.upsert({ where: { name }, update: {}, create: { name } });
    }
    for (const name of materials) {
        await prisma.material.upsert({ where: { name }, update: {}, create: { name } });
    }

    // on récupère les IDs générés
    const [catTs, colorBlack, matCoton] = await Promise.all([
        prisma.category.findUnique({ where: { name: 'T-shirts' } }),
        prisma.color.findUnique({ where: { name: 'Noir' } }),
        prisma.material.findUnique({ where: { name: 'Coton' } }),
    ]);
    const [sizeS, sizeM, sizeL] = await Promise.all([
        prisma.size.findUnique({ where: { name: 'S' } }),
        prisma.size.findUnique({ where: { name: 'M' } }),
        prisma.size.findUnique({ where: { name: 'L' } }),
    ]);

    return {
        categoryId_Tshirts: catTs.id,
        colorId_Noir: colorBlack.id,
        materialId_Coton: matCoton.id,
        sizeIds: { S: sizeS.id, M: sizeM.id, L: sizeL.id },
    };
}

async function ensureSeller() {
    const email = 'seller_product_tests@wovely.test';
    const username = 'seller_product_tests';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.seller) return existing.seller.id;

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            username,
            password: 'secure',
            role: 'SELLER',
            seller: { create: { business_name: 'Atelier Tests Produits' } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

async function ensureClient() {
    const email = 'client_product_tests@wovely.test';
    const username = 'client_product_tests';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing?.client) return existing.client.id;

    const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
            email,
            username,
            password: 'secure',
            role: 'CLIENT',
            client: { create: { firstname: 'John', lastname: 'Doe' } },
        },
        include: { client: true },
    });
    return user.client.id;
}

/** Fixtures accessibles dans tous les tests du fichier */
let sellerId;
let clientId;
let refs;

/** IMPORTANT : on ne supprime rien ; on s’assure juste que tout existe */
beforeAll(async () => {
    refs = await ensureRefs();
    sellerId = await ensureSeller();
    clientId = await ensureClient();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Product - Create', () => {
    it('Should create a minimal product', async () => {
        const product = await prisma.product.create({
            data: {
                name: 'T-Shirt Basic',
                description: 'Coton basique',
                price: new Prisma.Decimal('19.99'),
                sellerId,
            },
            // évite tout retour implicite d’anciennes colonnes
            select: { id: true, name: true, sellerId: true },
        });

        expect(product.name).toBe('T-Shirt Basic');
        expect(product.sellerId).toBe(sellerId);
    });

    it('Should create a product with refs + images + stock', async () => {
        const product = await prisma.product.create({
            data: {
                name: 'T-Shirt Noir',
                description: 'Noir, 100% coton',
                price: new Prisma.Decimal('24.90'),
                sellerId,
                categoryId: refs.categoryId_Tshirts,
                colorId: refs.colorId_Noir,
                materialId: refs.materialId_Coton,
                images: { create: [{ url: '/seed-images/tshirtnoir.webp' }] },
            },
            select: { id: true },
        });

        await prisma.productStock.createMany({
            data: [
                { productId: product.id, sizeId: refs.sizeIds.S, quantity: 5 },
                { productId: product.id, sizeId: refs.sizeIds.M, quantity: 3 },
            ],
        });

        // On vérifie via des requêtes ciblées (pas de include global)
        const base = await prisma.product.findUnique({
            where: { id: product.id },
            select: { categoryId: true, colorId: true, materialId: true },
        });
        const images = await prisma.image.findMany({ where: { productId: product.id } });
        const stocks = await prisma.productStock.findMany({
            where: { productId: product.id },
            include: { size: true },
        });

        expect(base.categoryId).toBe(refs.categoryId_Tshirts);
        expect(base.colorId).toBe(refs.colorId_Noir);
        expect(base.materialId).toBe(refs.materialId_Coton);
        expect(images.length).toBe(1);
        expect(stocks.length).toBe(2);
        expect(stocks[0].size.name).toBeDefined();
    });

    it('Should fail on non-existing seller (FK)', async () => {
        await expect(
            prisma.product.create({
                data: {
                    name: 'Orphan',
                    description: 'No seller',
                    price: new Prisma.Decimal('10.00'),
                    sellerId: 99999999,
                },
                select: { id: true },
            })
        ).rejects.toThrow(/P2003|foreign key|record.*not.*found/i);
    });
});

describe('Product - Read', () => {
    it('Should list products (safe select)', async () => {
        await prisma.product.createMany({
            data: [
                { name: 'P1', description: 'D1', price: new Prisma.Decimal('9.99'), sellerId },
                { name: 'P2', description: 'D2', price: new Prisma.Decimal('19.99'), sellerId },
            ],
        });

        // select minimal pour éviter tout vieux champ fantôme
        const products = await prisma.product.findMany({ select: { id: true, name: true } });
        expect(products.length).toBeGreaterThanOrEqual(2);
    });

    it('Should get relations via queries (images, stocks, seller)', async () => {
        const p = await prisma.product.create({
            data: {
                name: 'Veste',
                description: 'Laine',
                price: new Prisma.Decimal('99.90'),
                sellerId,
                images: { create: [{ url: '/seed-images/veste.webp' }] },
            },
            select: { id: true, sellerId: true, name: true },
        });

        await prisma.productStock.createMany({
            data: [
                { productId: p.id, sizeId: refs.sizeIds.M, quantity: 2 },
                { productId: p.id, sizeId: refs.sizeIds.L, quantity: 1 },
            ],
        });

        const seller = await prisma.seller.findUnique({ where: { id: p.sellerId } });
        const imgs = await prisma.image.findMany({ where: { productId: p.id } });
        const stocks = await prisma.productStock.findMany({ where: { productId: p.id } });

        expect(seller.business_name).toBeDefined();
        expect(imgs.length).toBe(1);
        expect(stocks.length).toBe(2);
    });
});

describe('Product - Update', () => {
    it('Should update name and price', async () => {
        const product = await prisma.product.create({
            data: { name: 'Old Name', description: 'D', price: new Prisma.Decimal('50.00'), sellerId },
            select: { id: true },
        });

        const updated = await prisma.product.update({
            where: { id: product.id },
            data: { name: 'New Name', price: new Prisma.Decimal('59.90') },
            select: { id: true, name: true, price: true },
        });

        expect(updated.name).toBe('New Name');
        expect(updated.price.toNumber()).toBe(59.9); // Decimal string peut être "59.9" au lieu de "59.90"
    });

    it('Should add more stock entries', async () => {
        const product = await prisma.product.create({
            data: { name: 'Stock Test', description: 'D', price: new Prisma.Decimal('10.00'), sellerId },
            select: { id: true },
        });

        await prisma.productStock.createMany({
            data: [
                { productId: product.id, sizeId: refs.sizeIds.S, quantity: 4 },
                { productId: product.id, sizeId: refs.sizeIds.M, quantity: 2 },
            ],
        });

        const stocks = await prisma.productStock.findMany({ where: { productId: product.id } });
        expect(stocks.length).toBe(2);
    });
});

describe('Product - Delete', () => {
    it('Should fail to delete product with dependent images/stocks (FK)', async () => {
        const product = await prisma.product.create({
            data: {
                name: 'ToDelete',
                description: 'D',
                price: new Prisma.Decimal('20.00'),
                sellerId,
                images: { create: [{ url: '/img.jpg' }] },
            },
            select: { id: true },
        });
        await prisma.productStock.create({
            data: { productId: product.id, sizeId: refs.sizeIds.S, quantity: 1 },
        });

        await expect(
            prisma.product.delete({ where: { id: product.id }, select: { id: true } })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('Should delete product after cleaning dependencies', async () => {
        const product = await prisma.product.create({
            data: {
                name: 'ToDeleteOK',
                description: 'D',
                price: new Prisma.Decimal('20.00'),
                sellerId,
                images: { create: [{ url: '/img.jpg' }] },
            },
            select: { id: true },
        });
        await prisma.productStock.create({
            data: { productId: product.id, sizeId: refs.sizeIds.M, quantity: 2 },
        });

        await prisma.image.deleteMany({ where: { productId: product.id } });
        await prisma.productStock.deleteMany({ where: { productId: product.id } });

        await prisma.product.delete({ where: { id: product.id }, select: { id: true } });
        const deleted = await prisma.product.findUnique({ where: { id: product.id }, select: { id: true } });
        expect(deleted).toBeNull();
    });

    it('Should cascade delete cart items when product is deleted', async () => {
        // avec onDelete: Cascade sur CartItem.product
        const product = await prisma.product.create({
            data: { name: 'CartLock', description: 'D', price: new Prisma.Decimal('30.00'), sellerId },
            select: { id: true },
        });
        await prisma.cartItem.create({
            data: { clientId, productId: product.id, sizeId: refs.sizeIds.S, quantity: 1 },
        });

        // la suppression du produit doit réussir et supprimer le cart item
        await prisma.product.delete({ where: { id: product.id }, select: { id: true } });

        const remains = await prisma.cartItem.findMany({ where: { productId: product.id } });
        expect(remains.length).toBe(0);
    });
});
