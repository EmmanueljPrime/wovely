/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helper: un seller dédié pour créer des produits liés aux catégories ---------- */
async function ensureSeller() {
    const email = 'seller_category_tests@wovely.test';
    const username = 'seller_category_tests';
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
            seller: { create: { business_name: 'Atelier Categories' } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

let sellerId;
const RUN = `JEST-CAT-${Date.now()}`;

beforeAll(async () => {
    sellerId = await ensureSeller();
});

afterAll(async () => {
    await prisma.$disconnect();
});

/* ===================== CREATE ===================== */
describe('Category - Create', () => {
    it('should create a minimal category (name unique)', async () => {
        const cat = await prisma.category.create({
            data: { name: `${RUN}-Minimal` },
            select: { id: true, name: true },
        });

        expect(cat.name).toBe(`${RUN}-Minimal`);
        expect(typeof cat.id).toBe('string');
    });

    it('should fail on duplicate name (unique)', async () => {
        const name = `${RUN}-Duplicate`;
        await prisma.category.create({ data: { name } });

        await expect(
            prisma.category.create({ data: { name } })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });

    it('should fail without required name', async () => {
        await expect(
            prisma.category.create({ data: {} })
        ).rejects.toThrow(); // champ requis
    });
});

/* ===================== READ ===================== */
describe('Category - Read', () => {
    it('should list categories with a filter (contains)', async () => {
        await prisma.category.createMany({
            data: [{ name: `${RUN}-List-A` }, { name: `${RUN}-List-B` }],
        });

        const cats = await prisma.category.findMany({
            where: { name: { contains: `${RUN}-List-` } },
            select: { id: true, name: true },
        });

        expect(cats.length).toBeGreaterThanOrEqual(2);
        expect(cats.every(c => c.name.includes(`${RUN}-List-`))).toBe(true);
    });

    it('should get a category with products count', async () => {
        const cat = await prisma.category.create({
            data: { name: `${RUN}-WithProducts` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-For-Cat`,
                description: 'linked',
                price: new Prisma.Decimal('19.99'),
                sellerId,
                categoryId: cat.id,
            },
            select: { id: true },
        });

        const found = await prisma.category.findUnique({
            where: { id: cat.id },
            include: { _count: { select: { products: true } } },
        });

        expect(found._count.products).toBeGreaterThanOrEqual(1);

        // petite vérif relationnelle
        const prod = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, categoryId: true },
        });
        expect(prod.categoryId).toBe(cat.id);
    });
});

/* ===================== UPDATE ===================== */
describe('Category - Update', () => {
    it('should rename a category', async () => {
        const cat = await prisma.category.create({
            data: { name: `${RUN}-OldName` },
            select: { id: true },
        });

        const updated = await prisma.category.update({
            where: { id: cat.id },
            data: { name: `${RUN}-NewName` },
            select: { id: true, name: true },
        });

        expect(updated.name).toBe(`${RUN}-NewName`);
    });

    it('should fail renaming to an existing name (unique)', async () => {
        const a = await prisma.category.create({
            data: { name: `${RUN}-A` },
            select: { id: true },
        });
        const b = await prisma.category.create({
            data: { name: `${RUN}-B` },
            select: { id: true },
        });

        await expect(
            prisma.category.update({
                where: { id: b.id },
                data: { name: `${RUN}-A` }, // collision
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });
});

/* ===================== DELETE & contraintes ===================== */
describe('Category - Delete & constraints', () => {
    it('should set product.categoryId to NULL when a referenced category is deleted (onDelete: SetNull)', async () => {
        // Product.categoryId est optionnel → Prisma met un FK SET NULL par défaut
        const cat = await prisma.category.create({
            data: { name: `${RUN}-ToDelete-SetNull` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-SetNull`,
                description: 'linked for deletion',
                price: new Prisma.Decimal('29.99'),
                sellerId,
                categoryId: cat.id,
            },
            select: { id: true },
        });

        // La suppression de la catégorie doit RÉUSSIR
        await prisma.category.delete({ where: { id: cat.id }, select: { id: true } });

        // Et le produit reste, mais sans catégorie
        const still = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, categoryId: true },
        });

        expect(still).not.toBeNull();
        expect(still.categoryId).toBeNull();
    });

    it('should delete a category with no products', async () => {
        const cat = await prisma.category.create({
            data: { name: `${RUN}-Del-NoDeps` },
            select: { id: true },
        });

        await prisma.category.delete({ where: { id: cat.id }, select: { id: true } });
        const gone = await prisma.category.findUnique({ where: { id: cat.id }, select: { id: true } });
        expect(gone).toBeNull();
    });
});
