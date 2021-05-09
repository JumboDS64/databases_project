drop procedure Register_AirlineStaff;
delimiter //
create procedure Register_AirlineStaff(username varchar(60), airline_name varchar(60), password varchar(60), first_name varchar(60), last_name varchar(60), date_of_birth_string varchar(60))
begin
	INSERT
		INTO airline_staff
        VALUES (username, airline_name, md5(password), first_name, last_name, timestamp(date_of_birth));
end //
delimiter ;