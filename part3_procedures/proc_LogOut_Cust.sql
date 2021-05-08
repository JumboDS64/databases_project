drop procedure LogOut;
delimiter //
create procedure LogOut(id varchar(30))
begin
	DELETE FROM customer_session WHERE token = id;
	DELETE FROM booking_agent_session WHERE token = id;
	DELETE FROM airline_staff_session WHERE token = id;
	DELETE FROM session_token WHERE token = id;
end //
delimiter ;