auth_model = require('../models/Authories');
const { Op } = require('sequelize');

const find_user = async (login, password) => {
    return await auth_model.findOne({
        where: {
            [Op.and]: [
                { login: login },
                { password: password }
            ]
        }
    });
};


const create_user_bd = async (login, password) => {
    return await auth_model.create({
        login: login,
        password: password
      });
};

exports.check_auth = async (login, password) => {
    let user = await find_user(login, password);
    if (user) {
        return user.id;
    }
    return undefined;
}

exports.create_user = async(login,password)=>{
    try {
    const userData = await create_user_bd(login,password);
    return userData.toJSON();
    }
    catch (error) {
        console.error('Произошла ошибка:', error);
        return;
    }
}