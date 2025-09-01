/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helpers: créer/réutiliser client & sellers ---------- */
async function ensureClient() {
    const email = 'client_order_tests@wovely.test';
    const username = 'client_order_tests';
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
            client: { create: { firstname: 'Bob', lastname: 'Orders' } },
        },
        include: { client: true },
    });
    return user.client.id;
}

async function ensureSeller(tag = 'A') {
    const email = `seller_order_tests_${tag}@wovely.test`;
    const username = `seller_order_tests_${tag}`;
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
            seller: { create: { business_name: `Atelier Orders ${tag}` } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

/* ---------- Fixtures communes ---------- */
let clientId;
let sellerAId;
let sellerBId;

beforeAll(async () => {
    clientId = await ensureClient();
    sellerAId = await ensureSeller('A');
    sellerBId = await ensureSeller('B');
});

afterAll(async () => {
    await prisma.$disconnect();
});

/* Pour isoler facilement des données créées par ce run */
const RUN = `JEST-ORD-${Date.now()}`;

describe('Order - Product flow', () => {
    it('should create a product order (quantity & totalPrice)', async () => {
        const product = await prisma.product.create({
            data: {
                name: `${RUN}-TSHIRT`,
                description: 'Order product',
                price: new Prisma.Decimal('25.00'),
                sellerId: sellerAId,
            },
            select: { id: true, price: true },
        });

        const order = await prisma.order.create({
            data: {
                quantity: 2,
                totalPrice: new Prisma.Decimal(product.price.toNumber() * 2),
                status: 'pending',
                paymentStatus: 'unpaid',
                type: 'product',
                productId: product.id,
                sellerId: sellerAId,
                clientId,
            },
            select: { id: true, quantity: true, totalPrice: true, productId: true },
        });

        expect(order.productId).toBe(product.id);
        expect(order.quantity).toBe(2);
        expect(order.totalPrice.toNumber()).toBe(50);
    });

    it('should list orders for the client', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-LIST`,
                description: 'x',
                price: new Prisma.Decimal('10.00'),
                sellerId: sellerAId,
            },
            select: { id: true, price: true },
        });

        await prisma.order.createMany({
            data: [
                {
                    quantity: 1,
                    totalPrice: new Prisma.Decimal('10.00'),
                    status: 'pending',
                    paymentStatus: 'unpaid',
                    type: 'product',
                    productId: p.id,
                    sellerId: sellerAId,
                    clientId,
                },
                {
                    quantity: 3,
                    totalPrice: new Prisma.Decimal('30.00'),
                    status: 'pending',
                    paymentStatus: 'unpaid',
                    type: 'product',
                    productId: p.id,
                    sellerId: sellerAId,
                    clientId,
                },
            ],
        });

        const orders = await prisma.order.findMany({
            where: { clientId },
            select: { id: true, totalPrice: true },
        });

        expect(orders.length).toBeGreaterThanOrEqual(2);
    });

    it('should update quantity, totalPrice, status & paymentStatus', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-UPD`,
                description: 'upd',
                price: new Prisma.Decimal('12.50'),
                sellerId: sellerAId,
            },
            select: { id: true, price: true },
        });

        const o = await prisma.order.create({
            data: {
                quantity: 1,
                totalPrice: p.price,
                status: 'pending',
                paymentStatus: 'unpaid',
                type: 'product',
                productId: p.id,
                sellerId: sellerAId,
                clientId,
            },
            select: { id: true },
        });

        const updated = await prisma.order.update({
            where: { id: o.id },
            data: {
                quantity: 4,
                totalPrice: new Prisma.Decimal(p.price.toNumber() * 4), // 50
                status: 'shipped',
                paymentStatus: 'paid',
            },
            select: { id: true, quantity: true, totalPrice: true, status: true, paymentStatus: true },
        });

        expect(updated.quantity).toBe(4);
        expect(updated.totalPrice.toNumber()).toBe(50);
        expect(updated.status).toBe('shipped');
        expect(updated.paymentStatus).toBe('paid');
    });

    it('should enforce FKs (invalid sellerId / productId)', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-FK`,
                description: 'fk',
                price: new Prisma.Decimal('9.99'),
                sellerId: sellerAId,
            },
            select: { id: true },
        });

        await expect(
            prisma.order.create({
                data: {
                    quantity: 1,
                    totalPrice: new Prisma.Decimal('9.99'),
                    type: 'product',
                    productId: p.id,
                    sellerId: 99999999, // invalid
                    clientId,
                },
                select: { id: true },
            })
        ).rejects.toThrow(/P2003|foreign key/i);

        await expect(
            prisma.order.create({
                data: {
                    quantity: 1,
                    totalPrice: new Prisma.Decimal('9.99'),
                    type: 'product',
                    productId: 99999999, // invalid
                    sellerId: sellerAId,
                    clientId,
                },
                select: { id: true },
            })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('should set order.productId to NULL when a referenced product is deleted (onDelete: SetNull)', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-DEL-SETNULL`,
                description: 'del set null',
                price: new Prisma.Decimal('15.00'),
                sellerId: sellerAId,
            },
            select: { id: true },
        });

        const o = await prisma.order.create({
            data: {
                quantity: 1,
                totalPrice: new Prisma.Decimal('15.00'),
                type: 'product',
                productId: p.id,
                sellerId: sellerAId,
                clientId,
            },
            select: { id: true },
        });

        // Avec onDelete: SetNull, la suppression DOIT réussir
        await prisma.product.delete({ where: { id: p.id }, select: { id: true } });

        // L’order existe toujours mais son productId passe à NULL
        const still = await prisma.order.findUnique({
            where: { id: o.id },
            select: { id: true, productId: true }
        });

        expect(still).not.toBeNull();
        expect(still.productId).toBeNull();
    });
});

