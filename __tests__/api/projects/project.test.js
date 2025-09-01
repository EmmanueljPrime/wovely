/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

/* ---------- Helpers: créer/réutiliser les acteurs nécessaires ---------- */
async function ensureClient() {
    const email = 'client_project_tests@wovely.test';
    const username = 'client_project_tests';
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
            client: { create: { firstname: 'Alice', lastname: 'Doe' } },
        },
        include: { client: true },
    });
    return user.client.id;
}

async function ensureSeller(tag = 'A') {
    const email = `seller_project_tests_${tag}@wovely.test`;
    const username = `seller_project_tests_${tag}`;
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
            seller: { create: { business_name: `Atelier Tests Projets ${tag}` } },
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

/* Pour isoler facilement des lots créés par ce run */
const RUN = `JEST-PROJ-${Date.now()}`;

describe('Project - Create', () => {
    it('should create a minimal project (client only, status par défaut)', async () => {
        const project = await prisma.project.create({
            data: {
                title: `${RUN}-Minimal`,
                description: 'Premier brief',
                clientId,
            },
            select: { id: true, title: true, status: true, clientId: true, sellerId: true, images: true },
        });

        expect(project.title).toContain(RUN);
        expect(project.status).toBe('pending');
        expect(project.clientId).toBe(clientId);
        expect(project.sellerId).toBeNull();
        expect(Array.isArray(project.images)).toBe(true);
    });

    it('should create a project with seller, images et deadline', async () => {
        const deadline = new Date(Date.now() + 7 * 24 * 3600 * 1000);
        const project = await prisma.project.create({
            data: {
                title: `${RUN}-Full`,
                description: 'Avec contraintes',
                clientId,
                sellerId: sellerAId,
                images: ['https://example.com/p1.jpg'],
                deadline,
            },
            select: { id: true, images: true, sellerId: true, deadline: true },
        });

        expect(project.sellerId).toBe(sellerAId);
        expect(project.images.length).toBe(1);
        expect(new Date(project.deadline).getTime()).toBeCloseTo(deadline.getTime(), -2);
    });
});

describe('Project - Read', () => {
    it('should list only projects created in this run (filtrés par titre)', async () => {
        await prisma.project.createMany({
            data: [
                { title: `${RUN}-List-1`, description: 'd1', clientId },
                { title: `${RUN}-List-2`, description: 'd2', clientId },
            ],
        });

        const projects = await prisma.project.findMany({
            where: { title: { contains: RUN } },
            select: { id: true, title: true },
        });

        expect(projects.length).toBeGreaterThanOrEqual(2);
        expect(projects.every(p => p.title.includes(RUN))).toBe(true);
    });

    it('should return a project with relations (client, seller, proposals, advert)', async () => {
        const prj = await prisma.project.create({
            data: {
                title: `${RUN}-WithRels`,
                description: 'Relations complètes',
                clientId,
                sellerId: sellerAId,
            },
            select: { id: true },
        });

        // 👉 Créer l’Advert du projet d’abord (obligatoire car Proposal.advertId est requis)
        const adv = await prisma.advert.create({
            data: {
                title: `${RUN}-Adv-1`,
                description: 'Annonce liée',
                price: new Prisma.Decimal('100.00'),
                sellerId: sellerAId,
                projectId: prj.id,
            },
            select: { id: true },
        });

        // Deux propositions reliées à ce même Advert
        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('120.50'),
                message: 'Je peux le faire',
                project: { connect: { id: prj.id } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: adv.id } },
            },
        });
        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('140.00'),
                message: 'Offre alternative',
                project: { connect: { id: prj.id } },
                seller:  { connect: { id: sellerBId } },
                advert:  { connect: { id: adv.id } },
            },
        });

        const found = await prisma.project.findUnique({
            where: { id: prj.id },
            include: { client: true, seller: true, proposals: true, advert: true },
        });

        expect(found.client.id).toBe(clientId);
        expect(found.seller?.id).toBe(sellerAId);
        expect(found.proposals.length).toBe(2);
        expect(found.advert?.title).toContain(RUN);
    });
});

