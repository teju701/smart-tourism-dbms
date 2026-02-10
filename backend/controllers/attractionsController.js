import pool from '../db/index.js'

export const getAttractionsByCity = async(req,res)=>{
    const{city_id} = req.params;
    try{
        const result = await pool.query(`SELECT * FROM get_attractions_by_city($1)`,[city_id]);
        res.json(result.rows);

    }catch(error){
         console.error("Error fetching attractions", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getTopAttractionsByCity =  async (req, res) => {
  const { city_id } = req.params;
  try{
  const result = await pool.query('SELECT * FROM get_top_attractions($1)', [city_id]);
  res.json(result.rows);
  }
  catch(err){
        console.error("Error fetching top attractions:", err.message);
        res.status(500).json({ error: "Internal server error" });
  }
};

