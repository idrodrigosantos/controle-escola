// Utils
const { date } = require('../../lib/utils');

// Importa a conexação com o banco de dados
const db = require('../../config/db');

module.exports = {
    // Seleciona todos os professores
    all(callback) {
        db.query('SELECT * FROM teachers ORDER BY id ASC', function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Cadastra professor
    create(data, callback) {
        const query = `
            INSERT INTO teachers(
                avatar_url,
                name,
                birth_date,
                education_level,
                class_type,
                subjects_taught,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            date(Date.now()).iso
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    // Encontra um professor
    find(id, callback) {
        db.query('SELECT * FROM teachers WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows[0]);
        });
    },
    findBy(filter, callback) {
        db.query(`SELECT * FROM teachers WHERE teachers.name ILIKE '%${filter}%'
            OR teachers.subjects_taught ILIKE '%${filter}%'
            ORDER BY name ASC`, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    },
    // Atualiza os dados do professor
    update(data, callback) {
        const query = `
            UPDATE teachers SET
            avatar_url=($1),
            name=($2),
            birth_date=($3),
            education_level=($4),
            class_type=($5),
            subjects_taught=($6)
            WHERE id = $7
        `;

        const values = [
            data.avatar_url,
            data.name,
            date(data.birth_date).iso,
            data.education_level,
            data.class_type,
            data.subjects_taught,
            data.id
        ];

        db.query(query, values, function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback();
        });
    },
    // Deleta professor
    delete(id, callback) {
        db.query('DELETE FROM teachers WHERE id = $1', [id], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            return callback();
        });
    },
    // Paginação
    paginate(params) {
        const { filter, limit, offset, callback } = params;

        let query = '',
            filterQuery = '',
            totalQuery = '(SELECT COUNT(*) FROM teachers) AS total';

        if (filter) {
            filterQuery = `WHERE teachers.name ILIKE '%${filter}%'
                OR teachers.subjects_taught ILIKE '%${filter}%'`;

            totalQuery = `(SELECT COUNT(*) FROM teachers
                ${filterQuery}) AS total`;
        }

        query = `SELECT teachers.*, ${totalQuery} FROM teachers
            ${filterQuery} GROUP BY teachers.id LIMIT $1 OFFSET $2`;

        db.query(query, [limit, offset], function (err, results) {
            if (err) {
                throw `Database Error! ${err}`;
            }

            callback(results.rows);
        });
    }
};