export const allMiddleware = (...functions) => {
    return async (parent, args, context) => {
        // The first function in the list is the resolver (the main function to be executed).
        let resolver = functions[0];

        // Extract all middleware functions (all functions except the first one).
        const [,...middlewares] = functions;

        // Apply middleware functions in reverse order (last middleware is executed first).
        for (const middleware of middlewares.reverse()) {
            resolver = middleware(resolver);
        }
        return resolver(parent, args, context);
    }
};
