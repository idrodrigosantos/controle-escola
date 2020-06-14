// File System
const fs = require('fs');

// Dados
const data = require('../data.json');

// Usa utils.js
const { date, grade } = require('../utils');

// Página inicial
exports.index = function (req, res) {
    const students = [];

    for (let student of data.students) {
        students.push({
            ...student,
            school_year: grade(student.school_year)
        });
    }

    return res.render("students/index", { students });
}

// Página para criar aluno
exports.create = function (req, res) {
    return res.render('students/create');
}

// Cadastro aluno
exports.post = function (req, res) {
    // Validação dos campos
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preencha todos os campos.');
        }
    }

    // Transforma a data de nascimento em timestamp
    birth = Date.parse(req.body.birth);

    // Cria o id para o usuário
    let id = 1;
    const lastStudent = data.students[data.students.length - 1];
    if (lastStudent) {
        id = lastStudent.id + 1;
    }

    // Adiciona o req.body no array
    data.students.push({
        id,
        ...req.body,
        birth
    });

    // Escreve no arquivo data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('students');
    });
}

// Mostra aluno
exports.show = function (req, res) {
    const { id } = req.params;

    const foundStudent = data.students.find(function (student) {
        return student.id == id;
    });

    if (!foundStudent) {
        return res.send('Aluno não foi encontrado.');
    }

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).birthDay,
        grade: grade(foundStudent.school_year),
    }

    return res.render('students/show', { student });
}

// Editar aluno
exports.edit = function (req, res) {
    const { id } = req.params;

    const foundStudent = data.students.find(function (student) {
        return student.id == id;
    });

    if (!foundStudent) {
        return res.send('Aluno não foi encontrado.');
    }

    const student = {
        ...foundStudent,
        birth: date(foundStudent.birth).iso
    }

    return res.render('students/edit', { student });
}

// Salva as alterações do aluno
exports.update = function (req, res) {
    const { id } = req.body;
    let index = 0;

    const foundStudent = data.students.find(function (student, foundIndex) {
        if (id == student.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundStudent) {
        return res.send('Aluno não foi encontrado.');
    }

    const student = {
        ...foundStudent,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.students[index] = student;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect(`/students/${id}`);
    });
}

// Deleta aluno
exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredStudents = data.students.filter(function (student) {
        return student.id != id;
    });

    data.students = filteredStudents;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('/students');
    });
}