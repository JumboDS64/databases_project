drop procedure CheckPw_Cust;
delimiter //
create procedure CheckPw_Cust(inout email varchar(60), pw varchar(60)) -- deprecated
begin
	SELECT customer.email
    FROM customer
    WHERE customer.email = email
		AND customer.password = pw
	INTO email;
end //
delimiter ;