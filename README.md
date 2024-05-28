# Review service for VideoGames app
This is a node js project using typescript, consul, express, mongoose, mocha to create reviews for videogames app, it required [this](https://github.com/olivertate9/VideoGames) app to run, cause it accesses endpoints to check existence of videogame.

## Running the Application

### Prerequisites

- Docker Engine or Docker Desktop running

### Steps to Run

1. **Clone the Repository and setup**

   ```bash
   git clone https://github.com/olivertate9/videogames-reviews.git
   npm install

2. **Run docker-compose from docker-compose.yml in IDE or in CLI**
   ```bash
   docker-compose up

3. **Build the Application**

   ```bash
   npm run build

4. **Run the Application**
   
   ```bash
   npm run start

5. **Run for tests**

   ```bash
   npm run test

6. **Run for coverage**

   ```bash
   npm run coverage

7. **Run for development**

   ```bash
   npm run dev
