drop procedure Staf_GetRevenue;
delimiter //
create procedure Staf_GetRevenue(token varchar(30), username varchar(60), startdate_string varchar(60), enddate_string varchar(60)) -- deprecated, is included with Staf_GetRevenue_ByMonth now
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
            SELECT SUM(flight.base_price) as rev
				FROM ticket
				LEFT JOIN flight
				ON ticket.flight_num = flight.flight_num
					AND ticket.airline_name = flight.airline_name
					AND ticket.dep_datetime = flight.dep_datetime
				WHERE ticket.airline_name = myAirline
					AND ticket.sold_date > timestamp(startdate_string)
					AND ticket.sold_date <= timestamp(enddate_string);
	END IF;
end //
delimiter ;