drop procedure Agen_TrackSpending;
delimiter //
create procedure Agen_TrackSpending(token varchar(30), id varchar(8), startdate_string varchar(60), enddate_string varchar(60))
begin
    DECLARE vid varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT DATE_FORMAT(ticket.sold_date, '%Y-%m') as mon, SUM(flight.base_price / 5) as rev -- let's assume agents earn 20% commision for every ticket they purchase
		FROM ticket
		LEFT JOIN flight
		ON ticket.flight_num = flight.flight_num
			AND ticket.airline_name = flight.airline_name
			AND ticket.dep_datetime = flight.dep_datetime
		WHERE ticket.booking_agent_ID = id
		GROUP BY mon;
	END IF;
end //
delimiter ;