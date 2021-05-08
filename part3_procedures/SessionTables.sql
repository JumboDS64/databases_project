drop table customer_session;
create table customer_session (
	token varchar(30),
	customer_email varchar(60),
	primary key (customer_email),
	foreign key (customer_email) references customer(email)
);
drop table booking_agent_session;
create table booking_agent_session (
	token varchar(30),
	booking_agent_ID varchar(8),
	primary key (booking_agent_ID),
	foreign key (booking_agent_ID) references booking_agent(booking_agent_ID)
);
drop table airline_staff_session;
create table airline_staff_session (
	token varchar(30),
	airline_staff_username varchar(60),
	primary key (airline_staff_username),
	foreign key (airline_staff_username) references airline_staff(username)
);