describe('Order - Project flow & unicité', () => {
    it('should enforce one Order per project (unique projectId)', async () => {
        const prj = await prisma.project.create({
            data: { title: `${RUN}-PRJ-UNIQ`, description: 'uniq', clientId, sellerId: sellerAId },
            select: { id: true },
        });

        await prisma.order.create({
            data: {
                totalPrice: new Prisma.Decimal('200.00'),
                sellerId: sellerAId,
                clientId,
                type: 'project',
                status: 'pending',
                paymentStatus: 'unpaid',
                projectId: prj.id,
            },
            select: { id: true },
        });

        await expect(
            prisma.order.create({
                data: {
                    totalPrice: new Prisma.Decimal('210.00'),
                    sellerId: sellerAId,
                    clientId,
                    type: 'project',
                    projectId: prj.id, // même projet → unique violation
                },
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*projectId/i);
    });

    it('should enforce one Order per proposal (unique proposalId)', async () => {
        // Projet
        const prj = await prisma.project.create({
            data: { title: `${RUN}-PRJ-PROP`, description: 'prop uniq', clientId, sellerId: sellerAId },
            select: { id: true },
        });

        // Advert requis pour la Proposal
        const adv = await prisma.advert.create({
            data: {
                title: `${RUN}-ADV-PROP`,
                description: 'adv',
                price: new Prisma.Decimal('180.00'),
                sellerId: sellerAId,
                projectId: prj.id,
            },
            select: { id: true },
        });

        // Proposal (liée au projet + advert + seller)
        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('180.00'),
                message: 'prop A',
                project: { connect: { id: prj.id } },
                seller: { connect: { id: sellerAId } },
                advert: { connect: { id: adv.id } },
            },
            select: { id: true },
        });

        // 1er order OK
        await prisma.order.create({
            data: {
                totalPrice: new Prisma.Decimal('180.00'),
                sellerId: sellerAId,
                clientId,
                type: 'project',
                projectId: prj.id,
                proposalId: prop.id,
            },
            select: { id: true },
        });

        // 2e order : pour tester *uniquement* proposalId, on NE met PAS projectId
        await expect(
            prisma.order.create({
                data: {
                    totalPrice: new Prisma.Decimal('185.00'),
                    sellerId: sellerAId,
                    clientId,
                    type: 'project',
                    // projectId: prj.id, // <- on enlève pour éviter l’unicité projectId
                    proposalId: prop.id, // <- on veut déclencher l’unicité ici
                },
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*proposalId/i);
    });
});

describe('Order - Seller/Client delete constraints', () => {
    it('should block deleting a seller referenced by an order (FK)', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-SELLER-FK`,
                description: 'seller fk',
                price: new Prisma.Decimal('33.00'),
                sellerId: sellerBId,
            },
            select: { id: true },
        });

        const o = await prisma.order.create({
            data: {
                totalPrice: new Prisma.Decimal('33.00'),
                sellerId: sellerBId,
                clientId,
                type: 'product',
                productId: p.id,
            },
            select: { id: true },
        });

        await expect(
            prisma.seller.delete({ where: { id: sellerBId } })
        ).rejects.toThrow(/P2003|foreign key/i);

        // cleanup
        await prisma.order.delete({ where: { id: o.id } });
        // on ne supprime pas le seller B pour ne pas impacter d’autres tests
    });

    it('should block deleting a client referenced by an order (FK)', async () => {
        const p = await prisma.product.create({
            data: {
                name: `${RUN}-P-CLIENT-FK`,
                description: 'client fk',
                price: new Prisma.Decimal('22.00'),
                sellerId: sellerAId,
            },
            select: { id: true },
        });

        const o = await prisma.order.create({
            data: {
                totalPrice: new Prisma.Decimal('22.00'),
                sellerId: sellerAId,
                clientId,
                type: 'product',
                productId: p.id,
            },
            select: { id: true },
        });

        await expect(
            prisma.client.delete({ where: { id: clientId } })
        ).rejects.toThrow(/P2003|foreign key/i);

        // cleanup
        await prisma.order.delete({ where: { id: o.id } });
    });
});
