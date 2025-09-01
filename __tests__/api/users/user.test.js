/* eslint-disable no-undef */
const { PrismaClient, Prisma } = require('../../../prisma/generated/client');
const prisma = new PrismaClient();

// Nettoyage complet (ordre sûr avec FKs)
async function clean() {
    await prisma.$transaction([
        prisma.notification.deleteMany(),
        prisma.message.deleteMany(),
        prisma.cartItem.deleteMany(),
        prisma.order.deleteMany(),
        prisma.proposal.deleteMany(),
        prisma.advert.deleteMany(),
        prisma.project.deleteMany(),
        prisma.image.deleteMany(),
        prisma.productStock.deleteMany(),
        prisma.product.deleteMany(),
        prisma.seller.deleteMany(),
        prisma.client.deleteMany(),
        prisma.session.deleteMany(),
        prisma.account.deleteMany(),
        prisma.verificationToken.deleteMany(),
        prisma.user.deleteMany(),
    ]);
}

beforeAll(async () => {
    await clean();
});
beforeEach(async () => {
    await clean();
});
afterAll(async () => {
    await clean();
    await prisma.$disconnect();
});

describe('Create User Tests', () => {
    it('Should create a user as a client', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'client@example.com',
                username: 'clientuser',
                password: 'securepassword',
                role: 'CLIENT',
                client: {
                    create: { firstname: 'John', lastname: 'Doe' },
                },
            },
            include: { client: true },
        });

        expect(user.role).toBe('CLIENT');
        expect(user.client).not.toBeNull();
        expect(user.client.firstname).toBe('John');
        // Pas d'inclusion "seller" donc undefined
        expect(user.seller).toBeUndefined();
    });

    it('Should create a user as a seller', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'seller@example.com',
                username: 'selleruser',
                password: 'securepassword',
                role: 'SELLER',
                seller: {
                    create: { business_name: 'My Business' },
                },
            },
            include: { seller: true },
        });

        expect(user.role).toBe('SELLER');
        expect(user.seller).not.toBeNull();
        expect(user.seller.business_name).toBe('My Business');
        expect(user.client).toBeUndefined();
    });

    it('Should fail to create a user with an existing email', async () => {
        await prisma.user.create({
            data: {
                email: 'client@example.com',
                username: 'clientuser1',
                password: 'securepassword',
                role: 'CLIENT',
                client: { create: { firstname: 'John', lastname: 'Doe' } },
            },
        });

        await expect(
            prisma.user.create({
                data: {
                    email: 'client@example.com', // déjà pris
                    username: 'clientuser2',
                    password: 'securepassword',
                    role: 'CLIENT',
                    client: { create: { firstname: 'Johnny', lastname: 'Dowee' } },
                },
            })
        ).rejects.toThrow(/Unique constraint failed.*email/i);
    });

    it('Should fail to create a user with an existing username', async () => {
        await prisma.user.create({
            data: {
                email: 'client1@example.com',
                username: 'clientuser',
                password: 'securepassword',
                role: 'CLIENT',
                client: { create: { firstname: 'John', lastname: 'Doe' } },
            },
        });

        await expect(
            prisma.user.create({
                data: {
                    email: 'client2@example.com',
                    username: 'clientuser', // déjà pris
                    password: 'securepassword',
                    role: 'CLIENT',
                    client: { create: { firstname: 'Johnny', lastname: 'Dowee' } },
                },
            })
        ).rejects.toThrow(/Unique constraint failed.*username/i);
    });

    it('Should fail to create a user without a role', async () => {
        await expect(
            prisma.user.create({
                data: {
                    email: 'norole@example.com',
                    username: 'noroleuser',
                    password: 'securepassword',
                    // role manquant
                },
            })
        ).rejects.toThrow();
    });

    it('Should fail to create a user with an invalid role', async () => {
        await expect(
            prisma.user.create({
                data: {
                    email: 'invalidrole@example.com',
                    username: 'invalidroleuser',
                    password: 'securepassword',
                    role: 'INVALID_ROLE', // hors enum
                },
            })
        ).rejects.toThrow();
    });
});

