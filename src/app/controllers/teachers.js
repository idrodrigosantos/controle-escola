// Cálculo de idade
const { age, date, graduation } = require('../../lib/utils');

// Importa o modelo
const Teacher = require('../models/Teacher');

module.exports = {
    index(req, res) {
        let { filter, page, limit } = req.query;

        page = page || 1;
        limit = limit || 2;
        let offset = limit * (page - 1);

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(teachers) {
                const pagination = {
                    // ceil arredonda o cálculo para cima
                    total: Math.ceil(teachers[0].total / limit),
                    page
                }

                return res.render('teachers/index', { teachers, pagination, filter });
            }
        }

        Teacher.paginate(params);
    },
    // Página para criar professor
    create(req, res) {
        return res.render('teachers/create');
    },
    // Create
    post(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Teacher.create(req.body, function (teacher) {
            return res.redirect(`/teachers/${teacher.id}`);
        });
    },
    // Show
    show(req, res) {
        Teacher.find(req.params.id, function (teacher) {
            // Se não tiver um professor
            if (!teacher) {
                return res.send('Professor não foi encontrado.');
            }

            teacher.age = age(teacher.birth_date);
            teacher.graduation = graduation(teacher.education_level);
            teacher.subjects_taught = teacher.subjects_taught.split(',');
            teacher.created_at = date(teacher.created_at).format;

            return res.render('teachers/show', { teacher });
        });
    },
    // Edit
    edit(req, res) {
        Teacher.find(req.params.id, function (teacher) {
            // Se não tiver um instrutor
            if (!teacher) {
                return res.send('Professor não foi encontrado.');
            }

            teacher.birth_date = date(teacher.birth_date).iso;

            return res.render('teachers/edit', { teacher });
        });
    },
    // Update
    update(req, res) {
        // Validação dos campos
        const keys = Object.keys(req.body);

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send('Por favor, preencha todos os campos.');
            }
        }

        Teacher.update(req.body, function () {
            return res.redirect(`/teachers/${req.body.id}`);
        });
    },
    // Delete
    delete(req, res) {
        Teacher.delete(req.body.id, function () {
            return res.redirect(`/teachers`);
        });
    }
};