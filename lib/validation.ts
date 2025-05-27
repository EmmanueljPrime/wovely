// Validation middleware
export const validate = <T>(schema: z.ZodType<T>) => {
  return async (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
    try {
      // Validate request body
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: 'Validation error',
          errors: error.errors,
        });
      }
      return res.status(400).json({ message: 'Invalid request data' });
    }
  };
};

// User schemas
export const registerUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: z.enum(['CLIENT', 'SELLER']),
  // Client specific fields
  firstname: z.string().min(2).optional(),
  lastname: z.string().min(2).optional(),
  // Seller specific fields
  business_name: z.string().min(2).optional(),
}).refine(data => {
  // If role is CLIENT, firstname and lastname are required
  if (data.role === 'CLIENT') {
    return !!data.firstname && !!data.lastname;
  }
  // If role is SELLER, business_name is required
  if (data.role === 'SELLER') {
    return !!data.business_name;
  }
  return true;
}, {
  message: "Missing required fields for the selected role",
  path: ["role"],
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative(),
  categories: z.array(z.number()).optional(),
  images: z.array(z.string().url()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

// Project schemas
export const createProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  deadline: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});

export const updateProjectSchema = createProjectSchema.partial();

// Proposal schemas
export const createProposalSchema = z.object({
  price: z.number().positive(),
  message: z.string().min(10),
  projectId: z.number().int().positive(),
  advertId: z.number().int().positive(),
});

// Advert schemas
export const createAdvertSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  projectId: z.number().int().positive().optional(),
});

// Order schemas
export const createOrderSchema = z.object({
  quantity: z.number().int().positive(),
  productId: z.number().int().positive(),
  projectId: z.number().int().positive().optional(),
});

// Message schemas
export const createMessageSchema = z.object({
  content: z.string().min(1),
  recipientId: z.number().int().positive(),
});
