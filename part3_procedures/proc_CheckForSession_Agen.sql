drop procedure CheckForSession_Agen;
delimiter //
create procedure CheckForSession_Agen(token varchar(30), inout id varchar(8))
begin
	DECLARE vtoken varchar(30);
    DECLARE vid varchar(8);
    SELECT token INTO vtoken;
    SELECT null INTO vid;
	CALL EnsureTokenValidity(vtoken);
    IF vtoken IS NOT NULL THEN
		SELECT booking_agent_session.booking_agent_ID
        FROM booking_agent_session
        WHERE booking_agent_session.token = vtoken
			AND booking_agent_session.booking_agent_ID = id
		INTO vid;
    END IF;
    SELECT vid INTO id;
end //
delimiter ;