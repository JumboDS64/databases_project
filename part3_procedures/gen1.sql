drop procedure Gen_SearchFlights;
delimiter //
create procedure Gen_SearchFlights(deploc varchar(60), arrloc varchar(60))
begin
	SELECT *
	FROM flight
	WHERE flight.dep_airport_name = deploc
		AND flight.arr_airport_name = arrloc;
end //
delimiter ;