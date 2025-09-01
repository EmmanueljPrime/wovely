/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helpers: créer/réutiliser client & sellers ---------- */
async function ensureClient() {
    const email = 'client_proposal_tests@wovely.test';
    const username = 'client_proposal_tests';
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
            client: { create: { firstname: 'Zoé', lastname: 'Props' } },
        },
        include: { client: true },
    });
    return user.client.id;
}

async function ensureSeller(tag = 'A') {
    const email = `seller_proposal_tests_${tag}@wovely.test`;
    const username = `seller_proposal_tests_${tag}`;
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
            seller: { create: { business_name: `Atelier Proposals ${tag}` } },
        },
        include: { seller: true },
    });
    return user.seller.id;
}

/* ---------- Fixtures ---------- */
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

const RUN = `JEST-PROP-${Date.now()}`;

/* ---------- Bloc utilitaire: crée un projet + advert ---------- */
async function createProjectWithAdvert({ titleSuffix = 'BASE', sellerId = sellerAId }) {
    const project = await prisma.project.create({
        data: {
            title: `${RUN}-${titleSuffix}`,
            description: 'brief',
            clientId,
            sellerId,
        },
        select: { id: true },
    });

    const advert = await prisma.advert.create({
        data: {
            title: `${RUN}-ADV-${titleSuffix}`,
            description: 'Annonce liée',
            price: new Prisma.Decimal('100.00'),
            sellerId,
            projectId: project.id, // unique sur Advert.projectId
        },
        select: { id: true },
    });

    return { projectId: project.id, advertId: advert.id };
}

/* ===================== CREATE ===================== */
describe('Proposal - Create', () => {
    it('should create a proposal (project+seller+advert requis)', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'CREATE-OK' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('120.50'),
                message: 'Je peux le faire',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true, price: true, message: true },
        });

        expect(prop.message).toBe('Je peux le faire');
        expect(prop.price.toNumber()).toBeCloseTo(120.5, 5);
    });

    it('should fail without required advert relation', async () => {
        const { projectId } = await createProjectWithAdvert({ titleSuffix: 'CREATE-MISS-ADV' });

        await expect(
            prisma.proposal.create({
                data: {
                    price: new Prisma.Decimal('80.00'),
                    message: 'Sans advert',
                    project: { connect: { id: projectId } },
                    seller:  { connect: { id: sellerAId } },
                    // advert manquant
                },
                select: { id: true },
            })
        ).rejects.toThrow(/Argument `advert` is missing|Missing required/i);
    });
});

/* ===================== READ ===================== */
describe('Proposal - Read', () => {
    it('should list proposals for a project', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'READ-LIST' });

        await prisma.proposal.createMany({
            data: [
                { price: new Prisma.Decimal('90.00'), message: 'A', projectId, sellerId: sellerAId, advertId },
                { price: new Prisma.Decimal('95.00'), message: 'B', projectId, sellerId: sellerBId, advertId },
            ],
        });

        const list = await prisma.proposal.findMany({
            where: { projectId },
            select: { id: true, message: true },
        });

        expect(list.length).toBeGreaterThanOrEqual(2);
    });

    it('should return a proposal with relations', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'READ-ONE' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('130.00'),
                message: 'Avec relations',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        const found = await prisma.proposal.findUnique({
            where: { id: prop.id },
            include: { project: true, seller: true, advert: true, order: true },
        });

        expect(found.project.id).toBe(projectId);
        expect(found.seller.id).toBe(sellerAId);
        expect(found.advert.id).toBe(advertId);
        expect(found.order).toBeNull(); // pas encore de commande
    });
});

/* ===================== UPDATE ===================== */
describe('Proposal - Update', () => {
    it('should update price, message and status', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'UPD' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('150.00'),
                message: 'Init',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        const updated = await prisma.proposal.update({
            where: { id: prop.id },
            data: {
                price: new Prisma.Decimal('155.50'),
                message: 'Modifiée',
                status: 'accepted',
            },
            select: { id: true, price: true, message: true, status: true },
        });

        expect(updated.status).toBe('accepted');
        expect(updated.message).toBe('Modifiée');
        expect(updated.price.toNumber()).toBeCloseTo(155.5, 5);
    });

    it('should change seller of a proposal', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'UPD-SELLER' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('110.00'),
                message: 'Seller A',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        const upd = await prisma.proposal.update({
            where: { id: prop.id },
            data: { seller: { connect: { id: sellerBId } } },
            select: { id: true, sellerId: true },
        });

        expect(upd.sellerId).toBe(sellerBId);
    });
});

/* ===================== DELETE & contraintes ===================== */
describe('Proposal - Delete & contraintes', () => {
    it('should block deleting an advert referenced by proposals (FK)', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'DEL-ADV-FK' });

        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('99.00'),
                message: 'Liée à advert',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        await expect(
            prisma.advert.delete({ where: { id: advertId }, select: { id: true } })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('should block deleting a project referenced by proposals (FK)', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'DEL-PRJ-FK' });

        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('101.00'),
                message: 'Liée au projet',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        await expect(
            prisma.project.delete({ where: { id: projectId }, select: { id: true } })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('should block deleting a seller referenced by proposals (FK)', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'DEL-SELLER-FK' });

        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('111.00'),
                message: 'Liée au seller B',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerBId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        await expect(
            prisma.seller.delete({ where: { id: sellerBId } })
        ).rejects.toThrow(/P2003|foreign key/i);
    });

    it('should set order.proposalId to NULL when a referenced proposal is deleted (onDelete: SetNull)', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'DEL-PROP-SETNULL' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('180.00'),
                message: 'Pour commande',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        const order = await prisma.order.create({
            data: {
                totalPrice: new Prisma.Decimal('180.00'),
                sellerId: sellerAId,
                clientId,
                type: 'project',
                projectId,
                proposalId: prop.id, // Order.proposalId est optionnel ⇒ SetNull attendu
            },
            select: { id: true },
        });

        // suppression de la proposition ⇒ l'order doit rester mais proposalId passe à NULL
        await prisma.proposal.delete({ where: { id: prop.id }, select: { id: true } });

        const still = await prisma.order.findUnique({
            where: { id: order.id },
            select: { id: true, proposalId: true },
        });

        expect(still).not.toBeNull();
        expect(still.proposalId).toBeNull();
    });

    it('should delete a proposal without dependents', async () => {
        const { projectId, advertId } = await createProjectWithAdvert({ titleSuffix: 'DEL-OK' });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('90.00'),
                message: 'Sans dépendants',
                project: { connect: { id: projectId } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: advertId } },
            },
            select: { id: true },
        });

        await prisma.proposal.delete({ where: { id: prop.id }, select: { id: true } });
        const gone = await prisma.proposal.findUnique({ where: { id: prop.id }, select: { id: true } });
        expect(gone).toBeNull();
    });
});
