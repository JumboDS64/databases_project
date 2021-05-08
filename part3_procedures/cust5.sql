drop procedure Cust_SearchFlights;
delimiter //
create procedure Cust_SearchFlights(token varchar(30), email varchar(60), deploc varchar(60), depdate_string varchar(60), arrloc varchar(60), arrdate_string varchar(60))
begin
    DECLARE vemail varchar(60);
    SELECT email INTO vemail;
	CALL CheckForSession_Cust(token, vemail);
    IF (vemail IS NOT NULL) THEN
		SELECT *
		FROM flight
		WHERE flight.dep_airport_name = deploc
			AND flight.dep_datetime = timestamp(depdate_string)
			AND flight.arr_airport_name = arrloc
			AND flight.arr_datetime = timestamp(arrdate_string);
	END IF;
end //
delimiter ;