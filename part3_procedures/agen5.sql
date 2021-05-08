drop procedure Agen_SearchFlights;
delimiter //
create procedure Agen_SearchFlights(token varchar(30), id varchar(8), deploc varchar(60), depdate_string varchar(60), arrloc varchar(60), arrdate_string varchar(60))
begin
    DECLARE vid varchar(8);
    SELECT id INTO vid;
	CALL CheckForSession_Agen(token, vid);
    IF (vid IS NOT NULL) THEN
		SELECT *
		FROM flight
		WHERE flight.dep_airport_name = deploc
			AND flight.dep_datetime = timestamp(depdate_string)
			AND flight.arr_airport_name = arrloc
			AND flight.arr_datetime = timestamp(arrdate_string);
	END IF;
end //
delimiter ;