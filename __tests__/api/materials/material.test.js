/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helper: seller dédié pour pouvoir créer des produits liés ---------- */
async function ensureSeller() {
    const email = 'seller_material_tests@wovely.test';
    const username = 'seller_material_tests';
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
            seller: { create: { business_name: 'Atelier Materials' } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

let sellerId;
const RUN = `JEST-MAT-${Date.now()}`;

beforeAll(async () => {
    sellerId = await ensureSeller();
});

afterAll(async () => {
    await prisma.$disconnect();
});

/* ===================== CREATE ===================== */
describe('Material - Create', () => {
    it('should create a minimal material (name unique)', async () => {
        const mat = await prisma.material.create({
            data: { name: `${RUN}-Minimal` },
            select: { id: true, name: true },
        });

        expect(mat.name).toBe(`${RUN}-Minimal`);
        expect(typeof mat.id).toBe('string');
    });

    it('should fail on duplicate name (unique)', async () => {
        const name = `${RUN}-Duplicate`;
        await prisma.material.create({ data: { name } });

        await expect(
            prisma.material.create({ data: { name } })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });

    it('should fail without required name', async () => {
        await expect(prisma.material.create({ data: {} })).rejects.toThrow();
    });
});

/* ===================== READ ===================== */
describe('Material - Read', () => {
    it('should list materials with a filter (contains)', async () => {
        await prisma.material.createMany({
            data: [{ name: `${RUN}-List-A` }, { name: `${RUN}-List-B` }],
        });

        const mats = await prisma.material.findMany({
            where: { name: { contains: `${RUN}-List-` } },
            select: { id: true, name: true },
        });

        expect(mats.length).toBeGreaterThanOrEqual(2);
        expect(mats.every(m => m.name.includes(`${RUN}-List-`))).toBe(true);
    });

    it('should get a material with products count', async () => {
        const mat = await prisma.material.create({
            data: { name: `${RUN}-WithProducts` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-For-Material`,
                description: 'linked',
                price: new Prisma.Decimal('19.99'),
                sellerId,
                materialId: mat.id,
            },
            select: { id: true },
        });

        const found = await prisma.material.findUnique({
            where: { id: mat.id },
            include: { _count: { select: { products: true } } },
        });

        expect(found._count.products).toBeGreaterThanOrEqual(1);

        const prod = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, materialId: true },
        });
        expect(prod.materialId).toBe(mat.id);
    });
});

/* ===================== UPDATE ===================== */
describe('Material - Update', () => {
    it('should rename a material', async () => {
        const mat = await prisma.material.create({
            data: { name: `${RUN}-OldName` },
            select: { id: true },
        });

        const updated = await prisma.material.update({
            where: { id: mat.id },
            data: { name: `${RUN}-NewName` },
            select: { id: true, name: true },
        });

        expect(updated.name).toBe(`${RUN}-NewName`);
    });

    it('should fail renaming to an existing name (unique)', async () => {
        const a = await prisma.material.create({
            data: { name: `${RUN}-A` },
            select: { id: true },
        });
        const b = await prisma.material.create({
            data: { name: `${RUN}-B` },
            select: { id: true },
        });

        await expect(
            prisma.material.update({
                where: { id: b.id },
                data: { name: `${RUN}-A` }, // collision
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*name/i);
    });
});

/* ===================== DELETE & contraintes ===================== */
describe('Material - Delete & constraints', () => {
    it('should set product.materialId to NULL when a referenced material is deleted (onDelete: SetNull)', async () => {
        // Product.materialId est optionnel → FK SET NULL par défaut
        const mat = await prisma.material.create({
            data: { name: `${RUN}-ToDelete-SetNull` },
            select: { id: true },
        });

        const p = await prisma.product.create({
            data: {
                name: `${RUN}-Prod-SetNull`,
                description: 'linked for deletion',
                price: new Prisma.Decimal('29.99'),
                sellerId,
                materialId: mat.id,
            },
            select: { id: true },
        });

        // La suppression du material doit RÉUSSIR
        await prisma.material.delete({ where: { id: mat.id }, select: { id: true } });

        // Le produit reste, mais sans materialId
        const still = await prisma.product.findUnique({
            where: { id: p.id },
            select: { id: true, materialId: true },
        });

        expect(still).not.toBeNull();
        expect(still.materialId).toBeNull();
    });

    it('should delete a material with no products', async () => {
        const mat = await prisma.material.create({
            data: { name: `${RUN}-Del-NoDeps` },
            select: { id: true },
        });

        await prisma.material.delete({ where: { id: mat.id }, select: { id: true } });
        const gone = await prisma.material.findUnique({ where: { id: mat.id }, select: { id: true } });
        expect(gone).toBeNull();
    });
});
