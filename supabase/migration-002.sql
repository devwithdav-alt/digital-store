alter table products add column if not exists best_seller boolean not null default false;
alter table products add column if not exists bundle_eligible boolean not null default false;
alter table products add column if not exists deal boolean not null default false;
update products set best_seller=true, bundle_eligible=true where featured;
insert into settings(key,value) values
('brands','[{"name":"Apple","logo":""},{"name":"Samsung","logo":""},{"name":"Sony","logo":""},{"name":"Dell","logo":""},{"name":"Logitech","logo":""},{"name":"DJI","logo":""},{"name":"Huawei","logo":""},{"name":"Lenovo","logo":""}]'),
('delivery','{"free_over":500,"fee":30}'),
('bundle','{"pct":30,"count":3}') on conflict (key) do nothing;
insert into pickup_locations(name,address,hours) select 'Accra Main Store','Accra, Ghana','Daily 9am to 7pm' where not exists(select 1 from pickup_locations);