describe('Read User Tests', () => {
    it('Should return a list of users', async () => {
        await prisma.user.createMany({
            data: [
                { email: 'user1@example.com', username: 'user1', password: 'securepassword', role: 'CLIENT' },
                { email: 'user2@example.com', username: 'user2', password: 'securepassword', role: 'SELLER' },
            ],
        });

        const users = await prisma.user.findMany();

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThanOrEqual(2);
        expect(users[0]).toHaveProperty('email');
        expect(users[1]).toHaveProperty('username');
    });

    it('Should return a user by id', async () => {
        const user = await prisma.user.create({
            data: { email: 'user3@example.com', username: 'user3', password: 'securepassword', role: 'CLIENT' },
        });

        const foundUser = await prisma.user.findUnique({ where: { id: user.id } });
        expect(foundUser).not.toBeNull();
        expect(foundUser.email).toBe('user3@example.com');
        expect(foundUser.username).toBe('user3');
    });

    it('Should return a user by email', async () => {
        await prisma.user.create({
            data: { email: 'user4@example.com', username: 'user4', password: 'securepassword', role: 'SELLER' },
        });

        const foundUser = await prisma.user.findUnique({ where: { email: 'user4@example.com' } });
        expect(foundUser).not.toBeNull();
        expect(foundUser.username).toBe('user4');
    });

    it('Should return a user by username', async () => {
        await prisma.user.create({
            data: { email: 'user5@example.com', username: 'user5', password: 'securepassword', role: 'CLIENT' },
        });

        const foundUser = await prisma.user.findUnique({ where: { username: 'user5' } });
        expect(foundUser).not.toBeNull();
        expect(foundUser.email).toBe('user5@example.com');
    });

    it('Should retrieve the client profile associated with the user', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'client@example.com',
                username: 'clientuser',
                password: 'securepassword',
                role: 'CLIENT',
                client: { create: { firstname: 'John', lastname: 'Doe' } },
            },
            include: { client: true },
        });

        const foundUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { client: true },
        });

        expect(foundUser.client).not.toBeNull();
        expect(foundUser.client.firstname).toBe('John');
        expect(foundUser.client.lastname).toBe('Doe');
    });

    it('Should retrieve the seller profile associated with the user', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'seller@example.com',
                username: 'selleruser',
                password: 'securepassword',
                role: 'SELLER',
                seller: { create: { business_name: 'SellerCorp' } },
            },
            include: { seller: true },
        });

        const foundUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: { seller: true },
        });

        expect(foundUser.seller).not.toBeNull();
        expect(foundUser.seller.business_name).toBe('SellerCorp');
    });
});

describe('Update User Tests', () => {
    it("Should update the user's email", async () => {
        const user = await prisma.user.create({
            data: { email: 'oldemail@example.com', username: 'testuser', password: 'securepassword', role: 'CLIENT' },
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { email: 'newemail@example.com' },
        });

        expect(updated.email).toBe('newemail@example.com');
    });

    it("Should fail to update the user's email to an existing email", async () => {
        await prisma.user.create({
            data: { email: 'existingemail@example.com', username: 'existinguser', password: 'securepassword', role: 'CLIENT' },
        });
        const user = await prisma.user.create({
            data: { email: 'uniqueemail@example.com', username: 'uniqueuser', password: 'securepassword', role: 'CLIENT' },
        });

        await expect(
            prisma.user.update({
                where: { id: user.id },
                data: { email: 'existingemail@example.com' },
            })
        ).rejects.toThrow(/Unique constraint failed.*email/i);
    });

    it("Should update the user's username", async () => {
        const user = await prisma.user.create({
            data: { email: 'testuser@example.com', username: 'oldusername', password: 'securepassword', role: 'CLIENT' },
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { username: 'newusername' },
        });

        expect(updated.username).toBe('newusername');
    });

    it("Should fail to update the user's username to an existing username", async () => {
        await prisma.user.create({
            data: { email: 'existinguser@example.com', username: 'existingusername', password: 'securepassword', role: 'CLIENT' },
        });
        const user = await prisma.user.create({
            data: { email: 'testuser@example.com', username: 'uniqueusername', password: 'securepassword', role: 'CLIENT' },
        });

        await expect(
            prisma.user.update({
                where: { id: user.id },
                data: { username: 'existingusername' },
            })
        ).rejects.toThrow(/Unique constraint failed.*username/i);
    });

    it("Should update the user's password", async () => {
        const user = await prisma.user.create({
            data: { email: 'testuser@example.com', username: 'testuser', password: 'oldpassword', role: 'CLIENT' },
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { password: 'newsecurepassword' },
        });

        expect(updated.password).toBe('newsecurepassword');
    });

    it("Should fail to update the user's password to a short password (business rule)", async () => {
        const user = await prisma.user.create({
            data: { email: 'testuser@example.com', username: 'testuser', password: 'securepassword', role: 'CLIENT' },
        });

        const updatePassword = async (userId, newPassword) => {
            if (newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            return prisma.user.update({ where: { id: userId }, data: { password: newPassword } });
        };

        await expect(updatePassword(user.id, 'short')).rejects.toThrow('Password must be at least 8 characters long');
    });

    it("Should update the user's profile picture", async () => {
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'securepassword',
                role: 'CLIENT',
                profile_picture: 'http://oldpicture.com/old.jpg',
            },
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { profile_picture: 'http://newpicture.com/new.jpg' },
        });

        expect(updated.profile_picture).toBe('http://newpicture.com/new.jpg');
    });

    it("Should remove the user's profile picture", async () => {
        const user = await prisma.user.create({
            data: {
                email: 'testuser@example.com',
                username: 'testuser',
                password: 'securepassword',
                role: 'CLIENT',
                profile_picture: 'http://picture.com/picture.jpg',
            },
        });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { profile_picture: null },
        });

        expect(updated.profile_picture).toBeNull();
    });
});

