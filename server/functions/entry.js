entry_model = require('../models/DiaryEntry');
const { Op } = require('sequelize');

const find_entry_by_id = async (data,userid) => {
    return await entry_model.findAll({
        where: {
            [Op.and]: [
                { dates: data  },
                { userid:userid }
            ] 
        }
    });
};

exports.entry_by_id = async (data,userid) => {
    let entry = await find_entry_by_id(data,userid);
    if (entry) {
        return entry;
    }
    return undefined;
}

const create_entry = async (data,text,completed,userid) => {
    try {
        return await entry_model.create({
            text: text,
            userid: userid,
            dates: data,
            completed:completed,
        });
    } catch (error) {
        console.error('Error creating entry:', error);
    }
};

exports.entry_create = async (data,text,completed,userid) => {
    let entry = await create_entry(data,text,completed,userid);
    if (entry) {
        return entry;
    }
    return undefined;
}

const toggle_entry = async(id,userid)=>{
    try {
        const existingValue = await entry_model.findOne({ 
            where: {
                [Op.and]: [
                    { id: id },
                    { userid:userid }
                ] 
            }
        });

const invertedValue = !existingValue.completed;

        return await entry_model.update({ completed: invertedValue},{
            where: {
                [Op.and]: [
                    {  id: id },
                    { userid:userid }
                ]
            }
        });
    } catch (error) {
        console.error('Error creating entry:', error);
    }
}

exports.entry_toggle = async(id,userid)=>{
    let entry = await toggle_entry(id,userid);
    if (entry) {
        return entry;
    }
    return undefined;
}

const remove_entry = async (id,userid) => {
    return await entry_model.destroy({
        where: {
            [Op.and]: [
                { id: id },
                { userid:userid }
            ]
        }
      });
};

exports.entry_remove = async(id,userid)=>{
    let entry = await remove_entry(id,userid);
    if (entry) {
        return entry;
    }
    return undefined;
}