SELECT SUM(flight.base_price)
FROM ticket
LEFT JOIN flight
ON ticket.flight_num = flight.flight_num
	AND ticket.airline_name = flight.airline_name
    AND ticket.dep_datetime = flight.dep_datetime
WHERE ticket.booking_agent_ID IS NOT NULL
	AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -30 DAY)
    AND ticket.sold_date <= current_timestamp();

SELECT SUM(flight.base_price)
FROM ticket
LEFT JOIN flight
ON ticket.flight_num = flight.flight_num
	AND ticket.airline_name = flight.airline_name
    AND ticket.dep_datetime = flight.dep_datetime
WHERE ticket.booking_agent_ID IS NULL
	AND ticket.sold_date > DATE_ADD(current_timestamp(), INTERVAL -30 DAY)
    AND ticket.sold_date <= current_timestamp();