  
create TABLE usertable(
    id SERIAL PRIMARY KEY,
    tele_id INTEGER UNIQUE,
    first_name VARCHAR,
    user_age INTEGER,
    username VARCHAR,
    user_location VARCHAR,
    user_description VARCHAR,
    sex VARCHAR,
    preferences VARCHAR
);

create TABLE user_candidates(
    another_user_id INTEGER UNIQUE,
    checked BOOLEAN DEFAULT false, 
    tele_id INTEGER,
    FOREIGN KEY (tele_id)
    REFERENCES usertable (tele_id)
    ON DELETE CASCADE,
    FOREIGN KEY (another_user_id)
    REFERENCES usertable (tele_id)
    ON DELETE CASCADE
);

