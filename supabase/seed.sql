insert into categories(name,slug,sort) values('Phones','phones',1),('Camera','camera',2),('Laptop','laptop',3),('Headphone','headphone',4),('Keyboard','keyboard',5),('Game','game',6),('Watch','watch',7) on conflict do nothing;
insert into products(name,slug,category_id,brand,price,compare_price,stock,featured) select v.n,v.s,c.id,v.b,v.p,v.cp,v.st,true from (values
('Pro Triple Camera Smartphone','pro-phone','phones','Apple',5200,6200,14),('Compact Dual Camera Phone','compact-phone','phones','Samsung',2400,null,8),
('360 Action Camera','action-360','camera','DJI',2800,3400,6),('Handheld Cylindrical Camera','cyl-cam','camera','Sony',4100,null,3),
('Gaming Laptop RGB','gaming-laptop','laptop','Dell',9800,11500,5),('Slim Laptop 14','slim-14','laptop','Apple',7400,null,9),
('Studio Monitor Headphones','studio-hp','headphone','Sony',1800,2100,12),('Wireless Earbuds Pro','earbuds','headphone','Apple',2300,null,20),
('Mechanical Keyboard','mech-kb','keyboard','Logitech',650,780,15),('Classic Game Controller','controller','game','Sony',950,1200,2),
('Smartwatch Sport Edition','watch-sport','watch','Samsung',1500,1900,10),('Ultra Titanium Watch','watch-ultra','watch','Apple',4200,5300,4)
) as v(n,s,cs,b,p,cp,st) join categories c on c.slug=v.cs on conflict do nothing;
