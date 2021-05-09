drop procedure Register_Customer;
delimiter //
create procedure Register_Customer(name varchar(60), email varchar(60), password varchar(60), building_number numeric(6,0), street varchar(60), city varchar(60), state varchar(60), phone_number varchar(30), date_of_birth_string varchar(60))
begin
	DECLARE addrid varchar(8);
    SELECT SUBSTRING(MD5(RAND()) FROM 1 FOR 8) INTO addrid;
    INSERT
		INTO address
        VALUES (addrid, building_number, street, city, state);
	INSERT
		INTO customer
        VALUES (name, email, md5(password), addrid, phone_number, timestamp(date_of_birth));
end //
delimiter ;