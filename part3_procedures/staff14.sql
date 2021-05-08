SELECT airport.city, count(ticket.ticket_ID) AS tix
FROM ticket
LEFT JOIN flight
ON ticket.flight_num = flight.flight_num
	AND ticket.airline_name = flight.airline_name
    AND ticket.dep_datetime = flight.dep_datetime
LEFT JOIN airport
ON airport.name = flight.arr_airport_name
GROUP BY airport.city
