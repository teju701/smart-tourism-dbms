import pool from '../db/index.js';

export const getTransportByCity = async(req,res)=>{
    const{city_id} = req.params;
    try{
        const result = await pool.query(`SELECT * FROM get_transport_by_city($1)`,[city_id]);
        res.json(result.rows);

    }catch(err){
        console.error("Error fetching transport:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};



export const getCheapestTransportByCity = async (req, res) => {
  const { city_id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM get_cheapest_transport($1);", [city_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No transport data found for this city." });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching cheapest transport:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
