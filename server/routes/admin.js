import User from '../objects/user.js';
import { hashPassword } from '../utils/hashing.js';
import Card from '../objects/card.js';
function isEmailValid(email) {
  // Expression régulière pour valider le format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isPasswordStrong(password) {
  // Vérifie que le mot de passe a au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

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
    if (!user || !user.isAdmin()) {
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

export function adminUpdatePseudo(request, response) {
    const adminId = request.session.userId;

    if (!adminId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const user = User.fromId(adminId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { newPseudo, userId } = request.body;
    const targetUser = User.fromId(userId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.pseudo = newPseudo;
    targetUser.save();

    response.json({ success: true, message: 'Pseudo updated successfully' });
}

export function adminUpdateEmail(request, response) {
    const adminId = request.session.userId;

    if (!adminId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const user = User.fromId(adminId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { newEmail, userId } = request.body;
    if (!isEmailValid(newEmail)) {
        response.status(400).json({ error: 'Invalid email format' });
        return;
    }

    const targetUser = User.fromId(userId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.email = newEmail;
    targetUser.save();

    response.json({ success: true, message: 'Email updated successfully' });
}

export function adminDeleteUser(request, response) {
    const adminId = request.session.userId;

    if (!adminId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const user = User.fromId(adminId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { userId } = request.body;
    const targetUser = User.fromId(userId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.delete();

    response.json({ success: true, message: 'User deleted successfully' });
}

export async function adminUpdatePassword(request, response) {
    const adminId = request.session.userId;

    if (!adminId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const user = User.fromId(adminId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { newPassword, userId } = request.body;
    if (!isPasswordStrong(newPassword)) {
        response.status(400).json({ error: 'Password does not meet strength requirements' });
        return;
    }

    const targetUser = User.fromId(userId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.password = await hashPassword(newPassword);
    targetUser.save();
    
    response.json({ success: true, message: 'Password updated successfully' });
}

export function adminUpdateRole(request, response) {
    const adminId = request.session.userId;

    if (!adminId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    
    const user = User.fromId(adminId);
    if (!user || !user.isAdmin) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { newRole, userId } = request.body;
    const availableRoles = ['user', 'admin'];
    if (!availableRoles.includes(newRole)) {
        response.status(400).json({ error: 'Invalid role specified' });
        return;
    }

    const targetUser = User.fromId(userId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.setRole(newRole);

    response.json({ success: true, message: 'Role updated successfully' });
}


export function adminGetAllCards(request, response) {
    const userId = request.session.userId;

    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    } 
    const user = User.fromId(userId);
    if (!user || !user.isAdmin()) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }
    
    const cards = Card.getAll();
    response.json(cards);
}

export function adminSetUserCollection(request, response) {
    const userId = request.session.userId;
    
    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = User.fromId(userId);
    if (!user || !user.isAdmin()) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { targetUserId, cardId, quantity } = request.body;
    const targetUser = User.fromId(targetUserId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }
    console.log(`Setting collection for user ${targetUserId}: card ${cardId} with quantity ${quantity}`);
    
    targetUser.setCardQuantity(cardId, quantity);
    response.json({ success: true, message: 'User collection updated successfully' });
}

export function adminUpdateUserBalance(request, response) {
    const userId = request.session.userId;
    
    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = User.fromId(userId);
    if (!user || !user.isAdmin()) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { targetUserId, newBalance } = request.body;
    const targetUser = User.fromId(targetUserId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }

    targetUser.setKeys(newBalance);
    response.json({ success: true, message: 'User balance updated successfully' });
}

export function adminChangeUserPP(request, response) {
    const userId = request.session.userId;
    
    if (!userId) {
        response.status(401).json({ error: 'Unauthorized' });
        return;
    }
    const user = User.fromId(userId);
    if (!user || !user.isAdmin()) {
        response.status(403).json({ error: 'Forbidden' });
        return;
    }

    const { targetUserId, newPP } = request.body;
    const targetUser = User.fromId(targetUserId);
    if (!targetUser) {
        response.status(404).json({ error: 'User not found' });
        return;
    }
    targetUser.profilePicture = newPP;
    targetUser.save();
    response.json({ success: true, message: 'User profile picture updated successfully' });
}