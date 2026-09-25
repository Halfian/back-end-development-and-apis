export function authorizeModification(req, res, next) {
    const userRole = req.user?.role;
    const targetUserId = Number(req.params.userId);
    const currentUserId = Number(req.user?.id);
    
    if (userRole !== "parent") {
        if (userRole !== "child" || targetUserId !== currentUserId) {
            return res.status(403).json({ "error": "Access denied" })
        }
    }

    next();
}