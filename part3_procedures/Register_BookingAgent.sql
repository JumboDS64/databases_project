drop procedure Register_BookingAgent;
delimiter //
create procedure Register_BookingAgent(email varchar(60), password varchar(60))
begin
	INSERT
		INTO booking_agent
        VALUES (email, md5(password));
end //
delimiter ;