drop procedure Staf_GetTopCustomers;
delimiter //
create procedure Staf_GetTopCustomers(token varchar(30), username varchar(60))
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
		SELECT customer.name, customer.email, COUNT(*) as sum_tickets
			FROM ticket
            LEFT JOIN customer
				ON customer.email = ticket.customer_email
			LEFT JOIN flight
			ON flight.flight_num = ticket.flight_num
				AND flight.airline_name = ticket.airline_name
				AND flight.dep_datetime = ticket.dep_datetime
			WHERE ticket.airline_name = myAirline
				AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -1 YEAR)
            GROUP BY customer.email
            ORDER BY sum_tickets DESC
            LIMIT 5;
	END IF;
end //
delimiter ;