import User from '../objects/user.js';
export function adminGetAllUsers(request, response) {
    const userId = request.session.userId;
    console.log('ID de l’utilisateur connecté :', userId);

    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    } 
    const user = User.fromId(userId);
    if (!user || !user.isAdmin()) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const users = User.getAllUsers();
    response.json(users);

}

export function isAdmin(request, response) {
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    } 
    const user = User.fromId(userId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    response.json({ isAdmin: true });

}

export function adminGetUserDetails(request, response) {
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }

    const user = User.fromId(userId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const targetUserId = request.params.userId;

    const targetUser = User.fromId(targetUserId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }
    response.json(targetUser);
}