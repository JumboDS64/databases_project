SELECT SUM(flight.base_price)
FROM ticket
LEFT JOIN flight
ON ticket.flight_num = flight.flight_num
	AND ticket.airline_name = flight.airline_name
    AND ticket.dep_datetime = flight.dep_datetime
WHERE ticket.sold_date > timestamp_a
    AND ticket.sold_date <= timestamp_b;