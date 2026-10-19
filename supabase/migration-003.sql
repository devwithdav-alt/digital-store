update products p set images=array['/products/'||c.slug||'.svg'] from categories c where c.id=p.category_id and (p.images is null or p.images='{}');
update categories set image_url='/products/'||slug||'.svg' where image_url is null;
insert into settings(key,value) values
('hero','[{"title":"Wireless Headphone","text":"Immersive sound with active noise cancelling.","cta":"Explore now","href":"/shop?category=headphone","image":"/hero/hero-1.svg"},{"title":"Smart Watches","text":"Track more. Charge less.","cta":"Shop watches","href":"/shop?category=watch","image":"/hero/hero-2.svg"},{"title":"Gaming Laptops","text":"Stronger and faster for every game.","cta":"Shop laptops","href":"/shop?category=laptop","image":"/hero/hero-3.svg"}]'),
('showcase','{"category":"phones","title":"Xiaomi Redmi Note","sub":"Starting at GH₵1,200","bg":"linear-gradient(160deg,#020520,#0066CC)","image":"/hero/showcase.svg"}'),
('feature','{"big":"Stronger & Faster","specs":["Intel Core Ultra 9 275HX","NVIDIA RTX 5070 Ti 12GB GDDR7","32GB DDR5 6400","1TB NVMe SSD Gen4"],"image":"/hero/feature.svg","video":""}')
on conflict (key) do update set value=excluded.value;
