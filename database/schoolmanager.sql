CREATE DATABASE schoolmanager;

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    avatar_url text NOT NULL,
    name text NOT NULL,
    birth timestamp without time zone NOT NULL,
    email text NOT NULL,
    school_year text NOT NULL,
    workload integer NOT NULL,
    teacher_id integer
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    avatar_url text NOT NULL,
    name text NOT NULL,
    birth_date timestamp without time zone NOT NULL,
    education_level text NOT NULL,
    class_type text NOT NULL,
    subjects_taught text NOT NULL,
    created_at timestamp without time zone NOT NULL
);

INSERT INTO students (avatar_url, name, birth, email, school_year, workload, teacher_id) VALUES
('https://source.unsplash.com/83tkHLPgg2Q', 'José Silva', '2008-02-20 00:00:00', 'joaosilva@email.com', '6EF', 120, 3),
('https://source.unsplash.com/GX8KBbVmC6c', 'Maria Almeida', '2003-05-20 00:00:00', 'mariaalmeida@email.com', '3EM', 50, 5),
('https://source.unsplash.com/DKViOG1pVTM', 'Roberta Campos', '2006-05-10 00:00:00', 'robertacampos@email.com', '8EF', 50, 3),
('https://source.unsplash.com/ORDz1m1-q0I', 'Vitor Martins', '2009-10-10 00:00:00', 'vitormartins@email.com', '5EF', 80, 2),
('https://source.unsplash.com/6RTM8EsD1T8', 'Nicole Lima', '2006-05-20 00:00:00', 'mariaalmeida@email.com', '9EF', 90, 1);

INSERT INTO teachers (avatar_url, name, birth_date, education_level, class_type, subjects_taught, created_at) VALUES
('https://source.unsplash.com/7JGjoSVfIDM', 'Maria Silva', '1985-03-10 00:00:00', 'doutorado', 'P', 'Física', '2020-06-19 00:00:00'),
('https://source.unsplash.com/--kQ4tBklJI', 'João Almeida', '1990-09-20 00:00:00', 'superior', 'D', 'Matemática, Português', '2020-06-19 00:00:00'),
('https://source.unsplash.com/xHaZ5BW9AY0', 'Gabriela Azevedo', '1993-06-04 00:00:00', 'mestrado', 'P', 'Química', '2020-06-19 00:00:00'),
('https://source.unsplash.com/IrQZkyhdOow', 'José Sales', '1980-05-20 00:00:00', 'doutorado', 'D', 'Geografia, História', '2020-06-19 00:00:00'),
('https://source.unsplash.com/UFG04g43hqs', 'Thais Nascimento', '1991-06-20 00:00:00', 'superior', 'D', 'Administração', '2020-06-19 00:00:00');