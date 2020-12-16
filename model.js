module.exports = {
    login(db, data){
        return db('personal')
        .select('PAYROLLNO', 'person_firstname', 'person_lastname')
        .where('person_username', data.username)
        .andWhere('person_password', data.password)
    },
    addOt(db, data){
        return db('ot')
        .insert(data);
    },
    updateOt(db, id, data){
        return db('ot')
        .where('id', id)
        .update(data);
    },
    deleteOt(db,id){
        return db('ot')
        .where('id', id)
        .del();
    },
    getOtnormalById(db, id){
        return db('ot')
        .where('id',id);
    },
    getOtnormalAll(db, id){
        return db('ot');
    }
};