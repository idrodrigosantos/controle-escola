// Cálculo de idade
const { date, grade } = require('../../lib/utils');

// Importa o modelo
const Student = require('../models/Student');

module.exports = {
    // Index
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
            callback(students) {
                const pagination = {
                    // ceil arredonda o cálculo para cima
                    total: Math.ceil(students[0].total / limit),
                    page
                }

                return res.render('students/index', { students, pagination, filter });
            }
        }

        Student.paginate(params);
    },
    // Página para criar aluno
    create(req, res) {
        Student.teachersSelectOptions(function (options) {
            return res.render('students/create', { teacherOptions: options });
        });
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

        Student.create(req.body, function (student) {
            return res.redirect(`/students/${student.id}`);
        });
    },
    // Show
    show(req, res) {
        Student.find(req.params.id, function (student) {
            // Se não tiver um aluno
            if (!student) {
                return res.send('Aluno não foi encontrado.');
            }

            student.birth = date(student.birth).birthDay;
            student.grade = grade(student.school_year);

            return res.render('students/show', { student });
        });
    },
    // Edit
    edit(req, res) {
        Student.find(req.params.id, function (student) {
            // Se não tiver um aluno
            if (!student) {
                return res.send('Aluno não foi encontrado.');
            }

            student.birth = date(student.birth).iso;

            Student.teachersSelectOptions(function (options) {
                return res.render('students/edit', { student, teacherOptions: options });
            });
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

        Student.update(req.body, function () {
            return res.redirect(`/students/${req.body.id}`);
        });
    },
    // Delete
    delete(req, res) {
        Student.delete(req.body.id, function () {
            return res.redirect(`/students`);
        });
    }
};