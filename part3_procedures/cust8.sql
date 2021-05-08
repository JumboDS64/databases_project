drop procedure Cust_TrackSpending;
delimiter //
create procedure Cust_TrackSpending(token varchar(30), email varchar(60), startdate_string varchar(60), enddate_string varchar(60))
begin
    DECLARE vemail varchar(60);
    SELECT email INTO vemail;
	CALL CheckForSession_Cust(token, vemail);
    IF (vemail IS NOT NULL) THEN
		SELECT DATE_FORMAT(ticket.sold_date, '%Y-%m'), SUM(flight.base_price)
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		WHERE ticket.customer_email = email
			AND ticket.sold_date >= timestamp(startdate_string)
			AND ticket.sold_date < timestamp(enddate_string)
		GROUP BY DATE_FORMAT(ticket.sold_date, '%Y-%m');
	END IF;
end //
delimiter ;