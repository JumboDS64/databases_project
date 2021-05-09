drop procedure Staf_GetCustomers;
delimiter //
create procedure Staf_GetCustomers(token varchar(30), username varchar(60))
begin
    DECLARE vusername varchar(60);
    DECLARE myAirline varchar(60);
    SELECT username INTO vusername;
	CALL CheckForSession_Staf(token, vusername);
    IF (vusername IS NOT NULL) THEN
		SELECT airline_staff.airline_name
			FROM airline_staff
            WHERE airline_staff.username = username
            INTO myAirline;
		SELECT customer.name, customer.email
			FROM ticket
            LEFT JOIN customer
				ON customer.email = ticket.customer_email
			WHERE ticket.airline_name = myAirline
            GROUP BY customer.email;
	END IF;
end //
delimiter ;