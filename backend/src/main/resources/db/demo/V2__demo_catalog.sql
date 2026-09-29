-- Catalogue de démonstration. À supprimer ou modifier depuis le backoffice.

insert into collections (slug, name, season, tagline, description, motif, tone, featured, position, published, created_at, updated_at) values
('harmattan', 'Harmattan', 'Automne-Hiver 2026', 'Le vent sec, la lumière dorée, les silhouettes amples.',
 'Douze silhouettes taillées dans le bazin riche et le coton tissé main, aux teintes de latérite et d''indigo profond.', 'bazin', 'henne', true, 1, true, current_timestamp, current_timestamp),
('fleuve', 'Fleuve', 'Printemps-Été 2026', 'Indigo profond, lin léger, lignes fluides.',
 'Une collection pensée pour la chaleur : lin, voile de coton et bleu indigo, des coupes légères pour les journées d''été.', 'indigo', 'indigo', false, 2, true, current_timestamp, current_timestamp),
('ceremonie', 'Cérémonie', 'Capsule Tabaski', 'Les grands boubous brodés pour les jours de fête.',
 'Grands boubous, kaftans brodés et ensembles trois pièces, avec finitions sur mesure.', 'bogolan', 'nuit', false, 3, true, current_timestamp, current_timestamp);

insert into products (slug, name, collection_id, category, gender, price, old_price, fabric, description, motif, tone, badge, bestseller, status, stock, created_at, updated_at) values
('grand-boubou-laterite', 'Grand boubou Latérite', (select id from collections where slug = 'harmattan'), 'BOUBOUS', 'FEMME', 95000, null,
 'Bazin riche getzner, broderie ton sur ton', 'Grand boubou ample, broderie ton sur ton à l''encolure.', 'bazin', 'henne', 'Nouveau', true, 'PUBLISHED', 6, current_timestamp, current_timestamp),
('kaftan-nuit-de-dakar', 'Kaftan Nuit de Dakar', (select id from collections where slug = 'ceremonie'), 'KAFTANS', 'HOMME', 66000, 78000,
 'Popeline de coton, broderie main au col', 'Kaftan droit, col brodé à la main.', 'bogolan', 'nuit', null, true, 'PUBLISHED', 9, current_timestamp, current_timestamp),
('ensemble-fleuve', 'Ensemble Fleuve', (select id from collections where slug = 'fleuve'), 'ENSEMBLES', 'FEMME', 62000, null,
 'Lin lavé teint à l''indigo', 'Tunique et pantalon large en lin indigo.', 'indigo', 'indigo', 'Dernières pièces', false, 'PUBLISHED', 2, current_timestamp, current_timestamp),
('veste-bogolan', 'Veste Bogolan', (select id from collections where slug = 'harmattan'), 'VESTES', 'MIXTE', 54000, null,
 'Bogolan tissé main, doublure coton', 'Veste croisée en bogolan, doublée coton.', 'bogolan', 'mil', 'Pièce unique', true, 'PUBLISHED', 1, current_timestamp, current_timestamp),
('robe-tiaya', 'Robe Tiaya', (select id from collections where slug = 'fleuve'), 'ROBES', 'FEMME', 48000, null,
 'Voile de coton, plissé main', 'Robe longue plissée, taille nouée.', 'tissage', 'sable', 'Nouveau', false, 'PUBLISHED', 11, current_timestamp, current_timestamp),
('boubou-ndiaga', 'Boubou Ndiaga trois pièces', (select id from collections where slug = 'ceremonie'), 'BOUBOUS', 'HOMME', 120000, null,
 'Bazin riche, broderie fil de soie', 'Ensemble trois pièces pour les cérémonies.', 'bazin', 'sable', null, false, 'DRAFT', 4, current_timestamp, current_timestamp),
('sac-tanneur', 'Sac Tanneur', (select id from collections where slug = 'harmattan'), 'ACCESSOIRES', 'MIXTE', 29000, 35000,
 'Cuir tanné végétal, anse en wax', 'Cabas en cuir tanné végétal.', 'wax', 'henne', null, true, 'PUBLISHED', 7, current_timestamp, current_timestamp),