describe('Project - Update', () => {
    it('should update status, deadline, images (set) et changer de seller', async () => {
        const prj = await prisma.project.create({
            data: {
                title: `${RUN}-Upd`,
                description: 'à mettre à jour',
                clientId,
                sellerId: sellerAId,
                images: ['https://example.com/old.jpg'],
            },
            select: { id: true },
        });

        const newDeadline = new Date(Date.now() + 14 * 24 * 3600 * 1000);

        const updated = await prisma.project.update({
            where: { id: prj.id },
            data: {
                status: 'in_progress',
                deadline: newDeadline,
                images: { set: ['https://example.com/new1.jpg', 'https://example.com/new2.jpg'] },
                sellerId: sellerBId,
            },
            select: { id: true, status: true, sellerId: true, images: true, deadline: true },
        });

        expect(updated.status).toBe('in_progress');
        expect(updated.sellerId).toBe(sellerBId);
        expect(updated.images.length).toBe(2);
        expect(new Date(updated.deadline).getTime()).toBeCloseTo(newDeadline.getTime(), -2);
    });
});

describe('Project - Delete & contraintes', () => {
    it('should refuse deleting a project that has proposals (FK)', async () => {
        const prj = await prisma.project.create({
            data: { title: `${RUN}-DelBlocked`, description: 'avec propositions', clientId },
            select: { id: true },
        });

        // 👉 Advert requis pour pouvoir créer une Proposal
        const adv = await prisma.advert.create({
            data: {
                title: `${RUN}-Adv-Block`,
                description: 'Annonce liée',
                price: new Prisma.Decimal('80.00'),
                sellerId: sellerAId,
                projectId: prj.id,
            },
            select: { id: true },
        });

        await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('50.00'),
                message: 'Bloc FK',
                project: { connect: { id: prj.id } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: adv.id } },
            },
            select: { id: true },
        });

        await expect(
            prisma.project.delete({ where: { id: prj.id }, select: { id: true } })
        ).rejects.toThrow(/P2003|foreign key/i);

        // cleanup pour la suite des tests
        await prisma.proposal.deleteMany({ where: { projectId: prj.id } });
        await prisma.project.delete({ where: { id: prj.id }, select: { id: true } });
        const deleted = await prisma.project.findUnique({ where: { id: prj.id }, select: { id: true } });
        expect(deleted).toBeNull();
    });

    it('should enforce one Order per project (unique projectId)', async () => {
        const prj = await prisma.project.create({
            data: { title: `${RUN}-OrderUnique`, description: 'order uniq', clientId, sellerId: sellerAId },
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
        const prj = await prisma.project.create({
            data: { title: `${RUN}-OrderByProposal`, description: 'order uniq proposal', clientId, sellerId: sellerAId },
            select: { id: true },
        });

        // 👉 Advert requis
        const adv = await prisma.advert.create({
            data: {
                title: `${RUN}-Adv-Order`,
                description: 'Annonce liée',
                price: new Prisma.Decimal('180.00'),
                sellerId: sellerAId,
                projectId: prj.id,
            },
            select: { id: true },
        });

        const prop = await prisma.proposal.create({
            data: {
                price: new Prisma.Decimal('180.00'),
                message: 'prop portée',
                project: { connect: { id: prj.id } },
                seller:  { connect: { id: sellerAId } },
                advert:  { connect: { id: adv.id } },
            },
            select: { id: true },
        });

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

        await expect(
            prisma.order.create({
                data: {
                    totalPrice: new Prisma.Decimal('185.00'),
                    sellerId: sellerAId,
                    clientId,
                    type: 'project',
                    projectId: prj.id,   // même projet
                    proposalId: prop.id, // même proposition → unique
                },
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*(proposalId|projectId)/i);
    });

    it('should enforce one Advert per project (Advert.projectId unique)', async () => {
        const prj = await prisma.project.create({
            data: { title: `${RUN}-AdvertUniq`, description: 'advert uniq', clientId },
            select: { id: true },
        });

        await prisma.advert.create({
            data: {
                title: `${RUN}-Adv`,
                description: 'Annonce liée',
                price: new Prisma.Decimal('99.00'),
                sellerId: sellerAId,
                projectId: prj.id, // unique
            },
            select: { id: true },
        });

        await expect(
            prisma.advert.create({
                data: {
                    title: `${RUN}-Adv-2`,
                    description: 'Seconde annonce même projet',
                    price: new Prisma.Decimal('109.00'),
                    sellerId: sellerAId,
                    projectId: prj.id, // viol → unique
                },
                select: { id: true },
            })
        ).rejects.toThrow(/Unique constraint failed.*projectId/i);
    });
});