describe('Delete User Tests', () => {
    it('Should delete a user by ID', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'deleteuser@example.com',
                username: 'deleteuser',
                password: 'securepassword',
                role: 'CLIENT',
                client: { create: { firstname: 'John', lastname: 'Doe' } },
            },
        });

        await prisma.user.delete({ where: { id: user.id } });

        const deleted = await prisma.user.findUnique({ where: { id: user.id } });
        expect(deleted).toBeNull();
    });

    it('Should delete the associated client profile when the user is deleted (ON DELETE CASCADE)', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'clientdelete@example.com',
                username: 'clientdelete',
                password: 'securepassword',
                role: 'CLIENT',
                client: { create: { firstname: 'John', lastname: 'Doe' } },
            },
            include: { client: true },
        });

        await prisma.user.delete({ where: { id: user.id } });

        const deletedClient = await prisma.client.findUnique({ where: { id: user.client.id } });
        expect(deletedClient).toBeNull();
    });

    it('Should delete the associated seller profile when the user is deleted (ON DELETE CASCADE)', async () => {
        const user = await prisma.user.create({
            data: {
                email: 'sellerdelete@example.com',
                username: 'sellerdelete',
                password: 'securepassword',
                role: 'SELLER',
                seller: { create: { business_name: 'My Business' } },
            },
            include: { seller: true },
        });

        await prisma.user.delete({ where: { id: user.id } });

        const deletedSeller = await prisma.seller.findUnique({ where: { id: user.seller.id } });
        expect(deletedSeller).toBeNull();
    });

    it('Should delete all messages associated with the user (ON DELETE CASCADE)', async () => {
        const sender = await prisma.user.create({
            data: { email: 'sender@example.com', username: 'sender', password: 'securepassword', role: 'CLIENT' },
        });
        const recipient = await prisma.user.create({
            data: { email: 'recipient@example.com', username: 'recipient', password: 'securepassword', role: 'CLIENT' },
        });

        const message = await prisma.message.create({
            data: { content: 'Hello!', senderId: sender.id, recipientId: recipient.id },
        });

        await prisma.user.delete({ where: { id: sender.id } });

        const deletedMessage = await prisma.message.findUnique({ where: { id: message.id } });
        expect(deletedMessage).toBeNull();
    });

    it('Should delete all notifications associated with the user (ON DELETE CASCADE)', async () => {
        const user = await prisma.user.create({
            data: { email: 'notifuser@example.com', username: 'notifuser', password: 'securepassword', role: 'CLIENT' },
        });

        const notification = await prisma.notification.create({
            data: { content: 'You have a new message!', userId: user.id },
        });

        await prisma.user.delete({ where: { id: user.id } });

        const deletedNotif = await prisma.notification.findUnique({ where: { id: notification.id } });
        expect(deletedNotif).toBeNull();
    });
});