('robe-wax-plissee', 'Robe wax plissée', (select id from collections where slug = 'fleuve'), 'ROBES', 'FEMME', 36000, 42000,
 'Wax hollandais, ceinture nouée', 'Robe mi-longue plissée en wax.', 'wax', 'mil', null, false, 'PUBLISHED', 0, current_timestamp, current_timestamp),
('foulard-indigo', 'Foulard Indigo', (select id from collections where slug = 'fleuve'), 'ACCESSOIRES', 'MIXTE', 18000, null,
 'Voile de coton teint à l''indigo', 'Grand foulard léger.', 'indigo', 'indigo', 'Nouveau', false, 'PUBLISHED', 15, current_timestamp, current_timestamp);

insert into product_sizes (product_id, position, size)
select p.id, s.position, s.size from products p
join (values
  ('grand-boubou-laterite', 0, 'S'), ('grand-boubou-laterite', 1, 'M'), ('grand-boubou-laterite', 2, 'L'), ('grand-boubou-laterite', 3, 'XL'), ('grand-boubou-laterite', 4, 'Sur mesure'),
  ('kaftan-nuit-de-dakar', 0, 'M'), ('kaftan-nuit-de-dakar', 1, 'L'), ('kaftan-nuit-de-dakar', 2, 'XL'), ('kaftan-nuit-de-dakar', 3, 'XXL'), ('kaftan-nuit-de-dakar', 4, 'Sur mesure'),
  ('ensemble-fleuve', 0, 'XS'), ('ensemble-fleuve', 1, 'S'), ('ensemble-fleuve', 2, 'M'), ('ensemble-fleuve', 3, 'L'),
  ('veste-bogolan', 0, 'S'), ('veste-bogolan', 1, 'M'), ('veste-bogolan', 2, 'L'), ('veste-bogolan', 3, 'XL'),
  ('robe-tiaya', 0, 'XS'), ('robe-tiaya', 1, 'S'), ('robe-tiaya', 2, 'M'), ('robe-tiaya', 3, 'L'), ('robe-tiaya', 4, 'XL'),
  ('boubou-ndiaga', 0, 'M'), ('boubou-ndiaga', 1, 'L'), ('boubou-ndiaga', 2, 'XL'), ('boubou-ndiaga', 3, 'XXL'), ('boubou-ndiaga', 4, 'Sur mesure'),
  ('sac-tanneur', 0, 'Unique'),
  ('robe-wax-plissee', 0, 'S'), ('robe-wax-plissee', 1, 'M'), ('robe-wax-plissee', 2, 'L'),
  ('foulard-indigo', 0, 'Unique')
) as s(slug, position, size) on s.slug = p.slug;

insert into product_colors (product_id, position, name, hex)
select p.id, c.position, c.name, c.hex from products p
join (values
  ('grand-boubou-laterite', 0, 'Latérite', '#A4532A'), ('grand-boubou-laterite', 1, 'Indigo', '#27336A'),
  ('kaftan-nuit-de-dakar', 0, 'Nuit', '#1C1B26'), ('kaftan-nuit-de-dakar', 1, 'Ivoire', '#E8DCC6'),
  ('ensemble-fleuve', 0, 'Indigo', '#27336A'),
  ('veste-bogolan', 0, 'Terre', '#6B4A2E'),
  ('robe-tiaya', 0, 'Sable', '#CDB892'), ('robe-tiaya', 1, 'Indigo', '#27336A'),
  ('boubou-ndiaga', 0, 'Ivoire', '#E8DCC6'),
  ('sac-tanneur', 0, 'Cognac', '#8A4B24'),
  ('robe-wax-plissee', 0, 'Ocre', '#C08A2E'),
  ('foulard-indigo', 0, 'Indigo', '#27336A')
) as c(slug, position, name, hex) on c.slug = p.slug;
