/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helper: un seller dédié pour créer des produits liés aux couleurs ---------- */
async function ensureSeller() {
    const email = 'seller_color_tests@wovely.test';
    const username = 'seller_color_tests';
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
            seller: { create: { business_name: 'Atelier Colors' } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

let sellerId;
const RUN = `JEST-COLOR-${Date.now()}`;

beforeAll(async () => {
    sellerId = await ensureSeller();
});

afterAll(async () => {
    await prisma.$disconnect();
});

/* ===================== CREATE ===================== */
describe('Color - Create', () => {
    it('should create a minimal color (name unique)', async () => {
        const color = await prisma.color.create({
            data: { name: `${RUN}-Minimal` },
            select: { id: true, name: true },
        });

        expect(color.name).toBe(`${RUN}-Minimal`);
        expect(typeof color.id).toBe('string');
    });

    it('should fail on duplicate name (unique)', async () => {
        const name = `${RUN}-Duplicate`;
        await prisma.color.create({ data: { name } });

        await expect(
            prisma.color.create({ data: { name } })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });

    it('should fail without required name', async () => {
        await expect(prisma.color.create({ data: {} })).rejects.toThrow();
    });
});

/* ===================== READ ===================== */
describe('Color - Read', () => {
    it('should list colors with a filter (contains)', async () => {
        await prisma.color.createMany({
            data: [{ name: `${RUN}-List-A` }, { name: `${RUN}-List-B` }],
        });

        const colors = await prisma.color.findMany({
            where: { name: { contains: `${RUN}-List-` } },
            select: { id: true, name: true },
        });

        expect(colors.length).toBeGreaterThanOrEqual(2);
        expect(colors.every(c => c.name.includes(`${RUN}-List-`))).toBe(true);
    });

    it('should get a color with products count', async () => {
        const color = await prisma.color.create({
            data: { name: `${RUN}-WithProducts` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-For-Color`,
                description: 'linked',
                price: new Prisma.Decimal('19.99'),
                sellerId,
                colorId: color.id,
            },
            select: { id: true },
        });

        const found = await prisma.color.findUnique({
            where: { id: color.id },
            include: { _count: { select: { products: true } } },
        });

        expect(found._count.products).toBeGreaterThanOrEqual(1);

        const prod = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, colorId: true },
        });
        expect(prod.colorId).toBe(color.id);
    });
});

/* ===================== UPDATE ===================== */
describe('Color - Update', () => {
    it('should rename a color', async () => {
        const color = await prisma.color.create({
            data: { name: `${RUN}-OldName` },
            select: { id: true },
        });

        const updated = await prisma.color.update({
            where: { id: color.id },
            data: { name: `${RUN}-NewName` },
            select: { id: true, name: true },
        });

        expect(updated.name).toBe(`${RUN}-NewName`);
    });

    it('should fail renaming to an existing name (unique)', async () => {
        const a = await prisma.color.create({
            data: { name: `${RUN}-A` },
            select: { id: true },
        });
        const b = await prisma.color.create({
            data: { name: `${RUN}-B` },
            select: { id: true },
        });

        await expect(
            prisma.color.update({
                where: { id: b.id },
                data: { name: `${RUN}-A` }, // collision
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });
});

/* ===================== DELETE & contraintes ===================== */
describe('Color - Delete & constraints', () => {
    it('should set product.colorId to NULL when a referenced color is deleted (onDelete: SetNull)', async () => {
        // Product.colorId est optionnel → FK SET NULL par défaut
        const color = await prisma.color.create({
            data: { name: `${RUN}-ToDelete-SetNull` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-SetNull`,
                description: 'linked for deletion',
                price: new Prisma.Decimal('29.99'),
                sellerId,
                colorId: color.id,
            },
            select: { id: true },
        });

        // La suppression de la couleur doit RÉUSSIR
        await prisma.color.delete({ where: { id: color.id }, select: { id: true } });

        // Le produit reste, mais sans colorId
        const still = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, colorId: true },
        });

        expect(still).not.toBeNull();
        expect(still.colorId).toBeNull();
    });

    it('should delete a color with no products', async () => {
        const color = await prisma.color.create({
            data: { name: `${RUN}-Del-NoDeps` },
            select: { id: true },
        });

        await prisma.color.delete({ where: { id: color.id }, select: { id: true } });
        const gone = await prisma.color.findUnique({ where: { id: color.id }, select: { id: true } });
        expect(gone).toBeNull();
    });
});
