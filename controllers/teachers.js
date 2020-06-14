// File System
const fs = require('fs');

// Dados
const data = require('../data.json');

// Usa utils.js
const { age, date, graduation } = require('../utils');

// Formato de data pt-BR
const Intl = require('intl');

// Página inicial
exports.index = function (req, res) {
    return res.render('teachers/index', { teachers: data.teachers });
}

// Página para criar professor
exports.create = function (req, res) {
    return res.render('teachers/create');
}

// Cadastro professor
exports.post = function (req, res) {
    // Validação dos campos
    const keys = Object.keys(req.body);

    for (key of keys) {
        if (req.body[key] == '') {
            return res.send('Por favor, preencha todos os campos.');
        }
    }

    // Desestruturação do req.body
    let { avatar_url, name, birth, degree, type, occupations } = req.body;

    // Transforme a data de nascimento em timestamp
    birth = Date.parse(birth);

    // No momento do cadastro cria a data no formato timestamp
    const created_at = Date.now();

    // Cria o id para o usuário
    const id = Number(data.teachers.length + 1);

    // Adiciona o req.body no array
    data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        degree,
        type,
        occupations,
        created_at
    });

    // Escreve no arquivo data.json
    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('teachers');
    });
}

// Mostra professor
exports.show = function (req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function (teacher) {
        return teacher.id == id;
    });

    if (!foundTeacher) {
        return res.send('Professor não foi encontrado.');
    }

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        // .split() transforma a string em um array quando encontar algo (neste casa a vírgula)
        occupations: foundTeacher.occupations.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at),
        level_degree: graduation(foundTeacher.degree)
    }

    return res.render('teachers/show', { teacher });
}

// Editar professor
exports.edit = function (req, res) {
    const { id } = req.params;

    const foundTeacher = data.teachers.find(function (teacher) {
        return teacher.id == id;
    });

    if (!foundTeacher) {
        return res.send('Professor não foi encontrado.');
    }

    const teacher = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render('teachers/edit', { teacher });
}

// Salva as alterações do professor
exports.update = function (req, res) {
    const { id } = req.body;
    let index = 0;

    const foundTeacher = data.teachers.find(function (techer, foundIndex) {
        if (id == techer.id) {
            index = foundIndex;
            return true;
        }
    });

    if (!foundTeacher) {
        return res.send('Professor não foi encontrado.');
    }

    const techer = {
        ...foundTeacher,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.teachers[index] = techer;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect(`/teachers/${id}`);
    });
}

// Deleta professor
exports.delete = function (req, res) {
    const { id } = req.body;

    const filteredTeachers = data.teachers.filter(function (teacher) {
        return teacher.id != id;
    });

    data.teachers = filteredTeachers;

    fs.writeFile('data.json', JSON.stringify(data, null, 4), function (err) {
        if (err) {
            return res.send('Erro no arquivo de gravação.');
        }

        return res.redirect('/teachers');
    });
}