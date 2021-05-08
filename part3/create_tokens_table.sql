create table session_token (
	token varchar(30),
	expiration datetime,
	primary key (token)
);
create table customer_session (
	token varchar(30),
	customer_email varchar(60),
	entered_password varchar(60),
	primary key (customer_email),
	foreign key (customer_email) references customer(email)
);
create table booking_agent_session (
	token varchar(30),
	booking_agent_ID varchar(8),
	entered_password varchar(60),
	primary key (booking_agent_ID),
	foreign key (booking_agent_ID) references booking_agent(booking_agent_ID)
);
create table airline_staff_session (
	token varchar(30),
	airline_staff_username varchar(60),
	entered_password varchar(60),
	primary key (airline_staff_username),
	foreign key (airline_staff_username) references airline_staff(username)
);

create table review (
	ticket_ID varchar(8),
	customer_email varchar(60),
	publish_date datetime,
	stars numeric(1,0),
	comment varchar(280),
	primary key(ticket_ID, customer_email),
	foreign key (ticket_ID) references ticket(ticket_ID),
	foreign key (customer_email) references customer(email)
);

delimiter //
create procedure CreateToken(id varchar(30), endtime datetime)
begin
	insert into session_token values (id, endtime);
	select id;
end //
delimiter ;

delimiter //
create procedure EnsureTokenValidity(id varchar(30))
begin
	DECLARE token_exists BIT;
	DECLARE token_valid BIT;
	SELECT *
		FROM session_token
		WHERE token = id
        INTO token_exists;
	SELECT *
		FROM session_token
		WHERE token = id
		AND expiration > current_timestamp()
        INTO token_valid;
	IF token_exists IS NOT NULL AND token_valid IS NULL THEN
		DELETE FROM session_token WHERE token = id;
	END IF;
	SELECT token_valid;
end //
delimiter ;


