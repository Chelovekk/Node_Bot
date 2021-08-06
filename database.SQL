  
create TABLE usertable(
    id SERIAL PRIMARY KEY,
    tele_id INTEGER ,
    first_name VARCHAR,
    user_age INTEGER,
    username VARCHAR,
    user_location VARCHAR,
    user_description VARCHAR
);


create TABLE achievement(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);
create TABLE achievementgoals(
    goal INTEGER,
    ach_id INTEGER,
    FOREIGN KEY (ach_id) 
    REFERENCES achievement (id)
    ON DELETE CASCADE
);


create TABLE user_achievement_progress(
    completed BOOLEAN DEFAULT false,
    progress INTEGER,
    user_id INTEGER,
    FOREIGN KEY (user_id) 
    REFERENCES usertable (id)
    ON DELETE CASCADE,
    ach_id INTEGER,
    FOREIGN KEY (ach_id) 
    REFERENCES achievement (id)  
    ON DELETE CASCADE
);