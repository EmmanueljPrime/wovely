/* eslint-disable no-undef */
const { PrismaClient } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helpers ---------- */
async function ensureSeller() {
    const email = 'seller_image_tests@wovely.test';
    const username = 'seller_image_tests';
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
            seller: { create: { business_name: 'Atelier Images' } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

let sellerId;
const RUN = `JEST-IMG-${Date.now()}`;

beforeAll(async () => {
    sellerId = await ensureSeller();
});

afterAll(async () => {
    await prisma.$disconnect();
});

/* ---------- CREATE ---------- */
describe('Image - Create', () => {
    it('should create an image for a product', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-ONE`,
                description: 'x',
                price: 10.0,
                sellerId,
            },
            select: { id: true },
        });

        const img = await prisma.image.create({
            data: { url: '/img/one.jpg', productId: product.id },
            select: { id: true, url: true, productId: true },
        });

        expect(img.url).toBe('/img/one.jpg');
        expect(img.productId).toBe(product.id);
    });

    it('should create many images for a product', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-MANY`,
                description: 'y',
                price: 20.0,
                sellerId,
            },
            select: { id: true },
        });

        await prisma.image.createMany({
            data: [
                { url: '/img/many-1.jpg', productId: product.id },
                { url: '/img/many-2.jpg', productId: product.id },
            ],
        });

        const imgs = await prisma.image.findMany({
            where: { productId: product.id },
            select: { id: true, url: true },
        });

        expect(imgs.length).toBe(2);
        expect(imgs[0].url).toMatch(/many-/);
    });

    it('should fail if product does not exist (FK)', async () => {
        await expect(
            prisma.image.create({
                data: { url: '/img/ghost.jpg', productId: 99999999 },
                select: { id: true },
            })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('should fail without required url', async () => {
        const product = await prisma.product.create({
            data: { name: `${RUN}-P-NOURL`, description: 'z', price: 5.0, sellerId },
            select: { id: true },
        });

        await expect(
            prisma.image.create({
                data: { /* url manquant */ productId: product.id },
                select: { id: true },
            })
        ).rejects.toThrow(); // champ requis
    });
});

/* ---------- READ ---------- */
describe('Image - Read', () => {
    it('should list images by product', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-LIST`,
                description: 'list',
                price: 11.0,
                sellerId,
            },
            select: { id: true },
        });

        await prisma.image.createMany({
            data: [
                { url: '/img/list-1.jpg', productId: product.id },
                { url: '/img/list-2.jpg', productId: product.id },
                { url: '/img/list-3.jpg', productId: product.id },
            ],
        });

        const list = await prisma.image.findMany({
            where: { productId: product.id },
            select: { id: true, url: true },
        });

        expect(list.length).toBe(3);
    });

    it('should get an image with its product', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-GET`,
                description: 'get',
                price: 12.0,
                sellerId,
            },
            select: { id: true, name: true },
        });

        const img = await prisma.image.create({
            data: { url: '/img/get.jpg', productId: product.id },
            select: { id: true },
        });

        const found = await prisma.image.findUnique({
            where: { id: img.id },
            include: { product: { select: { id: true, name: true } } },
        });

        expect(found.product.id).toBe(product.id);
        expect(found.product.name).toContain(`${RUN}-P-GET`);
    });
});

/* ---------- UPDATE ---------- */
describe('Image - Update', () => {
    it('should update image url', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-UPD`,
                description: 'upd',
                price: 13.0,
                sellerId,
            },
            select: { id: true },
        });

        const img = await prisma.image.create({
            data: { url: '/img/old.jpg', productId: product.id },
            select: { id: true },
        });

        const updated = await prisma.image.update({
            where: { id: img.id },
            data: { url: '/img/new.jpg' },
            select: { id: true, url: true },
        });

        expect(updated.url).toBe('/img/new.jpg');
    });
});

/* ---------- DELETE & contraintes ---------- */
describe('Image - Delete & constraints', () => {
    it('should delete an image', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-DEL-IMG`,
                description: 'del img',
                price: 14.0,
                sellerId,
            },
            select: { id: true },
        });

        const img = await prisma.image.create({
            data: { url: '/img/todel.jpg', productId: product.id },
            select: { id: true },
        });

        await prisma.image.delete({ where: { id: img.id }, select: { id: true } });
        const gone = await prisma.image.findUnique({ where: { id: img.id }, select: { id: true } });
        expect(gone).toBeNull();
    });

    it('should block deleting product while images exist (FK), then allow after cleanup', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-P-DEL-FK`,
                description: 'del fk',
                price: 15.0,
                sellerId,
            },
            select: { id: true },
        });

        await prisma.image.create({
            data: { url: '/img/lock.jpg', productId: product.id },
            select: { id: true },
        });

        // suppression du produit doit échouer (relation Image -> Product requise)
        await expect(
            prisma.product.delete({ where: { id: product.id }, select: { id: true } })
        ).rejects.toThrow(/P2003|foreign key/i);

        // nettoyage
        await prisma.image.deleteMany({ where: { productId: product.id } });
        await prisma.product.delete({ where: { id: product.id }, select: { id: true } });
        const gone = await prisma.product.findUnique({ where: { id: product.id }, select: { id: true } });
        expect(gone).toBeNull();
    });
});
