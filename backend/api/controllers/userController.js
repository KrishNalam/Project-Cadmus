import { User } from '.././models/user.js'

async function addUser(req, res) {
    try {
        await User.sync()
        const user = await User.create(req.body)
        res.status(201).json(user)
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(500).json({
            message: 'Failed to create user',
            error: error.message,
        })
    }
}

async function findUser(req, res) {
    try {
        const user = await User.findOne({ where: req.body })
        if (user) {
            res.status(200).json(user.name)
        } else {
            console.log('User not found')
        }
    } catch (error) {
        console.error('Error retrieving user:', error)
    }
}

async function findAllUsers(_req, res) {
    try {
        const allUsers = await User.findAll({ attributes: ['name'] })
        const allNames = allUsers.map((user) => user.name)
        res.status(200).json(allNames)
    } catch (error) {
        console.error('Error retrieving user:', error)
        res.status(500).json({
            message: 'Failed to read all users',
            error: error.message,
        })
    }
}

// async function updateUser(id, name) {
//     try {
//         const user = await User.findByPk(id)
//         if (user) {
//             user.name = name
//             await user.save()
//             console.log('User updated:', user)
//             return user
//         } else {
//             console.log('User not found')
//         }
//     } catch (error) {
//         console.error('Error updating user:', error)
//     }
// }

// async function deleteUser(id, name) {
//     try {
//         const user = await User.findByPk(id)
//         if (user) {
//             await user.destroy()
//             console.log('User deleted')
//             return { message: 'User deleted' } //used CHATGPT for this, might need explaining
//         }
//     } catch (error) {
//         console.error('Error deleting user:', error)
//     }
// }
export { addUser, findAllUsers, findUser }
