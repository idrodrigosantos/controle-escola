module.exports = {
    age: function (timestamp) {
        const today = new Date();
        const birthDate = new Date(timestamp);

        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1;
        }

        return age;
    },
    date: function (timestamp) {
        const date = new Date(timestamp);

        // Ano
        const year = date.getUTCFullYear();

        // .slice(-2) pega os dois últimos dígitos de traz para frente
        // Quando for mês 02 pega o 02
        // Quando for mês 010 pega o 10

        // Mês - Mês começa em 0 e vai até 11, por isso o "+ 1"
        const month = `0${date.getUTCMonth() + 1}`.slice(-2);
        // Dia
        const day = `0${date.getUTCDate()}`.slice(-2);

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }
    },
    graduation: function (degree) {
        if (degree == 'medio') {
            return 'Ensino Médio Completo';
        } else if (degree == 'superior') {
            return 'Ensino Superior Completo';
        } else if (degree == 'mestrado') {
            return 'Mestrado';
        } else if (degree == 'doutorado') {
            return 'Doutorado';
        }
    },
    grade: function (school_year) {
        if (school_year == '5EF') {
            return '5º ano ensino fundamental';
        } else if (school_year == '6EF') {
            return '6º ano ensino fundamental';
        } else if (school_year == '7EF') {
            return '7º ano ensino fundamental';
        } else if (school_year == '8EF') {
            return '8º ano ensino fundamental';
        } else if (school_year == '9EF') {
            return '9º ano ensino fundamental';
        } else if (school_year == '1EM') {
            return '1º ano ensino médio';
        } else if (school_year == '2EM') {
            return '2º ano ensino médio';
        } else if (school_year == '3EM') {
            return '3º ano ensino médio';
        }
    }
};