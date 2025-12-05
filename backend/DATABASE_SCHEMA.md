# Databázový model - Sporty MVP

## Tabulky

### USERS
```sql
- id: UUID (primary key)
- email: VARCHAR(255) UNIQUE NOT NULL
- password_hash: VARCHAR(255) NOT NULL
- name: VARCHAR(255) NOT NULL
- photo_url: VARCHAR(512) NULLABLE
- location: VARCHAR(255) NOT NULL
- language: VARCHAR(2) DEFAULT 'cs' ('cs' | 'en')
- no_shows: INTEGER DEFAULT 0
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
```

### SPORTS
```sql
- id: VARCHAR(50) PRIMARY KEY ('badminton', 'padel', 'squash')
- name: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
```

### VENUES
```sql
- id: UUID PRIMARY KEY
- name: VARCHAR(255) NOT NULL
- city: VARCHAR(255) NOT NULL
- created_at: TIMESTAMP DEFAULT NOW()
```

### VENUE_SPORTS (Many-to-Many)
```sql
- venue_id: UUID FOREIGN KEY -> VENUES
- sport_id: VARCHAR(50) FOREIGN KEY -> SPORTS
- PRIMARY KEY (venue_id, sport_id)
```

### EVENTS
```sql
- id: UUID PRIMARY KEY
- organizer_id: UUID FOREIGN KEY -> USERS NOT NULL
- sport_id: VARCHAR(50) FOREIGN KEY -> SPORTS NOT NULL
- venue_id: UUID FOREIGN KEY -> VENUES NULLABLE
- date: DATE NOT NULL
- time_start: TIME NOT NULL
- time_end: TIME NOT NULL
- place_name: VARCHAR(255) NOT NULL (flexibilní, může být jiné než venue)
- reservation_type: VARCHAR(20) NOT NULL ('reserved' | 'to_be_arranged')
- player_count_total: INTEGER NOT NULL CHECK (player_count_total > 0)
- skill_min: INTEGER NOT NULL CHECK (skill_min >= 1 AND skill_min <= 4)
- skill_max: INTEGER NOT NULL CHECK (skill_max >= 1 AND skill_max <= 4)
- description: TEXT NULLABLE
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
```

### EVENT_PLAYERS
```sql
- id: UUID PRIMARY KEY
- event_id: UUID FOREIGN KEY -> EVENTS NOT NULL
- user_id: UUID FOREIGN KEY -> USERS NOT NULL
- status: VARCHAR(20) NOT NULL ('confirmed' | 'waiting' | 'removed')
- waiting_position: INTEGER NULLABLE (pořadí ve frontě)
- created_at: TIMESTAMP DEFAULT NOW()
- UNIQUE (event_id, user_id) -- jeden uživatel může být na jednom eventu jen jednou
```

### EVENT_NO_SHOWS
```sql
- id: UUID PRIMARY KEY
- event_id: UUID FOREIGN KEY -> EVENTS NOT NULL
- user_id: UUID FOREIGN KEY -> USERS NOT NULL
- reported_by: UUID FOREIGN KEY -> USERS NOT NULL (organizátor)
- created_at: TIMESTAMP DEFAULT NOW()
- UNIQUE (event_id, user_id) -- jeden no-show na event
```

### CHAT_MESSAGES
```sql
- id: UUID PRIMARY KEY
- event_id: UUID FOREIGN KEY -> EVENTS NOT NULL
- user_id: UUID FOREIGN KEY -> USERS NOT NULL
- message: TEXT NOT NULL
- sent_at: TIMESTAMP DEFAULT NOW()
```

### USER_SPORTS (Many-to-Many)
```sql
- user_id: UUID FOREIGN KEY -> USERS
- sport_id: VARCHAR(50) FOREIGN KEY -> SPORTS
- skill_level: INTEGER CHECK (skill_level >= 1 AND skill_level <= 4)
- PRIMARY KEY (user_id, sport_id)
```

### USER_PUSH_TOKENS
```sql
- id: UUID PRIMARY KEY
- user_id: UUID FOREIGN KEY -> USERS NOT NULL
- device_token: VARCHAR(512) NOT NULL
- platform: VARCHAR(20) NOT NULL ('ios' | 'android' | 'web')
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()
- UNIQUE (user_id, device_token) -- jeden token na zařízení
```

## Indexy

```sql
CREATE INDEX idx_events_date ON EVENTS(date);
CREATE INDEX idx_events_organizer ON EVENTS(organizer_id);
CREATE INDEX idx_event_players_event ON EVENT_PLAYERS(event_id);
CREATE INDEX idx_event_players_user ON EVENT_PLAYERS(user_id);
CREATE INDEX idx_event_players_status ON EVENT_PLAYERS(status, waiting_position);
CREATE INDEX idx_chat_messages_event ON CHAT_MESSAGES(event_id, sent_at);
CREATE INDEX idx_user_push_tokens_user ON USER_PUSH_TOKENS(user_id);
```


