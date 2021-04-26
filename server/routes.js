var config = require('./db-config.js');
var mysql = require('mysql2');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  /*var query = `
    SELECT DISTINCT genre
    FROM Genres
  `;*/
  var query = `
    SELECT DISTINCT topic_keyword
    FROM meetings
    WHERE topic_keyword <> ''
    ORDER BY topic_keyword
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  /*var query = `
      SELECT genre, rating, vote_count, title
      FROM (
        SELECT *, ROW_NUMBER () OVER (partition BY G.genre  ORDER BY  M.rating DESC, M.vote_count DESC) AS genre_rank
        FROM Movies M JOIN Genres G ON M.id = G.movie_id ) Top10_Genre
      WHERE genre_rank <= 10 AND genre = '${req.params.genre}' ;
  `;*/

    var query = `
        SELECT s.speaker_country as country,  COUNT(DISTINCT m.id) as num_meetings,  COUNT(DISTINCT m.id, s.seq ) as num_speeches
        FROM  meetings m  join statements s on m.id = s.meeting_id
        WHERE m.topic_keyword <> '' and  s.speaker_country <> 'UN' and s.speaker_country <> 'S'  and s.speaker_country <> 'Unknown' and s.speaker_country <> 'World Bank' and m.topic_keyword = '${req.params.genre}'
        group by speaker_country
        ORDER BY COUNT(DISTINCT m.id) DESC,  speaker_country ASC;
  `;

  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {

  var query = `
      select sp.country, st.meeting_id as meeting_id, DATE_FORMAT(m.meeting_date, "%m-%d-%Y")  as meeting_date,  m.topic_keyword as topic_keyword
      FROM speakers sp join statements st on sp.name = st.speaker_name
        and sp.country = st.speaker_country join  meetings m on m.id = st.meeting_id
      WHERE sp.name = '${req.params.movieName}' and sp.country <> 'Unknown'
      ORDER BY sp.country, m.meeting_date DESC
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};

function getSpeakersList(req, res) {

  var query = `
      SELECT DISTINCT s.name
      FROM speakers s
      ORDER BY s.name
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};


function getSpeaker(req, res) {

  var query = `
      WITH male AS(
        SELECT COUNT(DISTINCT name) as num_male
        FROM speakers
        WHERE gender = 1 and country in (SELECT country FROM speakers WHERE name = '${req.params.movieName}' )
      ),
      country_stat as(
        SELECT (COUNT(DISTINCT s.name) -  m.num_male) AS num_Female,  (1- ROUND(m.num_male/COUNT(DISTINCT s.name),2)) Female_Perct
        FROM speakers s, male m
        WHERE country in (SELECT country FROM speakers WHERE name = '${req.params.movieName}')
      )
      SELECT DISTINCT s.name, s. country, (case when s.gender = 0 then 'Female' else 'Male' end) as gender , cs.Female_Perct as fem_perct
      FROM speakers s, country_stat cs
      WHERE name = '${req.params.movieName}'  and s.country <> 'Unknown'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

};



/* ---- (Best Genres) ---- */
function getDecades(req, res) {
	var query = `
      select DISTINCT (case when ptype = 10 then 'General Warfare'
                    when ptype = 20 then 'Inter-communal Warfare'
                    when ptype = 30 then 'Armed Battle and Clash'
                    when ptype = 31 then 'Armed Attack'
                    when ptype = 40 then 'Pro-Government Terrorism'
                    when ptype = 41 then 'Anti-Government Terrorism'
                    when ptype = 42 then 'Communal Terrorism'
                    when ptype = 50 then 'Organized Violent Riot'
                    when ptype = 51 then 'Spontaneous Violent Riot'
                    when ptype = 60 then 'Organized Demonstration'
                    when ptype = 61 then 'Pro-Government Demonstration'
                    when ptype = 62 then 'Spontaneous Demonstration'
                    else 'Other'
                  end) as conflict
      from conflict_events
      order by conflict
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {
      var query = `
          with conflict_country as(
              select s.speaker_country as country, COUNT(*) as conflict_speech
              from meetings m join statements s on m.id = s.meeting_id
              where m.topic_keyword  = 'Conflict'
              GROUP BY  s.speaker_country
          ),
          all_country as(
              select s.speaker_country as country, COUNT(*) as all_speech
              from meetings m join statements s on m.id = s.meeting_id
              GROUP BY  s.speaker_country
          ),
          c_type as(
            select DISTINCT ptype, (case when ptype = 10 then 'General Warfare'
                        when ptype = 20 then 'Inter-communal Warfare'
                        when ptype = 30 then 'Armed Battle and Clash'
                        when ptype = 31 then 'Armed Attack'
                        when ptype = 40 then 'Pro-Government Terrorism'
                        when ptype = 41 then 'Anti-Government Terrorism'
                        when ptype = 42 then 'Communal Terrorism'
                        when ptype = 50 then 'Organized Violent Riot'
                        when ptype = 51 then 'Spontaneous Violent Riot'
                        when ptype = 60 then 'Organized Demonstration'
                        when ptype = 61 then 'Pro-Government Demonstration'
                        when ptype = 62 then 'Spontaneous Demonstration'
                        else 'Other'
                      end) as conflict
            from conflict_events
          )
          select  ce.country , sum(ce.npart) as num_part, cc.conflict_speech as conflict_speech, (ROUND(cc.conflict_speech /ac.all_speech,2) ) AS ratio
          from conflict_events ce join c_type ct on ce.ptype = ct.ptype join all_country ac on  ce.country = ac.country  join conflict_country  cc on ce.country = cc.country
          where ct.conflict = "${req.params.selectedDecade}"
          group by  ce.country
          order by  sum(ce.npart) DESC, ce.country
      `;
      connection.query(query, function(err, rows, fields) {
        if (err) console.log(err);
        else {
            res.json(rows);
          }
      });

};

// The exported functions, which can be accessed in index.js.
module.exports = {
	getAllGenres: getAllGenres,
	getTopInGenre: getTopInGenre,
  getSpeakersList: getSpeakersList,
	getSpeaker: getSpeaker,
  getRecs: getRecs,
	getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade
}
