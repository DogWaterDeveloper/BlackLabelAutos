-- Seed the initial inventory: the 22 vehicles currently listed on the Inventory page.
-- Re-running is a no-op: existing rows are matched on their unique slug and left untouched.
INSERT INTO "vehicles" ("slug", "name", "make", "category", "image", "price", "year", "miles", "engine", "seats", "status", "stock_hp", "potential_hp", "stock_speed", "potential_speed", "stock_rating", "potential_rating", "stock_accel", "potential_accel", "stock_grip", "potential_grip", "stock_platform", "potential_platform", "stock_braking", "potential_braking") VALUES
	('turismo-omaggio', 'Grotti Turismo Omaggio', 'grotti', 'super', 'turismo-omaggio.png', 425833, 2022, 4954, 'V8', 2, 'not-imported', 541, 645, 153, 165, 782, 922, 68, 90, 85, 94, 73, 87, 79, 87),
	('banshee-gts', 'Bravado Banshee GTS', 'bravado', 'super', 'banshee-gts.png', 402500, 2015, 9653, 'V10', 2, 'not-imported', 502, 788, 148, 170, 610, 973, 66, 100, 42, 100, 60, 87, 37, 87),
	('infernus', 'Pegassi Infernus', 'pegassi', 'super', 'infernus.png', 401400, 2005, 14642, 'V12', 2, 'not-imported', 547, 674, 148, 162, 635, 908, 67, 90, 58, 91, 60, 87, 30, 87),
	('tempesta-spyder', 'Pegassi Tempesta Spyder', 'pegassi', 'super', 'tempesta-spyder.png', 388312, 2020, 9170, 'V10', 2, 'not-imported', 553, 861, 145, 170, 682, 993, 69, 100, 61, 96, 55, 100, 52, 100),
	('itali-gto', 'Grotti Itali GTO', 'grotti', 'super', 'itali-gto.png', 366465, 2022, 8168, 'V12', 2, 'not-imported', 576, 650, 157, 162, 683, 908, 83, 90, 46, 91, 67, 87, 37, 87),
	('10f-widebody', 'Obey 10F Widebody', 'obey', 'sports', '10f-widebody.png', 363593, 2018, 6311, 'V10', 2, 'not-imported', 514, 642, 148, 163, 685, 908, 65, 90, 70, 91, 70, 87, 50, 87),
	('zorrusso', 'Pegassi Zorrusso', 'pegassi', 'super', 'zorrusso.png', 362250, 2018, 4914, 'V10', 2, 'not-imported', 575, 809, 151, 164, 697, 973, 84, 100, 45, 100, 67, 87, 43, 87),
	('corsita', 'Lampadati Corsita', 'lampadati', 'sports', 'corsita.png', 352100, 2023, 681, 'V6', 2, 'not-imported', 533, 821, 151, 170, 642, 973, 72, 100, 43, 100, 67, 87, 43, 87),
	('reaper', 'Pegassi Reaper', 'pegassi', 'super', 'reaper.png', 345000, 2016, 11673, 'V10', 2, 'not-imported', 468, 662, 144, 162, 594, 966, 73, 100, 32, 100, 57, 87, 33, 87),
	('banshee-900r', 'Bravado Banshee 900R', 'bravado', 'super', 'banshee-900r.png', 330093, 1999, 10344, 'V10', 2, 'not-imported', 412, 547, 145, 162, 634, 908, 61, 90, 62, 91, 60, 87, 44, 87),
	('tempesta-fuoristrada', 'Pegassi Tempesta Fuoristrada', 'pegassi', 'super', 'tempesta-fuoristrada.png', 323872, 2024, 1761, 'V10', 2, 'not-imported', 563, 891, 144, 170, 668, 993, 67, 100, 60, 96, 47, 100, 53, 100),
	('schlagen-sp', 'Benefactor Schlagen SP', 'benefactor', 'sports', 'schlagen-sp.png', 305965, 2019, 8287, 'V8', 2, 'not-imported', 448, 612, 147, 162, 580, 908, 67, 90, 31, 91, 67, 87, 37, 87),
	('nexus-rr', 'Dinka Nexus RR', 'dinka', 'sports', 'nexus-rr.png', 302662, 2024, 3154, 'V6', 2, 'not-imported', 528, 915, 140, 170, 678, 993, 60, 100, 66, 96, 80, 100, 53, 100),
	('tempesta', 'Pegassi Tempesta', 'pegassi', 'super', 'tempesta.png', 299588, 2017, 8843, 'V10', 2, 'not-imported', 553, 861, 145, 170, 682, 993, 69, 100, 61, 96, 55, 100, 52, 100),
	('sentinel-xs', 'Ubermacht Sentinel XS', 'ubermacht', 'sports', 'sentinel-xs.png', 292500, 2018, 11921, 'V6', 2, 'not-imported', 319, 554, 131, 161, 489, 908, 40, 90, 48, 91, 53, 87, 30, 87),
	('vacca', 'Pegassi Vacca', 'pegassi', 'super', 'vacca.png', 290625, 2012, 8543, 'V10', 2, 'not-imported', 568, 709, 147, 162, 647, 872, 77, 100, 36, 53, 70, 87, 37, 87),
	('tachyon', 'Hijak Tachyon', 'hijak', 'sports', 'tachyon.png', 245625, 1993, 9654, 'V6', 2, 'not-imported', 561, 810, 152, 170, 579, 1000, 72, 100, 15, 100, 52, 100, 41, 100),
	('10f-cabrio', 'Obey 10F Cabrio', 'obey', 'sports', '10f-cabrio.png', 245625, 2022, 1234, 'V6', 2, 'not-imported', 568, 709, 147, 162, 647, 948, 77, 100, 36, 91, 70, 87, 37, 87),
	('schlagen-roadster', 'Benefactor Schlagen Roadster', 'benefactor', 'sports', 'schlagen-roadster.png', 225301, 2019, 7892, 'V8', 2, 'not-imported', 449, 814, 145, 170, 556, 1000, 63, 100, 31, 100, 66, 100, 30, 100),
	('solace-vitesse', 'Dewbauchee Solace Vitesse', 'dewbauchee', 'sports', 'solace-vitesse.png', 218750, 2017, 12456, 'V8', 2, 'not-imported', 449, 814, 145, 170, 608, 1000, 63, 100, 31, 100, 66, 100, 30, 100),
	('vacca-low', 'Pegassi Vacca', 'pegassi', 'super', 'vacca-low.png', 211850, 2012, 8543, 'V10', 2, 'not-imported', 534, 656, 148, 163, 608, 911, 65, 90, 34, 91, 60, 87, 50, 87),
	('schlagen-gt', 'Benefactor Schlagen GT', 'benefactor', 'sports', 'schlagen-gt.png', 211850, 2019, 7892, 'V8', 2, 'not-imported', 627, 662, 159, 163, 668, 915, 83, 90, 35, 91, 65, 87, 23, 87)
ON CONFLICT ("slug") DO NOTHING;
