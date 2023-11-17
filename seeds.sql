INSERT INTO department (name)
VALUES
        ("Operations"),
        ("Engineering"),
        ("Finance"),
        ("Sales"),
        ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
        ("Operations Manager", 120000, 1),
        ("Operations Lead", 100000, 1),
        ("Engineering Manager", 120000, 2),
        ("Engineering Lead", 100000, 2),
        ("Engineer", 80000, 2),
        ("Finance Manager", 120000, 3),
        ("Finance Lead", 100000, 3),
        ("Accountant", 80000, 3),
        ("Sales Manager", 75000, 4),
        ("Sales Lead", 70000, 4),
        ("Salesperson", 65000, 4),
        ("Legal Manager", 110000, 5),
        ("Lawyer", 95000, 5),
        ("Paralegal", 65000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
        ("Tillie", "Hardy",  1, NULL),
        ("Jacob", "Black",  2, 1),
        ("Lawrence", "Anderson",  3, NULL), 
        ("Antony", "Doe",  4, 3), 
        ("Morgan", "Foster",  5, 3),
        ("Lindsay", "Wallace",  6, NULL), 
        ("Bruce", "Brown",  7, 6), 
        ("Derek", "Kormly",  8, 6), 
        ("Logan", "Smith",  9, NULL), 
        ("Tamerah", "Johnson",  10, 9), 
        ("Jaclyn", "Gerdy",  11, 9), 
        ("Talon", "Krenshaw",  12, NULL),
        ("Tina", "Swinton",  13, 12), 
        ("Joshua", "Bruster",  14, 12);
