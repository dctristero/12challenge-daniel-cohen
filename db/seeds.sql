INSERT INTO fiefdoms(manor_name)
VALUES   ("Musk Manor"),
         ("Odor Manor"),
         ("Stink-Stench Manor");

INSERT INTO classes(class)
VALUES   ("Freeman"),
         ("Vassal"),
         ("Serf");

INSERT INTO subjects(last_name, first_name, class_id, debt, fiefdom_id, vassal_id)
VALUES   ("Musk", "Lord", 2, null, 1, null),
         ("Odor", "Lord", 2, null, 2, null),
         ("Stink-Stench", "Lord", 2, null, 3, null),
         ("Jerk", "Lucky", 1, null, null, null),
         ("Leper", "Saddest", 3, 4000, 1, 1),
         ("Guy", "Dying", 3, 6000, 1, 1),
         ("Teeth", "No", 3, 5000, 2, 2),
         ("Child", "Hungry", 3, 9000, 2, 2),
         ("Millennial", "Elderly", 3, 15000, 3, 3),
         ("Peasant", "Hopeless", 3, 496000000, 3, 3);