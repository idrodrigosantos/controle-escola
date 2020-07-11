// Utils
const { date } = require('../../lib/utils');

// Importa a conexão com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os alunos
    all(callback) {
        db.query('SELECT * FROM students ORDER BY id ASC', function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Cadastra aluno
    create(data, callback) {
        const query = `
            INSERT INTO students(
                avatar_url,
                name,
                birth,
                email,
                school_year,
                workload,
                teacher_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.email,
            data.school_year,
            data.workload,
            data.teacher
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    find(id, callback) {
        db.query(`SELECT students.*, teachers.name AS teacher_name FROM students
            LEFT JOIN teachers ON (students.teacher_id = teachers.id)
            WHERE students.id = $1`, [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    // Atualiza os dados do aluno
    update(data, callback) {
        const query = `
            UPDATE students SET
            avatar_url=($1),
            name=($2),
            birth=($3),
            email=($4),
            school_year=($5),
            workload=($6),
            teacher_id=($7)
            WHERE id = $8
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth).iso,
            data.email,
            data.school_year,
            data.workload,
            data.teacher,
            data.id
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback();
        });
    },
    // Deleta aluno
    delete(id, callback) {
        db.query('DELETE FROM students WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback();
        });
    },
    // Opção de seleção dos professores
    teachersSelectOptions(callback) {
        db.query('SELECT name, id FROM teachers', function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback(results.rows);
        });
    },
    // Paginação
    paginate(params) {
        const { filter, limit, offset, callback } = params;

        let query = '',
            filterQuery = '',
            totalQuery = '(SELECT COUNT(*) FROM students) AS total';

        if (filter) {
            filterQuery = `WHERE students.name ILIKE '%${filter}%'
                OR students.email ILIKE '%${filter}%'`;

            totalQuery = `(SELECT COUNT(*) FROM students
                ${filterQuery}) AS total`;
        }

        query = `SELECT students.*, ${totalQuery} FROM students
            ${filterQuery} GROUP BY students.id LIMIT $1 OFFSET $2`;

        db.query(query, [limit, offset], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    }
};