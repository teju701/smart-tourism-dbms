import pool from '../db/index.js'

export const getHotelsByCity = async(req,res)=>{
    const{city_id} = req.params;
    try{
        const result = await pool.query(`SELECT * FROM get_hotels_by_city($1)`,[city_id]);
        res.json(result.rows);

    }catch(err){
        console.error("Error fetching hotels:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const addHotel = async(req,res)=>{
    const{city_id,hotel_name,price_per_night,rating} = req.body;
    try{
        const result = await pool.query(
            `CALL add_new_hotel($1,$2,$3,$4)`,[city_id,hotel_name,price_per_night,rating]
        );
        res.json({message: "Hotel Added Successfully"});

    }catch(err){
        console.error("Error adding hotel:", err.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getTopHotelsByCity =  async (req, res) => {
  const { city_id } = req.params;
  try{
  const result = await pool.query('SELECT * FROM get_top_hotels_by_city($1)', [city_id]);
  res.json(result.rows);
  }
  catch(err){
        console.error("Error fetching top hotels:", err.message);
        res.status(500).json({ error: "Internal server error" });
  }
};

